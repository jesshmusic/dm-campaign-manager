# frozen_string_literal: true

class CampaignSync
  # Makes a session's, quest's or encounter's links the list Foundry sent:
  # [{ linkableType, linkableId, quantity }], with DM Guru ids as the pull
  # returns them. Removes the links not in it (leaving tombstones, as on the
  # website), adds the new ones, and sets every link's quantity and its
  # position (the list's order). Other keys in a link are ignored. Raises
  # Rejected for anything invalid; the caller's transaction undoes the rest.
  class Links
    MAX_LINKS = 100

    # `owner` is the session, quest or encounter; `type` names it in errors
    def initialize(owner, type)
      @owner = owner
      @type = type
    end

    def replace!(list)
      wanted = wanted_from!(list)
      existing = @owner.links.to_a.index_by { |link| [link.linkable_type, link.linkable_id] }
      existing.except(*wanted.keys).each_value(&:destroy!)
      wanted.each_with_index do |((linkable_type, linkable_id), quantity), position|
        link = existing[[linkable_type, linkable_id]]
        if link
          link.assign_attributes(position: position, quantity: quantity)
          link.save! if link.changed?
        else
          @owner.links.create!(linkable_type: linkable_type, linkable_id: linkable_id, position: position, quantity: quantity)
        end
      end
    rescue ActiveRecord::RecordInvalid => e
      rejected!(e)
    end

    # Adds the list's links after the owner's own, keeping their order and
    # quantities; one it already has takes the quantity sent
    def append!(list)
      wanted = wanted_from!(list)
      existing = @owner.links.to_a.index_by { |link| [link.linkable_type, link.linkable_id] }
      position = (existing.values.map(&:position).max || -1) + 1
      wanted.each do |(linkable_type, linkable_id), quantity|
        link = existing[[linkable_type, linkable_id]]
        next link.update!(quantity: quantity) if link

        @owner.links.create!(linkable_type: linkable_type, linkable_id: linkable_id, position: position, quantity: quantity)
        position += 1
      end
    rescue ActiveRecord::RecordInvalid => e
      rejected!(e)
    end

    private

    def rejected!(error)
      raise error unless error.record.is_a?(CampaignLink)

      messages = error.record.errors.full_messages.map { |message| "Links: #{describe(error.record)}: #{message}" }
      raise Rejected, messages
    end

    # { [linkable type, id] => quantity }, in the list's order
    def wanted_from!(list)
      raise Rejected, 'Links must be a list of links' unless list.is_a?(Array) && list.all?(Hash)
      raise Rejected, "Links: no more than #{MAX_LINKS}" if list.size > MAX_LINKS

      list.each_with_object({}) do |link, wanted|
        key = key_for!(link)
        raise Rejected, "Links: #{key.join(' ')} is listed more than once" if wanted.key?(key)

        wanted[key] = link['quantity']
      end
    end

    def key_for!(link)
      linkable_type = link['linkableType']
      linkable_id = link['linkableId'].to_s
      unless @owner.links.klass::LINKABLE_TYPES.include?(linkable_type)
        raise Rejected, "Links: #{linkable_type.inspect.truncate(40)} can't be linked to #{CampaignSync.with_article(@type)}"
      end
      raise Rejected, "Links: #{linkable_type} #{linkable_id.truncate(20)} is not a record id" unless linkable_id.match?(ID_FORMAT)

      [linkable_type, linkable_id.to_i]
    end

    def describe(link)
      "#{link.linkable_type} #{link.linkable_id}"
    end
  end
end

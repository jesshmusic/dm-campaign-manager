# frozen_string_literal: true

# Shared behavior for records that belong directly to a Campaign.
module CampaignRecord
  extend ActiveSupport::Concern
  include CampaignSyncable

  included do
    belongs_to :campaign
    validate :optional_references_exist
    # Not when the whole campaign goes: everything pointing at it goes too
    before_destroy :release_pointers, unless: :destroyed_by_association
  end

  module ClassMethods
    # The [model, foreign key] pairs of the campaign's records that point at
    # this type: a quest's giver_npc_id, a location's parent_id, ...
    def pointers
      @pointers ||= begin
        models = Campaign.reflect_on_all_associations(:has_many).map(&:klass).uniq.select { |model| model < CampaignRecord }
        models.flat_map do |model|
          model.reflect_on_all_associations(:belongs_to)
               .select { |reflection| !reflection.polymorphic? && reflection.klass == self }
               .map { |reflection| [model, reflection.foreign_key] }
        end
      end
    end

    # Validates that each named association, when set, belongs to the same campaign
    def validates_same_campaign(*associations)
      validate do
        associations.each do |association|
          record = public_send(association)
          next if record.nil? || record.campaign_id == campaign_id

          errors.add(association, 'must belong to the same campaign')
        end
      end
    end

    # Validates that a self-referencing parent chain never loops back to the record
    def validates_acyclic_parent(association = :parent, message: "can't be this record or one nested inside it")
      validate do
        next unless persisted?

        ancestor = public_send(association)
        visited = Set.new
        while ancestor && visited.add?(ancestor.id)
          if ancestor.id == id
            errors.add(association, message)
            break
          end
          ancestor = ancestor.public_send(association)
        end
      end
    end

    # For records a session can link to: deleting the record removes those links
    def linkable_from_sessions
      has_many :session_links, class_name: 'CampaignSessionLink', as: :linkable, dependent: :destroy, inverse_of: :linkable
    end

    # For records a quest can link to (NPCs, book references): deleting the record removes those links
    def linkable_from_quests
      has_many :quest_links, class_name: 'CampaignQuestLink', as: :linkable, dependent: :destroy, inverse_of: :linkable
    end

    # Validates a jsonb column holding a list of strings
    def validates_string_list(attribute, max:)
      validate do
        value = public_send(attribute)
        next if value.is_a?(Array) && value.all?(String) && value.size <= max

        errors.add(attribute, "must be a list of up to #{max} entries")
      end
    end
  end

  private

  # Clears the campaign's other records' pointers to this one before it's
  # deleted. The database would (ON DELETE SET NULL), but without bumping their
  # sync versions, so a Foundry pull wouldn't learn of it. Like the database,
  # it skips validations: clearing an optional pointer can't make them fail.
  def release_pointers
    self.class.pointers.each do |model, foreign_key|
      model.where(campaign_id: campaign_id, foreign_key => id).find_each do |record|
        record.update_columns(foreign_key => nil, sync_version: campaign.next_sync_version!, updated_at: Time.current) # rubocop:disable Rails/SkipsModelValidations
      end
    end
  end

  # A set optional reference (faction_id, monster_id, ...) must point at a real
  # record; otherwise saving would raise on the foreign key constraint
  def optional_references_exist
    self.class.reflect_on_all_associations(:belongs_to).each do |reflection|
      next unless reflection.options[:optional]
      next if self[reflection.foreign_key].blank? || public_send(reflection.name)

      errors.add(reflection.name, :required)
    end
  end
end

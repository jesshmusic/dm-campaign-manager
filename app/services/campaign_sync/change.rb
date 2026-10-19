# frozen_string_literal: true

class CampaignSync
  # One change pushed from Foundry (see CampaignSync): updates, creates or
  # deletes one of the campaign's records. #apply returns where it goes in the
  # response, [:applied, entry], [:conflicts, entry] or [:deleted, uuid], or
  # raises Rejected (or ActiveRecord::RecordInvalid) for an error. The caller
  # runs it in a transaction.
  class Change
    OPS = { 'update' => :update_record, 'create' => :create_record, 'delete' => :delete_record }.freeze
    # Pointers to the campaign's other records, by DM Guru id (null clears them)
    ID_FIELDS = %w[parentId factionId npcId giverNpcId locationId statBlockReferenceId].freeze
    UUID_FORMAT = /\A\h{8}-\h{4}-\h{4}-\h{4}-\h{12}\z/
    UUID_V4_FORMAT = /\A\h{8}-\h{4}-4\h{3}-[89ab]\h{3}-\h{12}\z/i

    # `change` is a hash with string keys
    def initialize(campaign, change)
      @campaign = campaign
      @change = change
    end

    def apply
      op = @change['op'].presence || 'update'
      raise Rejected, "Unknown op #{op.inspect.truncate(40)}" unless OPS.key?(op)

      @type = @change['type']
      @config = WRITABLE[@type]
      raise Rejected, "Can't change #{@type.inspect.truncate(40)} records from Foundry" unless @config

      send(OPS[op])
    end

    private

    def update_record
      record = find_record
      raise Rejected, 'Record not found' unless record
      return [:conflicts, entry(record)] if record.sync_version != @change['baseVersion'].to_i

      write!(record)
      [:applied, entry(record.reload)]
    end

    def create_record
      raise Rejected, "Can't create a #{@type} from Foundry" unless collection

      record = collection.new(uuid: new_uuid!)
      write!(record)
      [:applied, entry(record.reload)]
    end

    # Deleting what's already gone (or was never here) is done too
    def delete_record
      raise Rejected, "Can't delete a #{@type} from Foundry" unless collection

      uuid = @change['uuid']
      raise Rejected, 'uuid must be a UUID' unless uuid.is_a?(String) && uuid.match?(UUID_FORMAT)

      collection.find_by(uuid: uuid.downcase)&.destroy!
      [:deleted, uuid]
    end

    def entry(record)
      { type: @type, uuid: record.uuid, current: CampaignSync.sync_json(record) }
    end

    # The campaign's records of this type (nil for the campaign itself)
    def collection
      @config[:collection] && @campaign.public_send(@config[:collection])
    end

    def find_record
      uuid = @change['uuid'].to_s
      return (@campaign if uuid.downcase == @campaign.uuid) unless collection

      collection.find_by(uuid: uuid)
    end

    # A new record's uuid: a UUID v4 not used by anything in the campaign,
    # deleted or not, nor by any other record of its type
    def new_uuid!
      uuid = @change['uuid']
      raise Rejected, 'uuid must be a UUID v4' unless uuid.is_a?(String) && uuid.match?(UUID_V4_FORMAT)

      uuid = uuid.downcase
      used = uuid == @campaign.uuid || @campaign.tombstones.exists?(record_uuid: uuid) ||
             collection.klass.exists?(uuid: uuid) ||
             COLLECTIONS.each_value.any? { |association| @campaign.public_send(association).exists?(uuid: uuid) }
      raise Rejected, 'uuid is already used' if used

      uuid
    end

    # Sets the attributes sent (and the links), or raises Rejected
    def write!(record)
      payload = @change['attributes'] || {}
      raise Rejected, 'attributes must be an object' unless payload.is_a?(Hash)

      unknown = payload.keys - @config[:fields]
      raise Rejected, "Can't set #{unknown.first(5).map { |key| key.truncate(40) }.join(', ')} on a #{@type}" if unknown.any?

      assign!(record, payload.except('links'))
      save_record!(record, payload.keys.map(&:underscore))
      Links.new(record, @type).replace!(payload['links']) if payload.key?('links')
    end

    def assign!(record, payload)
      problems = payload.filter_map { |key, value| value_problem(record, key, value) }
      raise Rejected, problems if problems.any?

      payload.each do |key, value|
        case key
        when 'revealedSessionUuid' then record.revealed_session = session_for(value)
        when *ID_FIELDS then record[key.underscore] = value.presence&.to_s&.to_i
        when 'portents' then record.portents = portents(value)
        else record.public_send(:"#{key.underscore}=", value)
        end
      end
    end

    # Values that would be quietly mangled, or fail on save: ids that aren't
    # ids, lists or objects for plain columns, dates that aren't dates
    def value_problem(record, key, value)
      attribute = key.underscore
      label = record.class.human_attribute_name(attribute)
      return "#{label} must be a record id" if ID_FIELDS.include?(key) && !record_id?(value)

      column = record.class.columns_hash[attribute]
      return if column.nil? || column.type == :jsonb
      return "#{label} is invalid" if value.is_a?(Hash) || value.is_a?(Array)

      "#{label} must be a date (YYYY-MM-DD)" if column.type == :date && !date?(value)
    end

    def record_id?(value)
      value.nil? || value == '' || value.to_s.match?(ID_FORMAT)
    end

    def date?(value)
      value.nil? || (value.is_a?(String) && (value.blank? || ActiveModel::Type::Date.new.cast(value).present?))
    end

    # Each portent is an object; anything else becomes one with no text, which validation rejects
    def portents(value)
      Array.wrap(value).map { |portent| portent.is_a?(Hash) ? portent : {} }
    end

    def session_for(uuid)
      uuid.present? ? @campaign.sessions.find_by(uuid: uuid.to_s) : nil
    end

    # A null for a column that can't be null fails here, not in the database
    def save_record!(record, attributes)
      record.validate
      attributes.each do |attribute|
        column = record.class.columns_hash[attribute]
        next unless column && !column.null && record[attribute].nil? && record.errors[attribute].empty?

        record.errors.add(attribute, :blank)
      end
      raise Rejected, record.errors.full_messages if record.errors.any?

      record.save!
    end
  end
end

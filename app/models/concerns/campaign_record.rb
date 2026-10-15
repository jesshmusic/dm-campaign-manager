# frozen_string_literal: true

# Shared behavior for records that belong directly to a Campaign.
module CampaignRecord
  extend ActiveSupport::Concern
  include CampaignSyncable

  included do
    belongs_to :campaign
    validate :optional_references_exist
  end

  module ClassMethods
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

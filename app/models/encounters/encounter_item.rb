# frozen_string_literal: true

# == Schema Information
#
# Table name: encounter_items
#
#  id           :bigint           not null, primary key
#  quantity     :integer          default(1), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  encounter_id :bigint
#  item_id      :bigint
#
# Indexes
#
#  index_encounter_items_on_encounter_id  (encounter_id)
#  index_encounter_items_on_item_id       (item_id)
#
# Foreign Keys
#
#  fk_rails_...  (encounter_id => encounters.id)
#  fk_rails_...  (item_id => items.id)
#


class EncounterItem < ApplicationRecord
  validates :quantity, presence: true

  belongs_to :encounter
  belongs_to :item
end

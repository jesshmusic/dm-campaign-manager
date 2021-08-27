# frozen_string_literal: true

# == Schema Information
#
# Table name: condition_immunities
#
#  id           :bigint           not null, primary key
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  condition_id :bigint
#  monster_id   :bigint
#
# Indexes
#
#  index_condition_immunities_on_condition_id  (condition_id)
#  index_condition_immunities_on_monster_id    (monster_id)
#

class ConditionImmunity < ApplicationRecord
  belongs_to :condition
  belongs_to :monster
end

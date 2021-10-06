# == Schema Information
#
# Table name: ability_bonus_options
#
#  id         :bigint           not null, primary key
#  ability    :string
#  bonus      :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  race_id    :bigint           not null
#
# Indexes
#
#  index_ability_bonus_options_on_race_id  (race_id)
#
# Foreign Keys
#
#  fk_rails_...  (race_id => races.id)
#
class AbilityBonusOption < ApplicationRecord
  belongs_to :race
end

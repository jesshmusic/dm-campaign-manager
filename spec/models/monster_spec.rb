# == Schema Information
#
# Table name: monsters
#
#  id                     :bigint           not null, primary key
#  alignment              :string
#  api_url                :string
#  armor_class            :integer
#  challenge_rating       :integer
#  charisma               :integer
#  charisma_save          :integer
#  condition_immunities   :string
#  constitution           :integer
#  constitution_save      :integer
#  damage_immunities      :string
#  damage_resistances     :string
#  damage_vulnerabilities :string
#  dexterity              :integer
#  dexterity_save         :integer
#  hit_dice               :string
#  hit_points             :integer
#  intelligence           :integer
#  intelligence_save      :integer
#  languages              :string
#  name                   :string
#  senses                 :string
#  size                   :string
#  skills                 :jsonb            is an Array
#  speed                  :string
#  strength               :integer
#  strength_save          :integer
#  subtype                :string
#  type                   :string
#  wisdom                 :integer
#  wisdom_save            :integer
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#

require 'rails_helper'

RSpec.describe Monster, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

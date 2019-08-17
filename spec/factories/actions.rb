# frozen_string_literal: true

# == Schema Information
#
# Table name: actions
#
#  id           :bigint           not null, primary key
#  attack_bonus :integer
#  damage_bonus :integer
#  damage_dice  :string
#  description  :text
#  name         :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

FactoryBot.define do
  factory :action do
    name { 'MyString' }
    description { 'MyText' }
    attack_bonus { 1 }
    damage_bonus { 1 }
    damage_dice { 'MyString' }
  end
end

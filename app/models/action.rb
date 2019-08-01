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

class Action < ApplicationRecord
end

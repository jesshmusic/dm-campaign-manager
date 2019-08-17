# frozen_string_literal: true

# == Schema Information
#
# Table name: skills
#
#  id           :bigint           not null, primary key
#  name         :string
#  score        :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  character_id :bigint
#  monster_id   :bigint
#
# Indexes
#
#  index_skills_on_character_id  (character_id)
#  index_skills_on_monster_id    (monster_id)
#

class Skill < ApplicationRecord
  validates :name, :score, presence: true

  belongs_to :monster, optional: true
  belongs_to :character, optional: true
end

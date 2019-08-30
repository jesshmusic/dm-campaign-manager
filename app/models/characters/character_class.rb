# frozen_string_literal: true

# == Schema Information
#
# Table name: character_classes
#
#  id                 :bigint           not null, primary key
#  level              :integer          default(1)
#  proficiency_bonus  :integer          default(2)
#  spell_attack_bonus :integer          default(2)
#  spell_save_dc      :integer          default(8)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  character_id       :bigint
#  dnd_class_id       :bigint
#
# Indexes
#
#  index_character_classes_on_character_id  (character_id)
#  index_character_classes_on_dnd_class_id  (dnd_class_id)
#
# Foreign Keys
#
#  fk_rails_...  (character_id => characters.id)
#  fk_rails_...  (dnd_class_id => dnd_classes.id)
#

class CharacterClass < ApplicationRecord

  belongs_to :character
  belongs_to :dnd_class

  def setup_spell_scores(char)
    self.spell_attack_bonus = DndRules.spell_attack_bonus(proficiency_bonus, dnd_class, char)
    self.spell_save_dc = 8 + spell_attack_bonus
  end

  def class_and_level
    "Level #{level} #{dnd_class.name}"
  end
end

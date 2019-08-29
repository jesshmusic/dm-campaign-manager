# frozen_string_literal: true

# == Schema Information
#
# Table name: character_spells
#
#  id           :bigint           not null, primary key
#  is_prepared  :boolean          default(FALSE), not null
#  spell_class  :string
#  character_id :bigint
#  spell_id     :bigint
#
# Indexes
#
#  index_character_spells_on_character_id  (character_id)
#  index_character_spells_on_spell_id      (spell_id)
#

class CharacterSpell < ApplicationRecord
  belongs_to :character
  belongs_to :spell
end

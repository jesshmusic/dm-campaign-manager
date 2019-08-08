# == Schema Information
#
# Table name: character_magic_items
#
#  id            :bigint           not null, primary key
#  character_id  :bigint
#  magic_item_id :bigint
#
# Indexes
#
#  index_character_magic_items_on_character_id   (character_id)
#  index_character_magic_items_on_magic_item_id  (magic_item_id)
#

class CharacterMagicItem < ApplicationRecord
  belongs_to :character
  belongs_to :magic_item
end

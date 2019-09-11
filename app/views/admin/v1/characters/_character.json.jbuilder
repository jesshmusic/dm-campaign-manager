# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! character, :id, :name, :alignment, :proficiency, :slug, :background,
              :copper_pieces, :description, :electrum_pieces, :gold_pieces, :languages,
              :platinum_pieces, :role, :silver_pieces, :type, :xp, :armor_class, :strength,
              :dexterity, :constitution, :intelligence, :wisdom, :charisma, :hit_points,
              :hit_points_current, :initiative

json.total_level character.total_level
json.hit_dice character.hit_dice
json.classes character.classes
json.campaign character.campaign
json.race character.race

json.character_classes character.character_classes do |character_class|
  json.id character_class.id
  json.dnd_class_id character_class.dnd_class.id
  json.dnd_class character_class.dnd_class.name
  json.level character_class.level
  json.spell_ability character_class.dnd_class.spell_ability
  json.spell_save_dc character_class.spell_save_dc
  json.spell_attack_bonus character_class.spell_attack_bonus
end

if character.armor
  json.armor character.armor do |armor|
    json.extract! armor, :id, :name, :description, :armor_class, :armor_dex_bonus,
                  :armor_max_bonus, :armor_stealth_disadvantage, :armor_str_minimum
  end
end

if character.shield
  json.armor character.shield do |shield|
    json.extract! shield, :id, :name, :description
  end
end

if character.weapon_lh
  json.armor character.weapon_lh do |weapon_lh|
    json.extract! weapon_lh, :id, :name, :description, :category_range, :weapon_damage_dice_count,
                  :weapon_damage_dice_value, :weapon_damage_type, :weapon_properties, :weapon_range, :weapon_range_long,
                  :weapon_range_normal, :weapon_thrown_range_long, :weapon_thrown_range_normal
  end
end

if character.weapon_rh
  json.armor character.weapon_rh do |weapon_rh|
    json.extract! weapon_rh, :id, :name, :description, :category_range, :weapon_damage_dice_count,
                  :weapon_damage_dice_value, :weapon_damage_type, :weapon_properties, :weapon_range,
                  :weapon_range_long, :weapon_range_normal, :weapon_thrown_range_long, :weapon_thrown_range_normal
  end
end

if character.weapon_2h
  json.armor character.weapon_rh do |weapon_rh|
    json.extract! weapon_rh, :id, :name, :description, :category_range, :weapon_2h_damage_dice_count,
                  :weapon_2h_damage_dice_value, :weapon_2h_damage_type, :weapon_properties, :weapon_range,
                  :weapon_range_long, :weapon_range_normal, :weapon_thrown_range_long, :weapon_thrown_range_normal
  end
end

json.inventory character.character_items do |character_item|
  json.name character_item.item.name
  json.quantity character_item.quantity
  json.equipped character_item.equipped
  json.carrying character_item.carrying
  json.partial! 'admin/v1/items/item_summary', item: character_item.item
end

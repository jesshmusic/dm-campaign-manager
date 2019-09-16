# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! character, :id, :name, :alignment, :proficiency, :slug, :background,
              :copper_pieces, :description, :electrum_pieces, :gold_pieces, :languages,
              :platinum_pieces, :role, :silver_pieces, :type, :xp, :armor_class, :armor_class_modifier, :strength,
              :dexterity, :constitution, :intelligence, :wisdom, :charisma, :hit_points,
              :hit_points_current, :initiative

json.total_level character.total_level
json.hit_dice character.hit_dice
json.classes character.classes

json.campaign do
  json.extract! character.campaign, :id, :name, :description, :world, :slug, :user_id
end

json.race do
  json.extract! character.race, :id, :name, :speed, :strength_modifier, :dexterity_modifier,
                :constitution_modifier, :intelligence_modifier, :wisdom_modifier, :charisma_modifier
end

json.character_classes character.character_classes do |character_class|
  json.id character_class.id
  json.dnd_class_id character_class.dnd_class.id
  json.dnd_class character_class.dnd_class.name
  json.level character_class.level
  json.spell_ability character_class.dnd_class.spell_ability
  json.spell_save_dc character_class.spell_save_dc
  json.spell_attack_bonus character_class.spell_attack_bonus

  if character.cantrips&.count&.positive?
    json.spells_cantrips character.cantrips do |cantrip|
      next unless cantrip.spell_class == character_class.dnd_class.name

      json.value cantrip.spell_id
      json.label cantrip.spell.name
      json.data do
        json.is_prepared cantrip.is_prepared
        json.spell_class cantrip.spell_class
        json.character_spell_id cantrip.id
      end
    end
  end

  if character.spells_level_1&.count&.positive?
    json.spells_level_1 character.spells_level_1 do |spell|
      next unless spell.spell_class == character_class.dnd_class.name

      json.value spell.spell_id
      json.label spell.spell.name
      json.data do
        json.is_prepared spell.is_prepared
        json.spell_class spell.spell_class
        json.character_spell_id spell.id
      end
    end
  end

  if character.spells_level_2&.count&.positive?
    json.spells_level_2 character.spells_level_2 do |spell|
      next unless spell.spell_class == character_class.dnd_class.name

      json.value spell.spell_id
      json.label spell.spell.name
      json.data do
        json.is_prepared spell.is_prepared
        json.spell_class spell.spell_class
        json.character_spell_id spell.id
      end
    end
  end

  if character.spells_level_3&.count&.positive?
    json.spells_level_3 character.spells_level_3 do |spell|
      next unless spell.spell_class == character_class.dnd_class.name

      json.value spell.spell_id
      json.label spell.spell.name
      json.data do
        json.is_prepared spell.is_prepared
        json.spell_class spell.spell_class
        json.character_spell_id spell.id
      end
    end
  end

  if character.spells_level_4&.count&.positive?
    json.spells_level_4 character.spells_level_4 do |spell|
      next unless spell.spell_class == character_class.dnd_class.name

      json.value spell.spell_id
      json.label spell.spell.name
      json.data do
        json.is_prepared spell.is_prepared
        json.spell_class spell.spell_class
        json.character_spell_id spell.id
      end
    end
  end

  if character.spells_level_5&.count&.positive?
    json.spells_level_5 character.spells_level_5 do |spell|
      next unless spell.spell_class == character_class.dnd_class.name

      json.value spell.spell_id
      json.label spell.spell.name
      json.data do
        json.is_prepared spell.is_prepared
        json.spell_class spell.spell_class
        json.character_spell_id spell.id
      end
    end
  end

  if character.spells_level_6&.count&.positive?
    json.spells_level_6 character.spells_level_6 do |spell|
      next unless spell.spell_class == character_class.dnd_class.name

      json.value spell.spell_id
      json.label spell.spell.name
      json.data do
        json.is_prepared spell.is_prepared
        json.spell_class spell.spell_class
        json.character_spell_id spell.id
      end
    end
  end

  if character.spells_level_7&.count&.positive?
    json.spells_level_7 character.spells_level_7 do |spell|
      next unless spell.spell_class == character_class.dnd_class.name

      json.value spell.spell_id
      json.label spell.spell.name
      json.data do
        json.is_prepared spell.is_prepared
        json.spell_class spell.spell_class
        json.character_spell_id spell.id
      end
    end
  end

  if character.spells_level_8&.count&.positive?
    json.spells_level_8 character.spells_level_8 do |spell|
      next unless spell.spell_class == character_class.dnd_class.name

      json.value spell.spell_id
      json.label spell.spell.name
      json.data do
        json.is_prepared spell.is_prepared
        json.spell_class spell.spell_class
        json.character_spell_id spell.id
      end
    end
  end

  if character.spells_level_9&.count&.positive?
    json.spells_level_9 character.spells_level_9 do |spell|
      next unless spell.spell_class == character_class.dnd_class.name

      json.value spell.spell_id
      json.label spell.spell.name
      json.data do
        json.is_prepared spell.is_prepared
        json.spell_class spell.spell_class
        json.character_spell_id spell.id
      end
    end
  end
end

if character.armor
  json.armor do
    json.value character.armor.id
    json.label character.armor.name
    json.data do
      json.armor_dex_bonus character.armor.armor_dex_bonus
      json.armor_class character.armor.armor_class
    end
  end
end

if character.shield
  json.shield do
    json.value character.shield.id
    json.label character.shield.name
    json.data do
      json.armor_dex_bonus character.shield.armor_dex_bonus
      json.armor_class character.shield.armor_class
    end
  end
end

if character.weapon_lh
  json.weapon_lh do
    json.value character.weapon_lh.id
    json.label character.weapon_lh.name
    json.data do
      json.weapon_damage_dice_count character.weapon_lh.weapon_damage_dice_count
      json.weapon_damage_dice_value character.weapon_lh.weapon_damage_dice_value
      json.weapon_damage_type character.weapon_lh.weapon_damage_type
      json.weapon_range character.weapon_lh.weapon_range
      json.subcategory character.weapon_lh.sub_category
      json.weapon_properties character.weapon_lh.weapon_properties
    end
  end
end

if character.weapon_rh
  json.weapon_rh do
    json.value character.weapon_rh.id
    json.label character.weapon_rh.name
    json.data do
      json.weapon_damage_dice_count character.weapon_rh.weapon_damage_dice_count
      json.weapon_damage_dice_value character.weapon_rh.weapon_damage_dice_value
      json.weapon_damage_type character.weapon_rh.weapon_damage_type
      json.weapon_range character.weapon_rh.weapon_range
      json.subcategory character.weapon_rh.sub_category
      json.weapon_properties character.weapon_rh.weapon_properties
    end
  end
end

if character.weapon_2h
  json.weapon_2h do
    json.value character.weapon_2h.id
    json.label character.weapon_2h.name
    json.data do
      json.weapon_2h_damage_dice_count character.weapon_2h.weapon_2h_damage_dice_count
      json.weapon_2h_damage_dice_value character.weapon_2h.weapon_2h_damage_dice_value
      json.weapon_2h_damage_type character.weapon_2h.weapon_2h_damage_type
      json.weapon_damage_dice_count character.weapon_2h.weapon_damage_dice_count
      json.weapon_damage_dice_value character.weapon_2h.weapon_damage_dice_value
      json.weapon_damage_type character.weapon_2h.weapon_damage_type
      json.weapon_range character.weapon_2h.weapon_range
      json.subcategory character.weapon_2h.sub_category
      json.weapon_properties character.weapon_2h.weapon_properties
    end
  end
end

json.inventory character.character_items do |character_item|
  json.name character_item.item.name
  json.quantity character_item.quantity
  json.equipped character_item.equipped
  json.carrying character_item.carrying
  json.partial! 'admin/v1/items/item_summary', item: character_item.item
end

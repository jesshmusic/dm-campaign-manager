# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! character, :id, :name, :alignment, :proficiency, :slug, :background,
              :copper_pieces, :description, :electrum_pieces, :gold_pieces, :languages,
              :platinum_pieces, :silver_pieces, :type, :xp, :armor_class, :armor_class_modifier, :strength,
              :dexterity, :constitution, :intelligence, :wisdom, :charisma, :hit_points,
              :hit_points_current, :initiative, :hit_points_current, :status

json.total_level character.total_level
json.hit_dice character.hit_dice
json.classes character.classes

if character.type == 'NonPlayerCharacter'
  json.role character.role
  json.challenge_rating character.challenge_rating
end

json.campaign do
  json.extract! character.campaign, :id, :name, :description, :world, :slug, :user_id
end

json.race do
  json.extract! character.race, :id, :name, :speed, :strength_modifier, :dexterity_modifier,
                :constitution_modifier, :intelligence_modifier, :wisdom_modifier, :charisma_modifier
end

json.skills character.skills do |skill|
  json.extract! skill, :id, :name, :score
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
        json.description_text cantrip.spell.description_text
        json.info do
          json.extract! cantrip.spell, :casting_time, :components, :concentration, :description, :duration,
                        :higher_level, :material, :range, :ritual, :school
        end
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
        json.description_text spell.spell.description_text
        json.info do
          json.extract! spell.spell, :casting_time, :components, :concentration, :description, :duration,
                        :higher_level, :material, :range, :ritual, :school
        end
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
        json.description_text spell.spell.description_text
        json.info do
          json.extract! spell.spell, :casting_time, :components, :concentration, :description, :duration,
                        :higher_level, :material, :range, :ritual, :school
        end
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
        json.description_text spell.spell.description_text
        json.info do
          json.extract! spell.spell, :casting_time, :components, :concentration, :description, :duration,
                        :higher_level, :material, :range, :ritual, :school
        end
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
        json.description_text spell.spell.description_text
        json.info do
          json.extract! spell.spell, :casting_time, :components, :concentration, :description, :duration,
                        :higher_level, :material, :range, :ritual, :school
        end
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
        json.description_text spell.spell.description_text
        json.info do
          json.extract! spell.spell, :casting_time, :components, :concentration, :description, :duration,
                        :higher_level, :material, :range, :ritual, :school
        end
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
        json.description_text spell.spell.description_text
        json.info do
          json.extract! spell.spell, :casting_time, :components, :concentration, :description, :duration,
                        :higher_level, :material, :range, :ritual, :school
        end
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
        json.description_text spell.spell.description_text
        json.info do
          json.extract! spell.spell, :casting_time, :components, :concentration, :description, :duration,
                        :higher_level, :material, :range, :ritual, :school
        end
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
        json.description_text spell.spell.description_text
        json.info do
          json.extract! spell.spell, :casting_time, :components, :concentration, :description, :duration,
                        :higher_level, :material, :range, :ritual, :school
        end
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
        json.description_text spell.spell.description_text
        json.info do
          json.extract! spell.spell, :casting_time, :components, :concentration,
                        :duration, :material, :range, :ritual, :school

          json.description spell.spell.description
          json.higher_level spell.spell.higher_level
        end
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
      json.armor_class_bonus character.armor.armor_class_bonus
    end
  end
end

if character.shield
  json.shield do
    json.value character.shield.id
    json.label character.shield.name
    json.data do
      json.armor_dex_bonus character.shield.armor_dex_bonus
      json.armor_class_bonus character.shield.armor_class_bonus
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
      json.weapon_attack_bonus character.weapon_lh.weapon_attack_bonus
      json.weapon_damage_bonus character.weapon_lh.weapon_damage_bonus
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
      json.weapon_attack_bonus character.weapon_rh.weapon_attack_bonus
      json.weapon_damage_bonus character.weapon_rh.weapon_damage_bonus
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
      json.weapon_attack_bonus character.weapon_2h.weapon_attack_bonus
      json.weapon_damage_bonus character.weapon_2h.weapon_damage_bonus
    end
  end
end

json.actions character.character_actions do |action|
  json.id action.id
  json.attack_bonus action.attack_bonus
  json.damage_bonus action.damage_bonus
  json.damage_dice action.damage_dice
  json.description action.description
  json.name action.name
end

json.inventory character.character_items do |character_item|
  if character_item.item.type != 'ArmorItem' && character_item.item.type != 'WeaponItem'
    json.id character_item.id
    json.name character_item.item.name
    json.quantity character_item.quantity
    json.equipped character_item.equipped
    json.carrying character_item.carrying
    json.item_id character_item.item.id
    json.extract! character_item.item, :type, :cost_unit, :cost_value, :description,
                  :name, :sub_category, :rarity, :requires_attunement, :weight, :slug

    json.contained_items character_item.item.contained_items do |next_item|
      json.extract! next_item, :id, :type, :cost_unit, :cost_value, :description,
                    :name, :sub_category, :rarity, :requires_attunement, :weight, :slug
    end
  end
end

json.armors character.armors do |armor|
  json.id armor.id
  json.armor_id armor.item.id
  json.quantity armor.quantity
  json.carrying armor.carrying
  json.equipped armor.equipped
  json.extract! armor.item, :name, :category, :sub_category, :cost_unit, :cost_value, :description, :weight, :type
  json.extract! armor.item, :armor_class, :armor_dex_bonus,
                :armor_max_bonus, :armor_stealth_disadvantage, :armor_str_minimum,
                :armor_class_bonus
  json.equipped_armor armor.item.id == character.armor_id
  json.equipped_shield armor.item.id == character.shield_id
end

json.one_handed_weapons character.one_handed_weapons do |one_handed_weapon|
  json.id one_handed_weapon.id
  json.weapon_id one_handed_weapon.item.id
  json.quantity one_handed_weapon.quantity
  json.carrying one_handed_weapon.carrying
  json.equipped one_handed_weapon.equipped
  json.extract! one_handed_weapon.item, :name, :category, :sub_category, :cost_unit, :cost_value, :description, :weight, :type
  json.extract! one_handed_weapon.item, :category_range, :weapon_2h_damage_dice_count, :weapon_2h_damage_dice_value,
                :weapon_2h_damage_type, :weapon_damage_dice_count, :weapon_damage_dice_value, :weapon_damage_type,
                :weapon_properties, :weapon_range, :weapon_range_long, :weapon_range_normal, :weapon_thrown_range_long,
                :weapon_thrown_range_normal, :weapon_attack_bonus, :weapon_damage_bonus
  json.equipped_main_hand one_handed_weapon.item.id == character.weapon_rh_id
  json.equipped_off_hand one_handed_weapon.item.id == character.weapon_lh_id
end

json.two_handed_weapons character.two_handed_weapons do |two_handed_weapon|
  json.id two_handed_weapon.id
  json.weapon_id two_handed_weapon.item.id
  json.quantity two_handed_weapon.quantity
  json.carrying two_handed_weapon.carrying
  json.equipped two_handed_weapon.equipped
  json.extract! two_handed_weapon.item, :name, :category, :sub_category, :cost_unit, :cost_value, :description, :weight, :type
  json.extract! two_handed_weapon.item, :category_range, :weapon_2h_damage_dice_count, :weapon_2h_damage_dice_value,
                :weapon_2h_damage_type, :weapon_damage_dice_count, :weapon_damage_dice_value, :weapon_damage_type,
                :weapon_properties, :weapon_range, :weapon_range_long, :weapon_range_normal, :weapon_thrown_range_long,
                :weapon_thrown_range_normal, :weapon_attack_bonus, :weapon_damage_bonus
  json.equipped_two_hand two_handed_weapon.item.id == character.weapon_2h_id
end
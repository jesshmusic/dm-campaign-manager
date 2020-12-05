# frozen_string_literal: true

namespace :update_records do
  task parse_weapon_bonuses: :environment do
    WeaponItem.all.each do |weapon|
      if weapon.name.include? "+1"
        weapon.weapon_attack_bonus = 1
        weapon.weapon_damage_bonus = 1
      elsif weapon.name.include? "+2"
        weapon.weapon_attack_bonus = 2
        weapon.weapon_damage_bonus = 2
      elsif weapon.name.include? "3"
        weapon.weapon_attack_bonus = 3
        weapon.weapon_damage_bonus = 3
      else
        weapon.weapon_attack_bonus = 0
        weapon.weapon_damage_bonus = 0
      end
      weapon.save!
    end
  end

  task armor_class_bonuses: :environment do
    ArmorItem.where(rarity: nil).each do |standard_armor|
      ArmorItem.create!(
        name: "#{standard_armor.name}, +1",
        rarity: 'rare',
        armor_class_bonus: 1,
        description: 'You have a bonus to AC while wearing this armor.',
        sub_category: standard_armor.sub_category,
        armor_class: standard_armor.armor_class,
        armor_dex_bonus: standard_armor.armor_dex_bonus,
        armor_max_bonus: standard_armor.armor_max_bonus,
        armor_stealth_disadvantage: standard_armor.armor_stealth_disadvantage,
        armor_str_minimum: standard_armor.armor_str_minimum,
        weight: standard_armor.weight,
      )
      ArmorItem.create!(
        name: "#{standard_armor.name}, +2",
        rarity: 'very rare',
        armor_class_bonus: 2,
        description: 'You have a bonus to AC while wearing this armor.',
        sub_category: standard_armor.sub_category,
        armor_class: standard_armor.armor_class,
        armor_dex_bonus: standard_armor.armor_dex_bonus,
        armor_max_bonus: standard_armor.armor_max_bonus,
        armor_stealth_disadvantage: standard_armor.armor_stealth_disadvantage,
        armor_str_minimum: standard_armor.armor_str_minimum,
        weight: standard_armor.weight,
        )
      ArmorItem.create!(
        name: "#{standard_armor.name}, +3",
        rarity: 'legendary',
        armor_class_bonus: 3,
        description: 'You have a bonus to AC while wearing this armor.',
        sub_category: standard_armor.sub_category,
        armor_class: standard_armor.armor_class,
        armor_dex_bonus: standard_armor.armor_dex_bonus,
        armor_max_bonus: standard_armor.armor_max_bonus,
        armor_stealth_disadvantage: standard_armor.armor_stealth_disadvantage,
        armor_str_minimum: standard_armor.armor_str_minimum,
        weight: standard_armor.weight,
        )
    end

    # Demon Armor
    updated_armor = ArmorItem.find_by(name: 'Demon Armor, Plate')
    updated_armor.armor_class_bonus = 1
    updated_armor.name = 'Demon Armor'
    updated_armor.save!

    # Dragon Scale Armor
    updated_armor = ArmorItem.find_by(name: 'Dragon Scale Mail, Scale Mail')
    updated_armor.armor_class_bonus = 1
    updated_armor.name = 'Dragon Scale Mail'
    updated_armor.save!

    # Elven Chain Armor
    updated_armor = ArmorItem.find_by(name: 'Elven Chain, Chain Shirt')
    updated_armor.armor_class_bonus = 1
    updated_armor.name = 'Elven Chain'
    updated_armor.save!

    # Glamoured Studded Leather Armor
    updated_armor = ArmorItem.find_by(name: 'Glamoured Studded Leather, Studded Leather')
    updated_armor.armor_class_bonus = 1
    updated_armor.name = 'Glamoured Studded Leather'
    updated_armor.save!

    # Mithral Armor
    updated_armors = ArmorItem.where("name like ?", "%Mithral Armor%")
    updated_armors.each do |next_armor|
      next_armor.armor_class_bonus = 0
      next_armor.armor_stealth_disadvantage = false
      next_armor.armor_str_minimum = 0
      next_armor.save!
    end

    ArmorItem.where(sub_category: 'Shield').each do |next_shield|
      next_shield.armor_class = nil
      next_shield.armor_class_bonus = 2
      next_shield.save!
    end

    # Shields
    ArmorItem.create!(
      name: "Shield, +1",
      rarity: 'rare',
      armor_class_bonus: 3,
      description: 'While holding this shield, you have a bonus to AC',
      sub_category: 'Shield',
      weight: 6,
      )
    ArmorItem.create!(
      name: "Shield, +2",
      rarity: 'very rare',
      armor_class_bonus: 4,
      description: 'While holding this shield, you have a bonus to AC',
      sub_category: 'Shield',
      weight: 6,
      )
    ArmorItem.create!(
      name: "Shield, +3",
      rarity: 'legendary',
      armor_class_bonus: 5,
      description: 'While holding this shield, you have a bonus to AC',
      sub_category: 'Shield',
      weight: 6,
      )
  end

  task armor_defaults: :environment do
    ArmorItem.where(armor_class_bonus: nil).each do |armor|
      armor.armor_class_bonus = 0
      armor.save!
    end
  end

  task update_items: :environment do
    Character.all.each do |character|
      character.equipment_items.each do |equipment_item|
        character.character_items.create!(
          quantity: equipment_item.quantity,
          item: equipment_item.items.first
        )
      end
    end

    Encounter.all.each do |encounter|
      encounter.equipment_items.each do |equipment_item|
        encounter.encounter_items.create!(
          quantity: equipment_item.quantity,
          item: equipment_item.items.first
        )
      end
    end
  end

  task remove_player_role: :environment do
    User.all.each do |next_user|
      next_user.role = :dungeon_master if next_user.role == 'admin'
      next_user.role = :admin if next_user.role.nil?
      next_user.save!
    end
  end

  task fix_magic_armor_sub_cats: :environment do
    ArmorItem.where(sub_category: 'Armor (medium or heavy)').or(ArmorItem.where(sub_category: 'Armor (medium or heavy')).each do |armor_item|

      ['Chain Mail', 'Plate', 'Ring Mail', 'Splint'].each do |armor_str|
        if armor_item.name.include? armor_str
          armor_item.sub_category = 'Heavy'
          armor_item.save!
          break
        end
      end
      ['Breastplate', 'Chain Shirt', 'Half Plate', 'Hide', 'Scale Mail'].each do |armor_str|
        if armor_item.name.include? armor_str
          armor_item.sub_category = 'Medium'
          armor_item.save!
          break
        end
      end
    end

    ArmorItem.where(sub_category: 'Armor (shield)').update_all(sub_category: 'Shield')
    ArmorItem.where(sub_category: 'Armor (plate)').update_all(sub_category: 'Heavy')
    ArmorItem.where(sub_category: 'Armor (light').update_all(sub_category: 'Light')
    ArmorItem.where(sub_category: 'Armor (scale mail)').update_all(sub_category: 'Medium')
    ArmorItem.where(sub_category: 'Armor (chain shirt)').update_all(sub_category: 'Medium')
    ArmorItem.where(sub_category: 'Armor (studded leather)').update_all(sub_category: 'Light')
    ArmorItem.find_by(name: 'Adamantine Armor, Shield').destroy!
    ArmorItem.find_by(name: 'Mithral Armor, Shield').destroy!
  end

  task fix_magic_weapon_cats: :environment do
    WeaponItem.all.each do |weapon|
      if weapon.weapon_range == 'Martial Melee' || weapon.weapon_range == 'Martial Ranged'
        weapon.update_attribute(:sub_category, 'Martial')
      else
        weapon.update_attribute(:sub_category, 'Simple')
      end
    end
  end

  task spell_cantrips: :environment do
    Spell.where('level < 0').update_all(level: 0)
  end

  task spells: :environment do
    Spell.find_each do |spell|
      spell.spell_level = spell.get_spell_level_text
      spell_uri = URI(spell.api_url)
      spell_response = Net::HTTP.get(spell_uri)
      spell_result = JSON.parse spell_response, symbolize_names: true
      spell_result[:classes].each do |dnd_class_name|
        dnd_class = DndClass.find_by(name: dnd_class_name[:name])
        spell.dnd_classes << dnd_class if dnd_class
      end
      spell.save!
    end
  end

  task generate_slugs: :environment do
    dnd_classes = DndClass.where('slug IS NULL')
    dnd_classes.find_each do |dnd_class|
      dnd_class_slug = dnd_class.name.parameterize.truncate(80, omission: '')
      dnd_class.slug = DndClass.exists?(slug: dnd_class_slug) ? "#{dnd_class_slug}_#{dnd_class.id}" : dnd_class_slug
      dnd_class.save!
    end

    campaigns = Campaign.where('slug IS NULL')
    campaigns.find_each do |campaign|
      campaign_slug = campaign.name.parameterize.truncate(80, omission: '')
      campaign.slug = Campaign.exists?(slug: campaign_slug) ? "#{campaign_slug}_#{campaign.id}" : campaign_slug
      campaign.save!
    end

    items = Item.where('slug IS NULL')
    items.find_each do |item|
      item_slug = item.name.parameterize.truncate(80, omission: '')
      item.slug = Item.exists?(slug: item_slug) ? "#{item_slug}_#{item.id}" : item_slug
      item.save!
    end

    magic_items = MagicItem.where('slug IS NULL')
    magic_items.find_each do |magic_item|
      magic_item_slug = magic_item.name.parameterize.truncate(80, omission: '')
      magic_item.slug = MagicItem.exists?(slug: magic_item_slug) ? "#{magic_item_slug}_#{magic_item.id}" : magic_item_slug
      magic_item.save!
    end

    monsters = Monster.where('slug IS NULL')
    monsters.find_each do |monster|
      monster_slug = monster.name.parameterize.truncate(80, omission: '')
      monster.slug = Monster.exists?(slug: monster_slug) ? "#{monster_slug}_#{monster.id}" : monster_slug
      monster.save!
    end

    spells = Spell.where('slug IS NULL')
    spells.find_each do |spell|
      spell_slug = spell.name.parameterize.truncate(80, omission: '')
      spell.slug = Spell.exists?(slug: spell_slug) ? "#{spell_slug}_#{spell.id}" : spell_slug
      spell.save!
    end

    users = User.where('slug IS NULL')
    users.find_each do |user|
      user.slug = user.username.parameterize.truncate(80, omission: '')
      user.save!
    end
  end

  task set_prof_choices_for_class: :environment do
    DndClass.where(user_id: nil).each do |dnd_class|
      dnd_class.prof_choices.delete_all
      class_uri = URI(dnd_class.api_url)
      class_response = Net::HTTP.get(class_uri)
      class_result = JSON.parse class_response, symbolize_names: true
      class_result[:proficiency_choices].each_with_index do |prof_choice_block, index|
        prof_choice = ProfChoice.create(
          name: "#{dnd_class.name} #{index}",
          num_choices: prof_choice_block[:choose],
          prof_choice_type: prof_choice_block[:type]
        )
        prof_choice_block[:from].each do |prof|
          new_prof = Prof.find_by(name: prof[:name])
          prof_choice.profs << new_prof
        end
        dnd_class.prof_choices << prof_choice
      end
      dnd_class.save!
    end
  end

  task categorize_items: :environment do
    Item.all.each do |item|
      case item.category
      when 'Armor'
        item.type = 'ArmorItem'
      when 'Weapon'
        item.type = 'WeaponItem'
      when 'Tools'
        item.type = 'ToolItem'
      when 'Adventuring Gear'
        item.type = 'GearItem'
      when 'Mounts and Vehicles'
        item.type = 'VehicleItem'
      else
        puts "CATEGORY MISSING OR INCORRECT! Item #{item.id} - #{item.name}"
      end
      item.save!
    end
  end

  task convert_old_magic_items: :environment do
    MagicItemOld.all.each do |magic_item|
      if magic_item.magic_item_type.include? 'Armor'
        create_magic_armors_from_old_magic_items(magic_item)
      elsif magic_item.magic_item_type.include? 'Weapon'
        create_magic_weapons_from_old_magic_items(magic_item)
      else
        create_magic_item_from_old_magic_items(magic_item)
      end
    end
  end

  task update_weapons: :environment do
    WeaponItem.all.each do |weapon|
      if weapon.weapon_properties.include?('Reach')
        weapon.weapon_range_normal = 10
      end
      if weapon.weapon_properties.include?('Ammunition')
        if weapon.name.include?('Sling') || weapon.name.include?('Crossbow, hand')
          weapon.weapon_range_normal = 30
          weapon.weapon_range_long = 120
        end
        if weapon.name.include?('Shortbow') || weapon.name.include?('Crossbow, light')
          weapon.weapon_range_normal = 80
          weapon.weapon_range_long = 320
        end
        if weapon.name.include?('Blowgun')
          weapon.weapon_range_normal = 25
          weapon.weapon_range_long = 100
        end
        if weapon.name.include?('Crossbow, heavy')
          weapon.weapon_range_normal = 100
          weapon.weapon_range_long = 400
        end
        if weapon.name.include?('Longbow')
          weapon.weapon_range_normal = 150
          weapon.weapon_range_long = 600
        end
      end
      weapon.save!
    end
  end

  def create_magic_weapons_from_old_magic_items(magic_item)
    if magic_item.magic_item_type == 'Weapon (trident)'
      new_magic_weapon(magic_item, 'Trident')
    elsif magic_item.magic_item_type == 'Weapon (scimitar)'
      new_magic_weapon(magic_item, 'Scimitar')
    elsif magic_item.magic_item_type == 'Weapon (longsword)'
      new_magic_weapon(magic_item, 'Longsword')
    elsif magic_item.magic_item_type == 'Weapon (maul)'
      new_magic_weapon(magic_item, 'Maul')
    elsif magic_item.magic_item_type == 'Weapon (warhammer)'
      new_magic_weapon(magic_item, 'Warhammer')
    elsif magic_item.magic_item_type == 'Weapon (longbow)'
      new_magic_weapon(magic_item, 'Longbow')
    elsif magic_item.magic_item_type == 'Weapon (dagger)'
      new_magic_weapon(magic_item, 'Dagger')
    elsif magic_item.magic_item_type == 'Weapon (mace)'
      new_magic_weapon(magic_item, 'Mace')
    elsif magic_item.magic_item_type == 'Weapon (javelin)'
      new_magic_weapon(magic_item, 'Javelin')
    elsif magic_item.magic_item_type == 'Weapon (arrow)'
      create_magic_item_from_old_magic_items(magic_item)
    elsif magic_item.magic_item_type == 'Weapon (any axe)'
      WeaponItem.all_axes.each do |weapon_name|
        new_magic_weapon(magic_item, weapon_name)
      end
    elsif magic_item.magic_item_type == 'Weapon (any axe or sword)'
      weapons = WeaponItem.all_axes + WeaponItem.all_swords
      weapons.each do |weapon_name|
        new_magic_weapon(magic_item, weapon_name)
      end
    elsif magic_item.magic_item_type == 'Weapon (any sword)'
      WeaponItem.all_swords.each do |weapon_name|
        new_magic_weapon(magic_item, weapon_name)
      end
    elsif magic_item.magic_item_type == 'Weapon (any sword that deals slashing damage)'
      slashing_swords = WeaponItem.all_swords - ['Shortsword']
      slashing_swords.each do |weapon_name|
        new_magic_weapon(magic_item, weapon_name)
      end
    elsif magic_item.magic_item_type == 'Weapon (any)'
      if magic_item.name == 'Weapon +1' || magic_item.name == 'Weapon +2' || magic_item.name == 'Weapon +3'
        WeaponItem.all_weapons.each do |weapon_name|
          new_magic_weapon(magic_item, weapon_name)
        end
      elsif !WeaponItem.basic_magic_weapons.include?(magic_item.name)
        WeaponItem.all_weapons.each do |weapon_name|
          new_magic_weapon(magic_item, weapon_name)
        end
      end
    else
      puts "WEAPON unidentified: #{magic_item.name} - TYPE #{magic_item.magic_item_type} - ID: #{magic_item.id}"
    end
  end

  def create_magic_armors_from_old_magic_items(magic_item)
    if magic_item.magic_item_type.include? 'scale mail'
      new_magic_armor(magic_item, 'Scale Mail')
    elsif magic_item.magic_item_type.include? 'chain shirt'
      new_magic_armor(magic_item, 'Chain Shirt')
    elsif magic_item.magic_item_type.include? 'studded leather'
      new_magic_armor(magic_item, 'Studded Leather')
    elsif magic_item.magic_item_type.include? 'shield'
      new_magic_armor(magic_item, 'Shield')
    elsif magic_item.magic_item_type.include? 'plate'
      new_magic_armor(magic_item, 'Plate')
    elsif magic_item.magic_item_type.include? 'medium or heavy'
      medium_heavy_armors = ArmorItem.basic_armors - ['Studded Leather', 'Leather', 'Padded']
      medium_heavy_armors.each do |armor_name|
        new_magic_armor(magic_item, armor_name)
      end
    elsif magic_item.magic_item_type.include? 'light'
      new_magic_armor(magic_item, 'Studded Leather')
      new_magic_armor(magic_item, 'Leather')
      new_magic_armor(magic_item, 'Padded')
    else
      puts "ARMOR unidentified: #{magic_item.name} - TYPE #{magic_item.magic_item_type} - ID: #{magic_item.id}"
    end
  end

  def new_magic_armor(magic_item, armor_name)
    armor_item = ArmorItem.find_by(name: armor_name)
    new_item = ArmorItem.find_or_create_by(name: "#{magic_item.name}, #{armor_name}")
    new_item.description = magic_item.description
    new_item.rarity = magic_item.rarity
    new_item.requires_attunement = magic_item.requires_attunement
    new_item.sub_category = magic_item.magic_item_type
    new_item.slug = new_item.name.parameterize
    new_item.sub_category = magic_item.magic_item_type
    new_item.armor_class = armor_item.armor_class
    new_item.armor_dex_bonus = armor_item.armor_dex_bonus
    new_item.armor_max_bonus = armor_item.armor_max_bonus
    new_item.armor_stealth_disadvantage = armor_item.armor_stealth_disadvantage
    new_item.armor_str_minimum = armor_item.armor_str_minimum
    new_item.weight = armor_item.weight
    new_item.save!
  end

  def new_magic_weapon(magic_item, weapon_name)
    weapon_item = WeaponItem.find_by(name: weapon_name)
    new_item = WeaponItem.find_or_create_by(name: "#{magic_item.name}, #{weapon_name}")
    new_item.description = magic_item.description
    new_item.rarity = magic_item.rarity
    new_item.requires_attunement = magic_item.requires_attunement
    new_item.sub_category = magic_item.magic_item_type
    new_item.slug = new_item.name.parameterize
    new_item.sub_category = magic_item.magic_item_type
    new_item.weapon_2h_damage_dice_count = weapon_item.weapon_2h_damage_dice_count
    new_item.weapon_2h_damage_dice_value = weapon_item.weapon_2h_damage_dice_value
    new_item.weapon_2h_damage_type = weapon_item.weapon_2h_damage_type
    new_item.weapon_damage_dice_count = weapon_item.weapon_damage_dice_count
    new_item.weapon_damage_dice_value = weapon_item.weapon_damage_dice_value
    new_item.weapon_damage_type = weapon_item.weapon_damage_type
    new_item.weapon_properties = weapon_item.weapon_properties
    new_item.weapon_range = weapon_item.weapon_range
    new_item.weapon_range_long = weapon_item.weapon_range_long
    new_item.weapon_range_normal = weapon_item.weapon_range_normal
    new_item.weapon_thrown_range_long = weapon_item.weapon_thrown_range_long
    new_item.weapon_thrown_range_normal = weapon_item.weapon_thrown_range_normal
    new_item.category_range = weapon_item.category_range
    new_item.weight = weapon_item.weight
    new_item.save!
  end

  def create_magic_item_from_old_magic_items(magic_item)
    new_item = MagicItem.find_or_create_by(name: magic_item.name)
    new_item.description = magic_item.description
    new_item.rarity = magic_item.rarity
    new_item.requires_attunement = magic_item.requires_attunement
    new_item.slug = new_item.name.parameterize
    new_item.sub_category = magic_item.magic_item_type
    new_item.save!
  end
end

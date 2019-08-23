# frozen_string_literal: true

namespace :update_records do
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

  task stat_blocks: :environment do
    Character.all.each do |char|
      stat_block = StatBlock.find_or_create_by(character_id: char.id) do |new_stat_block|
        new_stat_block.armor_class = char.armor_class
        new_stat_block.charisma = char.charisma
        new_stat_block.constitution = char.constitution
        new_stat_block.dexterity = char.dexterity
        new_stat_block.hit_dice_number = char.hit_dice_number
        new_stat_block.hit_dice_value = char.hit_dice_value
        new_stat_block.hit_points = char.hit_points
        new_stat_block.hit_points_current = char.hit_points_current
        new_stat_block.initiative = char.initiative
        new_stat_block.intelligence = char.intelligence
        new_stat_block.proficiency = char.proficiency
        new_stat_block.speed = char.speed
        new_stat_block.strength = char.strength
        new_stat_block.wisdom = char.wisdom
      end
      char.stat_block = stat_block
      char.save!
    end

    Monster.all.each do |monster|
      monster.stat_block = StatBlock.find_or_create_by(monster_id: monster.id) do |new_stat_block|
        new_stat_block.armor_class = monster.armor_class
        new_stat_block.charisma = monster.charisma
        new_stat_block.constitution = monster.constitution
        new_stat_block.dexterity = monster.dexterity
        new_stat_block.hit_points = monster.hit_points
        new_stat_block.hit_points_current = monster.hit_points
        new_stat_block.initiative = DndRules.ability_score_modifier(monster.dexterity)
        new_stat_block.intelligence = monster.intelligence
        new_stat_block.proficiency = DndRules.proficiency_for_cr(monster.challenge_rating)
        new_stat_block.speed = monster.speed
        new_stat_block.strength = monster.strength
        new_stat_block.wisdom = monster.wisdom

        # Parse the Hit Dice String
        hit_dice = if monster.slug == 'kobold'
                     '2d6 - 2'
                   else
                     monster.hit_dice
                   end
        hit_die_values = DndRules.parse_dice_string(hit_dice)
        new_stat_block.hit_dice_number = hit_die_values[:hit_dice_number]
        new_stat_block.hit_dice_value = hit_die_values[:hit_dice_value]
        new_stat_block.hit_dice_modifier = hit_die_values[:hit_dice_modifier]
      end
      monster.save!
    end
  end

  task monsters: :environment do
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

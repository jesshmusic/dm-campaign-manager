# frozen_string_literal: true

namespace :update do
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
end

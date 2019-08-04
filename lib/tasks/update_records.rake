namespace :update do
  
  task spells: :environment do
    Spell.find_each do |spell|
      spell.spell_level = spell.get_spell_level_text
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
end

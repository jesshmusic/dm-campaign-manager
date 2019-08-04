namespace :update do
  
  task spells: :environment do
    Spell.find_each do |spell|
      spell.spell_level = spell.get_spell_level_text
      spell.save!
    end
  end
end

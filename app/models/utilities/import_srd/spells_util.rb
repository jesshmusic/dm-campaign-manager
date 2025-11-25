class SpellsUtil
  class << self
    delegate :dnd_api_url, to: :ImportSrdUtilities

    delegate :dnd_open5e_url, to: :ImportSrdUtilities

    def import
      uri = URI("#{dnd_api_url}/api/spells")
      response = Net::HTTP.get(uri)
      result = JSON.parse response, symbolize_names: true
      count = 0
      result[:results].each do |spell|
        spell_uri = URI("#{dnd_api_url}#{spell[:url]}")
        spell_response = Net::HTTP.get(spell_uri)
        spell_result = JSON.parse spell_response, symbolize_names: true
        Spell.find_or_create_by(name: spell[:name]) do |new_spell|
          new_spell.api_url = spell_result[:url]
          new_spell.casting_time = spell_result[:casting_time]
          spell_result[:components].each do |component|
            new_spell.components << component
          end
          if spell_result[:desc]
            new_spell.description = ''
            spell_result[:desc].each do |desc_para|
              new_spell.description += "#{desc_para}\n"
            end
          end
          if spell_result[:higher_level]
            new_spell.higher_level = ''
            spell_result[:higher_level].each do |higher_lvl_para|
              new_spell.higher_level += "#{higher_lvl_para}\n"
            end
          end
          new_spell.level = spell_result[:level]
          new_spell.spell_level = new_spell.get_spell_level_text
          new_spell.material = spell_result[:material]
          new_spell.page = spell_result[:page]
          new_spell.range = spell_result[:range]
          new_spell.duration = spell_result[:duration]
          new_spell.ritual = spell_result[:ritual] == 'yes'
          new_spell.concentration = spell_result[:concentration] == 'yes'
          new_spell.school = spell_result[:school][:name]
          spell_result[:classes].each do |dnd_class_name|
            dnd_class = DndClass.find_by(name: dnd_class_name[:name])
            new_spell.dnd_classes << dnd_class if dnd_class
          end
          new_spell.save!
          Rails.logger.debug { "\tSpell #{new_spell.name} imported" }
        end
        count += 1
      end
      Rails.logger.debug { "#{count} spells imported." }
    end
  end
end

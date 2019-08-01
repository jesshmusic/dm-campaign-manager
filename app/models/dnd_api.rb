class DndApi
  include HTTParty
  
  def get_dnd_classes
    classes_base_url = 'http://www.dnd5eapi.co/api/classes/'
    classes_list_response = HTTParty.get(classes_base_url, format: :plain)
    classes_list = JSON.parse classes_list_response, symbolize_names: true
    classes_list[:results].each do |class_object|
      dnd_class = HTTParty.get(class_object[:url], format: :plain)
      parsed_dnd_class = JSON.parse dnd_class, symbolize_names: true
      new_dnd_class = DndClass.new(
        name: parsed_dnd_class[:name],
        api_url: parsed_dnd_class[:url],
        hit_die: parsed_dnd_class[:hit_die]
      )
      new_dnd_class.save!
    end
  end
  
  def get_spells
    spells_base_url = 'http://www.dnd5eapi.co/api/spells/'
    spells_list_response = HTTParty.get(spells_base_url, format: :plain)
    spells_list = JSON.parse spells_list_response, symbolize_names: true
    spells_list[:results].each do |spell_object|
      spell = HTTParty.get(spell_object[:url], format: :plain)
      parsed_spell = JSON.parse spell, symbolize_names: true
      spell_desc = parsed_spell[:desc].map { |r| "#{r}" }.join("\n")
      @spell = Spell.new(
        api_url: parsed_spell[:url],
        casting_time: parsed_spell[:casting_time],
        concentration: parsed_spell[:concentration] != 'no',
        description: spell_desc,
        duration: parsed_spell[:duration],
        higher_level: parsed_spell[:higher_level],
        level: parsed_spell[:level],
        material: parsed_spell[:material],
        name: parsed_spell[:name],
        page: parsed_spell[:page],
        range: parsed_spell[:range],
        ritual: parsed_spell[:ritual] != 'no',
        school: parsed_spell[:school][:name]
      )
      parsed_spell[:components].each do |component|
        @spell.components << component
      end
      @spell.save!
    end
  end
  
end

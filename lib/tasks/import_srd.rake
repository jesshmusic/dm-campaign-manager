namespace :srd do
  dnd_api_url = 'http://www.dnd5eapi.co/api/'
  dnd_open5e_url = 'https://api-beta.open5e.com/'
  
  task import_classes: :environment do
    uri = URI("#{dnd_api_url}classes")
    response = Net::HTTP.get(uri)
    result = JSON.parse response, symbolize_names: true
    count = 0
    result[:results].each do |dnd_class|
      class_uri = URI(dnd_class[:url])
      class_response = Net::HTTP.get(class_uri)
      class_result = JSON.parse class_response, symbolize_names: true
      DndClass.find_or_create_by(name: dnd_class[:name]) do |new_class|
        new_class.name = class_result[:name]
        new_class.api_url = class_result[:url]
        new_class.hit_die = class_result[:hit_die]
        prof_choices_array = Array.new
        class_result[:proficiency_choices].each do |prof_choice_block|
          choices_array = []
          prof_choice_block[:from].each do |prof|
            choices_array << prof[:name]
          end
          prof_choices = {
            from: choices_array,
            type: prof_choice_block[:type],
            number_to_choose: prof_choice_block[:choose]
          }
          prof_choices_array << prof_choices
        end
        new_class.proficiency_choices = prof_choices_array
        class_result[:proficiencies].each do |prof|
          new_class.proficiencies << prof[:name]
        end
        class_result[:saving_throws].each do |saving_throw|
          new_class.saving_throws << saving_throw[:name]
        end
      end
      count += 1
    end
    puts "#{count} D&D classes imported."
  end
  
  task import_magic_items: :environment do
    next_uri = URI("#{dnd_open5e_url}magicitems/")
    count = 0
    while next_uri
      response = Net::HTTP.get(next_uri)
      result = JSON.parse response, symbolize_names: true
      next_uri = result[:next] ? URI(result[:next]) : false
      result[:results].each do |magic_item|
        MagicItem.find_or_create_by(name: magic_item[:name], rarity: magic_item[:rarity]) do |new_magic_item|
          new_magic_item.description = magic_item[:desc]
          new_magic_item.magic_item_type = magic_item[:type]
          new_magic_item.requires_attunement = magic_item[:requires_attunement]
        end
        count += 1
      end
    end
    puts "#{count} Magic Items imported."
  end
end

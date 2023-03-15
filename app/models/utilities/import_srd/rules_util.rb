class RulesUtil
  class << self

    def dnd_api_url
      ImportSrdUtilities.dnd_api_url
    end

    def import
      rules_uri = URI("#{dnd_api_url}/api/rules")
      response = Net::HTTP.get(rules_uri)
      categories_result = JSON.parse response, symbolize_names: true
      count = 0
      categories_result[:results].each do |category|
        subcategories_uri = URI("#{dnd_api_url}#{category[:url]}")
        sub_response = Net::HTTP.get(subcategories_uri)
        subcategories_result = JSON.parse sub_response, symbolize_names: true
        rule = Rule.find_or_create_by(
          name: subcategories_result[:name],
          description: subcategories_result[:desc],
          category: category[:name])
        sub_count = 0
        subcategories_result[:subsections].each do |subcategory|
          rules_uri = URI("#{dnd_api_url}#{subcategory[:url]}")
          rules_response = Net::HTTP.get(rules_uri)
          rules_result = JSON.parse rules_response, symbolize_names: true
          sub_rule = Rule.find_or_create_by(
            name: rules_result[:name],
            description: rules_result[:desc],
            category: category[:name],
            subcategory: subcategory[:name])
          sub_rule.parent = rule
          sub_rule.save!
          sub_count += 1
        end
        rule.save!
        puts "\tRule #{rule.name} imported, #{sub_count} subsections imported."
        count += 1
      end
      puts "#{count} Rules imported."
    end
  end
end


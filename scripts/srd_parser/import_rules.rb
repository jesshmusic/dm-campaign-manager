# Delete old 2024 rules
Rule.where(edition: '2024').destroy_all
puts 'Deleted old 2024 rules'

# Import new rules from JSON
require 'json'
json_file = Rails.root.join('scripts', 'srd_parser', 'output', '2024', 'rules.json')
rules_data = JSON.parse(File.read(json_file))

rules_data.each do |rule_attrs|
  rule = Rule.find_or_initialize_by(slug: rule_attrs['slug'], edition: '2024')
  rule.name = rule_attrs['name']
  rule.description = rule_attrs['description']
  rule.save!
  puts "Imported: #{rule.name} (#{rule.description.length} chars)"
end

puts ''
puts "Total 2024 rules: #{Rule.where(edition: '2024').count}"

class SectionsUtil
  class << self
    delegate :dnd_open5e_url, to: :ImportSrdUtilities

    def import
      sections_uri = URI("#{dnd_open5e_url}sections.json")
      response = Net::HTTP.get(sections_uri)
      result = JSON.parse response, symbolize_names: true
      result[:results].each do |section|
        Section.find_or_create_by(name: section[:name], description: section[:desc])
      end
    end
  end
end

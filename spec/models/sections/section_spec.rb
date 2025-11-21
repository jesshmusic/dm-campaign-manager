require 'rails_helper'

RSpec.describe Section, type: :model do
  describe 'factory' do
    it 'is valid' do
      expect(create(:section)).to be_valid
    end
  end

  describe 'attributes' do
    it 'has name attribute' do
      section = create(:section, name: 'Introduction')
      expect(section.name).to eq('Introduction')
    end


    it 'has slug attribute' do
      section = create(:section)
      expect(section.slug).not_to be_nil
    end
  end

end

require 'rails_helper'

RSpec.describe VehicleItem, type: :model do
  describe 'factory' do
    it 'is valid' do
      expect(create(:vehicle_item)).to be_valid
    end
  end

  describe '#category' do
    it 'returns Mounts and Vehicles' do
      vehicle = build(:vehicle_item)
      expect(vehicle.category).to eq('Mounts and Vehicles')
    end
  end

  describe 'inheritance' do
    it 'inherits from Item' do
      expect(VehicleItem.superclass).to eq(Item)
    end
  end

  describe 'attributes' do
    it 'has vehicle-specific attributes' do
      vehicle = create(:vehicle_item,
                       name: 'Sailing Ship',
                       vehicle_category: 'Water Vehicles',
                       speed: '2 mph',
                       capacity: '20 tons')

      expect(vehicle.name).to eq('Sailing Ship')
      expect(vehicle.vehicle_category).to eq('Water Vehicles')
      expect(vehicle.speed).to eq('2 mph')
      expect(vehicle.capacity).to eq('20 tons')
    end
  end
end

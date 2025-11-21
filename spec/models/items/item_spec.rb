require 'rails_helper'

RSpec.describe Item, type: :model do
  describe 'factory' do
    it 'is valid' do
      expect(create(:item)).to be_valid
    end
  end

  describe 'associations' do
    it 'belongs_to user (optional)' do
      item = create(:item)
      expect(item).to respond_to(:user)
    end

    it 'can be associated with a user' do
      user = create(:user)
      item = create(:item, user_id: user.id)
      expect(item.user_id).to eq(user.id)
    end

    it 'can be SRD (no user)' do
      item = create(:item, user_id: nil)
      expect(item.user_id).to be_nil
    end

    it 'has_one armor_class' do
      item = create(:item)
      expect(item).to respond_to(:armor_class)
    end

    it 'destroys dependent armor_class' do
      item = create(:item)
      armor_class = create(:armor_class, item: item)

      expect { item.destroy }.to change { ArmorClass.count }.by(-1)
    end

    it 'has_many content_items' do
      item = create(:item)
      expect(item).to respond_to(:content_items)
    end


    it 'has_one cost' do
      item = create(:item)
      expect(item).to respond_to(:cost)
    end

    it 'has_one damage' do
      item = create(:item)
      expect(item).to respond_to(:damage)
    end

    it 'has_one item_range' do
      item = create(:item)
      expect(item).to respond_to(:item_range)
    end

    it 'has_one item_throw_range' do
      item = create(:item)
      expect(item).to respond_to(:item_throw_range)
    end

    it 'has_one two_handed_damage' do
      item = create(:item)
      expect(item).to respond_to(:two_handed_damage)
    end
  end

  describe '#category' do
    it 'returns Item' do
      item = create(:item)
      expect(item.category).to eq('Item')
    end
  end

  describe '#normalize_friendly_id' do
    it 'removes apostrophes from friendly_id' do
      item = create(:item, name: "O'Brien's Sword")
      expect(item.slug).not_to include("'")
    end
  end


  describe 'attributes' do
    it 'has name attribute' do
      item = create(:item, name: 'Iron Pot')
      expect(item.name).to eq('Iron Pot')
    end

    it 'has type attribute' do
      item = create(:item, type: 'WeaponItem')
      expect(item.type).to eq('WeaponItem')
    end

    it 'has weight attribute' do
      item = create(:item, weight: 5)
      expect(item.weight).to eq(5)
    end

    it 'has quantity attribute' do
      item = create(:item, quantity: 10)
      expect(item.quantity).to eq(10)
    end

    it 'has rarity attribute' do
      item = create(:item, rarity: 'Rare')
      expect(item.rarity).to eq('Rare')
    end

    it 'has requires_attunement attribute' do
      item = create(:item, requires_attunement: 'By a spellcaster')
      expect(item.requires_attunement).to eq('By a spellcaster')
    end

    it 'has desc array attribute' do
      item = create(:item, desc: ['This is an item.', 'It has special properties.'])
      expect(item.desc).to include('This is an item.')
      expect(item.desc).to include('It has special properties.')
    end

    it 'has empty desc array by default' do
      item = create(:item)
      expect(item.desc).to eq([])
    end

    it 'has properties array attribute' do
      item = create(:item, properties: ['Finesse', 'Light'])
      expect(item.properties).to include('Finesse')
      expect(item.properties).to include('Light')
    end

    it 'has empty properties array by default' do
      item = create(:item)
      expect(item.properties).to eq([])
    end

    it 'has special array attribute' do
      item = create(:item, special: ['Magical', 'Enchanted'])
      expect(item.special).to include('Magical')
      expect(item.special).to include('Enchanted')
    end

    it 'has empty special array by default' do
      item = create(:item)
      expect(item.special).to eq([])
    end

    it 'has api_url attribute' do
      item = create(:item, api_url: 'https://api.example.com/items/sword')
      expect(item.api_url).to eq('https://api.example.com/items/sword')
    end

    it 'has armor_category attribute' do
      item = create(:item, armor_category: 'Light Armor')
      expect(item.armor_category).to eq('Light Armor')
    end

    it 'has weapon_category attribute' do
      item = create(:item, weapon_category: 'Melee Weapons')
      expect(item.weapon_category).to eq('Melee Weapons')
    end

    it 'has tool_category attribute' do
      item = create(:item, tool_category: 'Artisan Tools')
      expect(item.tool_category).to eq('Artisan Tools')
    end

    it 'has vehicle_category attribute' do
      item = create(:item, vehicle_category: 'Sea Vessels')
      expect(item.vehicle_category).to eq('Sea Vessels')
    end

    it 'has gear_category attribute' do
      item = create(:item, gear_category: 'Adventuring Gear')
      expect(item.gear_category).to eq('Adventuring Gear')
    end

    it 'has equipment_category attribute' do
      item = create(:item, equipment_category: 'Clothing')
      expect(item.equipment_category).to eq('Clothing')
    end
  end

  describe 'STI (Single Table Inheritance)' do
    it 'can be different subclasses' do
      weapon = create(:weapon_item)
      armor = create(:armor_item)
      gear = create(:gear_item)
      tool = create(:tool_item)
      vehicle = create(:vehicle_item)

      expect(weapon.type).to eq('WeaponItem')
      expect(armor.type).to eq('ArmorItem')
      expect(gear.type).to eq('GearItem')
      expect(tool.type).to eq('ToolItem')
      expect(vehicle.type).to eq('VehicleItem')
    end


    it 'can query by type' do
      weapon = create(:weapon_item, name: 'Sword')
      armor = create(:armor_item, name: 'Plate')

      weapons = Item.where(type: 'WeaponItem')
      armors = Item.where(type: 'ArmorItem')

      expect(weapons).to include(weapon)
      expect(weapons).not_to include(armor)
      expect(armors).to include(armor)
      expect(armors).not_to include(weapon)
    end
  end

  describe 'PgSearch' do
    it 'searches by name' do
      item = create(:item, name: 'Bag of Holding')
      results = Item.search_for('Bag of Holding')
      expect(results).to include(item)
    end

    it 'searches by type' do
      item = create(:item, type: 'WeaponItem')
      results = Item.search_for('WeaponItem')
      expect(results).to include(item)
    end

    it 'searches by properties' do
      item = create(:item, properties: ['Magical', 'Rare'])
      results = Item.search_for('Magical')
      expect(results).to include(item)
    end
  end

  describe 'complex scenarios' do
    it 'can have cost with item' do
      item = create(:item)
      cost = create(:cost, item: item, quantity: 50, unit: 'gp')

      expect(item.cost).to eq(cost)
      expect(item.cost.quantity).to eq(50)
    end

    it 'can have damage with item' do
      item = create(:item)
      damage = create(:damage, item: item, damage_dice: '1d8', damage_type: 'slashing')

      expect(item.damage).to eq(damage)
      expect(item.damage.damage_dice).to eq('1d8')
    end

    it 'preserves all attributes after save' do
      item = create(:item,
                    name: 'Enchanted Longsword',
                    weight: 3,
                    rarity: 'Very Rare',
                    properties: ['Versatile', 'Magical'],
                    special: ['Glowing', 'Intelligence 18'])

      reloaded = Item.find(item.id)
      expect(reloaded.name).to eq('Enchanted Longsword')
      expect(reloaded.weight).to eq(3)
      expect(reloaded.rarity).to eq('Very Rare')
      expect(reloaded.properties).to eq(['Versatile', 'Magical'])
      expect(reloaded.special).to eq(['Glowing', 'Intelligence 18'])
    end
  end
end

# == Schema Information
#
# Table name: rules
#
#  id          :bigint           not null, primary key
#  category    :string
#  description :string
#  name        :string
#  slug        :string
#  subcategory :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  parent_id   :bigint
#
# Indexes
#
#  index_rules_on_parent_id  (parent_id)
#
require 'rails_helper'

RSpec.describe Rule, type: :model do
  describe 'factory' do
    it 'creates a valid rule' do
      rule = create(:rule)

      expect(rule).to be_valid
      expect(rule.name).to be_present
    end
  end

  describe 'friendly_id' do
    it 'generates slug from name' do
      rule = create(:rule, name: 'Grappling Rules')

      expect(rule.slug).to eq('grappling-rules')
    end

    it 'normalizes apostrophes in slugs' do
      rule = create(:rule, name: "Player's Handbook")

      expect(rule.slug).not_to include("'")
      expect(rule.slug).to eq('players-handbook')
    end

    it 'finds rules by slug' do
      rule = create(:rule, name: 'Combat')

      found_rule = Rule.friendly.find('combat')
      expect(found_rule).to eq(rule)
    end
  end

  describe 'associations' do
    it 'can have a parent rule' do
      parent = create(:rule, name: 'Combat')
      child = create(:rule, name: 'Attacking', parent: parent)

      expect(child.parent).to eq(parent)
    end

    it 'can have many children rules' do
      parent = create(:rule, name: 'Combat')
      child1 = create(:rule, name: 'Attacking', parent: parent)
      child2 = create(:rule, name: 'Defending', parent: parent)

      expect(parent.children).to include(child1, child2)
      expect(parent.children.count).to eq(2)
    end

    it 'allows parent to be optional' do
      rule = create(:rule, name: 'Standalone Rule', parent: nil)

      expect(rule).to be_valid
      expect(rule.parent).to be_nil
    end
  end

  describe 'attributes' do
    let(:rule) { create(:rule, name: 'Spellcasting', category: 'Magic', subcategory: 'Arcane', description: 'Rules for casting spells') }

    it 'stores rule name' do
      expect(rule.name).to eq('Spellcasting')
    end

    it 'stores category' do
      expect(rule.category).to eq('Magic')
    end

    it 'stores subcategory' do
      expect(rule.subcategory).to eq('Arcane')
    end

    it 'stores description' do
      expect(rule.description).to eq('Rules for casting spells')
    end
  end

  describe 'search functionality' do
    before do
      create(:rule, name: 'Grappling', category: 'Combat', description: 'How to grapple opponents')
      create(:rule, name: 'Spellcasting', category: 'Magic', description: 'Casting spells in combat')
      create(:rule, name: 'Stealth', category: 'Skills', subcategory: 'Dexterity', description: 'How to hide')
    end

    it 'searches by name' do
      results = Rule.search_for('Grappling')

      expect(results.count).to eq(1)
      expect(results.first.name).to eq('Grappling')
    end

    it 'searches by category' do
      results = Rule.search_for('Combat')

      expect(results.count).to be >= 1
      expect(results.pluck(:category)).to include('Combat')
    end

    it 'searches by subcategory' do
      results = Rule.search_for('Dexterity')

      expect(results.count).to eq(1)
      expect(results.first.name).to eq('Stealth')
    end

    it 'searches by description' do
      results = Rule.search_for('hide')

      expect(results.count).to eq(1)
      expect(results.first.name).to eq('Stealth')
    end

    it 'uses prefix search' do
      results = Rule.search_for('Spell')

      expect(results.count).to eq(1)
      expect(results.first.name).to eq('Spellcasting')
    end
  end

  describe 'multisearchable' do
    it 'is included in PgSearch multisearch' do
      rule = create(:rule, name: 'Initiative', description: 'Determining turn order')

      # The rule should be searchable via PgSearch multisearch
      expect(PgSearch::Document.where(searchable_type: 'Rule', searchable_id: rule.id).count).to eq(1)
    end
  end

  describe 'hierarchical structure' do
    it 'allows multi-level hierarchy' do
      grandparent = create(:rule, name: 'Core Rules')
      parent = create(:rule, name: 'Combat', parent: grandparent)
      child = create(:rule, name: 'Melee Attacks', parent: parent)

      expect(child.parent).to eq(parent)
      expect(parent.parent).to eq(grandparent)
      expect(grandparent.children).to include(parent)
      expect(parent.children).to include(child)
    end
  end
end

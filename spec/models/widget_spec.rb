# == Schema Information
#
# Table name: widgets
#
#  id         :bigint           not null, primary key
#  content    :text
#  icon       :text
#  subtitle   :text
#  title      :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint
#
# Indexes
#
#  index_widgets_on_user_id  (user_id)
#
require 'rails_helper'

RSpec.describe Widget, type: :model do
  describe 'factory' do
    it 'creates a valid widget' do
      widget = create(:widget)

      expect(widget).to be_valid
    end
  end

  describe 'attributes' do
    let(:widget) { create(:widget, title: 'Initiative Tracker', subtitle: 'Track combat order', content: 'Detailed combat tracking widget', icon: 'sword') }

    it 'stores title' do
      expect(widget.title).to eq('Initiative Tracker')
    end

    it 'stores subtitle' do
      expect(widget.subtitle).to eq('Track combat order')
    end

    it 'stores content as text' do
      expect(widget.content).to eq('Detailed combat tracking widget')
    end

    it 'stores icon' do
      expect(widget.icon).to eq('sword')
    end
  end

  describe 'user association' do
    it 'can belong to a user' do
      user = create(:dungeon_master_user)
      widget = create(:widget, user_id: user.id)

      expect(widget.user_id).to eq(user.id)
    end

    it 'allows widgets without a user' do
      widget = create(:widget, user_id: nil)

      expect(widget).to be_valid
      expect(widget.user_id).to be_nil
    end
  end

  describe 'search functionality' do
    before do
      create(:widget, title: 'Spell Tracker', subtitle: 'Track spells', content: 'Keep track of spell slots')
      create(:widget, title: 'HP Counter', subtitle: 'Health tracking', content: 'Monitor hit points')
      create(:widget, title: 'Notes', subtitle: 'Campaign notes', content: 'Write down important details')
    end

    it 'searches by title' do
      results = Widget.search_for('Spell')

      expect(results.count).to eq(1)
      expect(results.first.title).to eq('Spell Tracker')
    end

    it 'searches by subtitle' do
      results = Widget.search_for('Health')

      expect(results.count).to eq(1)
      expect(results.first.title).to eq('HP Counter')
    end

    it 'searches by content' do
      results = Widget.search_for('important')

      expect(results.count).to eq(1)
      expect(results.first.title).to eq('Notes')
    end

    it 'uses prefix search' do
      results = Widget.search_for('Trac')

      expect(results.count).to be >= 1
      expect(results.pluck(:title)).to include('Spell Tracker')
    end
  end

  describe 'text fields' do
    it 'can store large content in text fields' do
      long_content = 'A' * 10000
      widget = create(:widget, content: long_content)

      expect(widget.content.length).to eq(10000)
      expect(widget).to be_valid
    end
  end
end

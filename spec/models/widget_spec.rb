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
    it 'is valid' do
      expect(create(:widget)).to be_valid
    end
  end

  describe 'associations' do
    it 'can be created without associations' do
      widget = create(:widget)
      expect(widget).to be_valid
    end
  end

  describe 'attributes' do
    it 'has title' do
      widget = create(:widget, title: 'Test Widget')
      expect(widget.title).to eq('Test Widget')
    end

    it 'has subtitle' do
      widget = create(:widget, subtitle: 'Subtitle')
      expect(widget.subtitle).to eq('Subtitle')
    end

    it 'has content' do
      widget = create(:widget, content: 'Content here')
      expect(widget.content).to eq('Content here')
    end

    it 'has icon' do
      widget = create(:widget, icon: 'fa-icon')
      expect(widget.icon).to eq('fa-icon')
    end


    it 'has created_at timestamp' do
      widget = create(:widget)
      expect(widget.created_at).not_to be_nil
    end

    it 'has updated_at timestamp' do
      widget = create(:widget)
      expect(widget.updated_at).not_to be_nil
    end
  end


  describe 'search' do
    it 'searches by title' do
      widget = create(:widget, title: 'Finding Widget')
      results = Widget.search_for('Finding')
      expect(results).to include(widget)
    end

    it 'searches by content' do
      widget = create(:widget, content: 'Special content here')
      results = Widget.search_for('Special')
      expect(results).to include(widget)
    end

    it 'searches by subtitle' do
      widget = create(:widget, subtitle: 'Important Subtitle')
      results = Widget.search_for('Important')
      expect(results).to include(widget)
    end

    it 'returns empty when search has no matches' do
      create(:widget, title: 'Unrelated Widget')
      results = Widget.search_for('NonexistentTerm')
      expect(results).to be_empty
    end
  end


  describe 'complex scenarios' do
    it 'can update all attributes' do
      widget = create(:widget,
                     title: 'Original',
                     subtitle: 'Original Subtitle',
                     content: 'Original content',
                     icon: 'original-icon')

      widget.update(
        title: 'Updated',
        subtitle: 'Updated Subtitle',
        content: 'Updated content',
        icon: 'updated-icon'
      )

      expect(widget.title).to eq('Updated')
      expect(widget.subtitle).to eq('Updated Subtitle')
      expect(widget.content).to eq('Updated content')
      expect(widget.icon).to eq('updated-icon')
    end

    it 'preserves attributes after save' do
      widget = create(:widget,
                     title: 'Persistent Widget',
                     subtitle: 'Persistent Subtitle',
                     content: 'Persistent content',
                     icon: 'persistent-icon')

      reloaded = Widget.find(widget.id)
      expect(reloaded.title).to eq('Persistent Widget')
      expect(reloaded.subtitle).to eq('Persistent Subtitle')
      expect(reloaded.content).to eq('Persistent content')
      expect(reloaded.icon).to eq('persistent-icon')
    end

    it 'can have nil subtitle' do
      widget = create(:widget, title: 'Widget', subtitle: nil)
      expect(widget.subtitle).to be_nil
    end

    it 'can have nil content' do
      widget = create(:widget, title: 'Widget', content: nil)
      expect(widget.content).to be_nil
    end

    it 'can have nil icon' do
      widget = create(:widget, title: 'Widget', icon: nil)
      expect(widget.icon).to be_nil
    end
  end
end

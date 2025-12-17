# frozen_string_literal: true

# == Schema Information
#
# Table name: feats
#
#  id           :bigint           not null, primary key
#  category     :string           not null
#  description  :text             not null
#  edition      :string           default("2024"), not null
#  homebrew     :boolean          default(FALSE), not null
#  name         :string           not null
#  prerequisite :string
#  repeatable   :boolean          default(FALSE), not null
#  slug         :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :bigint
#
# Indexes
#
#  index_feats_on_category          (category)
#  index_feats_on_edition           (edition)
#  index_feats_on_homebrew          (homebrew)
#  index_feats_on_slug_and_edition  (slug,edition) UNIQUE
#  index_feats_on_user_id           (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Feat, type: :model do
  describe 'validations' do
    it 'requires name' do
      feat = build(:feat, name: nil)
      expect(feat).not_to be_valid
      expect(feat.errors[:name]).to include("can't be blank")
    end

    it 'requires description' do
      feat = build(:feat, description: nil)
      expect(feat).not_to be_valid
      expect(feat.errors[:description]).to include("can't be blank")
    end

    it 'requires category' do
      feat = build(:feat, category: nil)
      expect(feat).not_to be_valid
      expect(feat.errors[:category]).to include("can't be blank")
    end

    it 'requires valid category' do
      feat = build(:feat, category: 'Invalid')
      expect(feat).not_to be_valid
      expect(feat.errors[:category]).to include('is not included in the list')
    end

    it 'requires edition to be valid' do
      feat = build(:feat, edition: 'invalid')
      expect(feat).not_to be_valid
      expect(feat.errors[:edition]).to include('is not included in the list')
    end

    it 'requires unique slug within edition' do
      create(:feat, name: 'Alert', edition: '2024')
      feat = Feat.new(name: 'Alert Different', slug: 'alert', edition: '2024', category: 'Origin', description: 'test')
      expect(feat).not_to be_valid
      expect(feat.errors[:slug]).to include('has already been taken')
    end

    it 'allows same slug in different editions' do
      create(:feat, name: 'Alert', edition: '2024')
      feat = build(:feat, name: 'Alert', edition: '2014')
      expect(feat).to be_valid
    end
  end

  describe 'associations' do
    it 'belongs to user optionally' do
      feat = create(:feat)
      expect(feat.user).to be_nil
    end

    it 'can have a user' do
      user = create(:user)
      feat = create(:feat, :homebrew, user: user)
      expect(feat.user).to eq(user)
    end
  end

  describe 'scopes' do
    let!(:srd_feat) { create(:feat, homebrew: false) }
    let!(:homebrew_feat) { create(:feat, :homebrew) }

    it 'returns srd feats' do
      expect(Feat.srd).to include(srd_feat)
      expect(Feat.srd).not_to include(homebrew_feat)
    end

    it 'returns homebrew feats' do
      expect(Feat.homebrew).to include(homebrew_feat)
      expect(Feat.homebrew).not_to include(srd_feat)
    end
  end

  describe 'category scopes' do
    let!(:origin_feat) { create(:feat, :origin) }
    let!(:general_feat) { create(:feat, category: 'General') }

    it 'filters by category' do
      expect(Feat.by_category('Origin')).to include(origin_feat)
      expect(Feat.by_category('Origin')).not_to include(general_feat)
    end
  end

  describe 'edition scopes' do
    let!(:feat_2024) { create(:feat, edition: '2024') }
    let!(:feat_2014) { create(:feat, edition: '2014') }

    it 'filters by edition' do
      expect(Feat.for_edition('2024')).to include(feat_2024)
      expect(Feat.for_edition('2024')).not_to include(feat_2014)
    end
  end

  describe 'friendly_id' do
    it 'generates slug from name' do
      feat = create(:feat, name: 'Test Feat')
      expect(feat.slug).to eq('test-feat')
    end

    it 'removes apostrophes from slug' do
      feat = create(:feat, name: "Fighter's Instinct")
      expect(feat.slug).to eq('fighters-instinct')
    end
  end

  describe 'search' do
    let!(:alert) { create(:feat, :alert) }
    let!(:grappler) { create(:feat, :grappler) }

    it 'searches by name' do
      results = Feat.search_for('Alert')
      expect(results).to include(alert)
      expect(results).not_to include(grappler)
    end

    it 'searches by prerequisite' do
      results = Feat.search_for('Strength')
      expect(results).to include(grappler)
      expect(results).not_to include(alert)
    end
  end

  describe 'categories constant' do
    it 'includes all valid categories' do
      expect(Feat::CATEGORIES).to include('Origin', 'General', 'Fighting Style', 'Epic Boon')
    end
  end
end

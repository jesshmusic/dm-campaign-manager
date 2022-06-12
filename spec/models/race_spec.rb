# == Schema Information
#
# Table name: races
#
#  widgetId                           :bigint           not null, primary key
#  ability_bonus_option_choices :string           default([]), is an Array
#  ability_bonus_options        :integer
#  age                          :text
#  alignment                    :text
#  language_choices             :string           default([]), is an Array
#  language_description         :text
#  languages                    :string           default([]), is an Array
#  name                         :string           default("New Race..."), not null
#  size                         :string
#  size_description             :text
#  slug                         :string           not null
#  speed                        :integer
#  starting_languages           :integer
#  subraces                     :string           default([]), is an Array
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  user_id                      :bigint
#
# Indexes
#
#  index_races_on_name     (name)
#  index_races_on_slug     (slug)
#  index_races_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.widgetId)
#

require 'rails_helper'

RSpec.describe Race, type: :model do
  context "with the same name" do
    let!(:dungeon_master) { create :dungeon_master_user }

    it "generates unique slugs" do
      @race = Race.create!(name: 'Goober Fish', speed: 25)
      @race1 = Race.create!(name: 'Goober Fish', speed: 25)
      @user_race = Race.create!(name: 'Goober Fish', speed: 25,
                                user: dungeon_master,)
      expect(@race.slug).to eq('goober-fish')
      expect(@race1.slug).to eq('goober-fish-1')
      expect(@user_race.slug).to eq('goober-fish-jesshdm1')
    end

    it "maintains same slug on update with no name change" do
      @race = Race.create!(name: 'Goober Fish', speed: 25)
      @race1 = Race.create!(name: 'Goober Fish', speed: 25)
      @user_race = Race.create!(name: 'Goober Fish', speed: 25,
                                user: dungeon_master,)
      expect(@race.slug).to eq('goober-fish')
      @race.update(size_description: 'Its really big I tell ya')
      expect(Race.all.count).to eq(12)
      @race.reload
      expect(@race.slug).to eq('goober-fish')
      @race.update(size_description: '... so big')
      expect(Race.all.count).to eq(12)
      @race.reload
      expect(@race.slug).to eq('goober-fish')
      @race.update(size_description: 'Its really big I tell ya')
      expect(Race.all.count).to eq(12)
      @race.reload
      expect(@race.slug).to eq('goober-fish')
    end
  end
end

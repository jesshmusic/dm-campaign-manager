# == Schema Information
#
# Table name: dnd_classes
#
#  id                     :bigint           not null, primary key
#  api_url                :string
#  hit_die                :integer
#  name                   :string
#  primary_abilities      :string           default([]), is an Array
#  saving_throw_abilities :string           default([]), is an Array
#  slug                   :string
#  spell_ability          :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  user_id                :bigint
#
# Indexes
#
#  index_dnd_classes_on_slug     (slug) UNIQUE
#  index_dnd_classes_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

require 'rails_helper'

RSpec.describe DndClass, type: :model do
  context "with the same name" do
    it "generates unique slugs" do
      dnd_class1 = DndClass.create(name: 'Fighter', hit_die: 10)
      dnd_class2 = DndClass.create(name: 'Fighter', hit_die: 10)
      expect(dnd_class1.slug).to eq('fighter')
      expect(dnd_class2.slug).to eq('fighter-1')
    end

    it "maintains same slug on update with no name change" do
      dnd_class = DndClass.create(name: 'Fighter', hit_die: 10)
      expect(dnd_class.slug).to eq('fighter')
      dnd_class.update(hit_die: 12)
      expect(DndClass.all.count).to eq(1)
      dnd_class.reload
      expect(dnd_class.slug).to eq('fighter')
      dnd_class.update(hit_die: 8)
      expect(DndClass.all.count).to eq(1)
      dnd_class.reload
      expect(dnd_class.slug).to eq('fighter')
      dnd_class.update(hit_die: 12)
      expect(DndClass.all.count).to eq(1)
      dnd_class.reload
      expect(dnd_class.slug).to eq('fighter')
    end
  end
end

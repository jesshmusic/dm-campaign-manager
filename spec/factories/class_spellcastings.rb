# == Schema Information
#
# Table name: class_spellcastings
#
#  id                  :bigint           not null, primary key
#  cantrips_known      :integer
#  spell_slots_level_1 :integer
#  spell_slots_level_2 :integer
#  spell_slots_level_3 :integer
#  spell_slots_level_4 :integer
#  spell_slots_level_5 :integer
#  spell_slots_level_6 :integer
#  spell_slots_level_7 :integer
#  spell_slots_level_8 :integer
#  spell_slots_level_9 :integer
#  spells_known        :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  dnd_class_level_id  :bigint           not null
#
# Indexes
#
#  index_class_spellcastings_on_dnd_class_level_id  (dnd_class_level_id)
#
# Foreign Keys
#
#  fk_rails_...  (dnd_class_level_id => dnd_class_levels.id)
#
FactoryBot.define do
  factory :class_spellcasting do
    cantrips_known { 1 }
    spells_known { 1 }
    spell_slots_level_1 { 1 }
  end
end

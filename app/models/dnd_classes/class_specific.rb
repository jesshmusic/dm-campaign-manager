# == Schema Information
#
# Table name: class_specifics
#
#  id                       :bigint           not null, primary key
#  action_surges            :integer
#  arcane_recovery_levels   :integer
#  aura_range               :integer
#  bardic_inspiration_die   :integer
#  brutal_critical_dice     :integer
#  channel_divinity_charges :integer
#  destroy_undead_cr        :integer
#  extra_attacks            :integer
#  favored_enemies          :integer
#  favored_terrain          :integer
#  indomitable_uses         :integer
#  invocations_known        :integer
#  ki_points                :integer
#  magical_secrets_max_5    :integer
#  magical_secrets_max_7    :integer
#  magical_secrets_max_9    :integer
#  metamagic_known          :integer
#  mystic_arcanum_level_6   :integer
#  mystic_arcanum_level_7   :integer
#  mystic_arcanum_level_8   :integer
#  mystic_arcanum_level_9   :integer
#  rage_count               :integer
#  rage_damage_bonus        :integer
#  song_of_rest_die         :integer
#  sorcery_points           :integer
#  unarmored_movement       :integer
#  wild_shape_fly           :boolean
#  wild_shape_max_cr        :boolean
#  wild_shape_swim          :boolean
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  dnd_class_level_id       :bigint           not null
#
# Indexes
#
#  index_class_specifics_on_dnd_class_level_id  (dnd_class_level_id)
#
# Foreign Keys
#
#  fk_rails_...  (dnd_class_level_id => dnd_class_levels.id)
#
class ClassSpecific < ApplicationRecord
  belongs_to :dnd_class_level
  has_many :class_specific_spell_slots, dependent: :destroy
  has_one :martial_art, dependent: :destroy
  has_one :sneak_attack, dependent: :destroy
end

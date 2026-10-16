# frozen_string_literal: true

# == Schema Information
#
# Table name: campaign_npcs
#
#  id                      :bigint           not null, primary key
#  appearance              :string
#  description             :text
#  foundry_actor_name      :string
#  foundry_actor_uuid      :string
#  motive                  :text
#  name                    :string           not null
#  notes                   :text
#  role                    :string           default("neutral"), not null
#  secret                  :text
#  sync_version            :bigint           default(0), not null
#  uuid                    :uuid             not null
#  voice                   :string
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  campaign_id             :bigint           not null
#  faction_id              :bigint
#  monster_id              :bigint
#  stat_block_reference_id :bigint
#
# Indexes
#
#  index_campaign_npcs_on_campaign_id                   (campaign_id)
#  index_campaign_npcs_on_campaign_id_and_sync_version  (campaign_id,sync_version)
#  index_campaign_npcs_on_faction_id                    (faction_id)
#  index_campaign_npcs_on_monster_id                    (monster_id)
#  index_campaign_npcs_on_stat_block_reference_id       (stat_block_reference_id)
#  index_campaign_npcs_on_uuid                          (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#  fk_rails_...  (faction_id => campaign_factions.id) ON DELETE => nullify
#  fk_rails_...  (monster_id => monsters.id) ON DELETE => nullify
#  fk_rails_...  (stat_block_reference_id => campaign_references.id) ON DELETE => nullify
#

# A member of the campaign's cast, from the BBEG down to a friendly innkeeper.
# Can link to a Monster for its stat block. The Foundry module can link it to
# one of the DM's Foundry actors (picked in Foundry, so the website only shows it).
class CampaignNpc < ApplicationRecord
  include CampaignRecord

  linkable_from_sessions

  ROLES = %w[bbeg villain lieutenant ally patron neutral].freeze
  # A world actor ("Actor.<id>") or a compendium actor
  # ("Compendium.dnd-monster-manual.actors.Actor.mmCultFanatic000")
  FOUNDRY_ACTOR_UUID = /\A(Compendium\.[\w-]+\.[\w-]+\.)?Actor\.[A-Za-z0-9]{16}\z/

  belongs_to :monster, optional: true
  belongs_to :faction, class_name: 'CampaignFaction', optional: true
  # A book stat block (e.g. Monster Manual) instead of, or as well as, a DM Guru monster
  belongs_to :stat_block_reference, class_name: 'CampaignReference', optional: true

  normalizes :foundry_actor_uuid, :foundry_actor_name, with: ->(value) { value.strip.presence }

  validates :name, presence: true, length: { maximum: 120 }
  validates :role, inclusion: { in: ROLES }
  validates :foundry_actor_uuid, length: { maximum: 255 }, format: { with: FOUNDRY_ACTOR_UUID }, allow_nil: true
  validates :foundry_actor_name, length: { maximum: 120 }
  validates_same_campaign :faction, :stat_block_reference
  validate :monster_visible_to_owner

  def as_json_for_api
    {
      id: id.to_s,
      uuid: uuid,
      name: name,
      role: role,
      description: description,
      motive: motive,
      secret: secret,
      appearance: appearance,
      voice: voice,
      notes: notes,
      factionId: faction_id&.to_s,
      monster: monster && { id: monster.id.to_s, name: monster.name, slug: monster.slug, challengeRating: monster.challenge_rating },
      statBlockReference: stat_block_reference && {
        id: stat_block_reference.id.to_s, name: stat_block_reference.name, citation: stat_block_reference.citation
      },
      foundryActorUuid: foundry_actor_uuid,
      foundryActorName: foundry_actor_name
    }
  end

  private

  # SRD monsters, or homebrew owned by the campaign's DM
  def monster_visible_to_owner
    return if monster.nil? || monster.user_id.nil? || monster.user_id == campaign&.user_id

    errors.add(:monster, 'is not available')
  end
end

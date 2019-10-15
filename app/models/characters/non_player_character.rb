# frozen_string_literal: true

# == Schema Information
#
# Table name: characters
#
#  id                   :bigint           not null, primary key
#  alignment            :string           default("neutral")
#  armor_class          :integer          default(10), not null
#  armor_class_modifier :integer          default(0), not null
#  background           :string           default("Acolyte")
#  charisma             :integer          default(10), not null
#  constitution         :integer          default(10), not null
#  copper_pieces        :integer          default(0)
#  description          :text             default("Enter this character's backstory, history, or notes here.")
#  dexterity            :integer          default(10), not null
#  electrum_pieces      :integer          default(0)
#  gold_pieces          :integer          default(0)
#  hit_points           :integer          default(8), not null
#  hit_points_current   :integer          default(8), not null
#  initiative           :integer          default(0), not null
#  intelligence         :integer          default(10), not null
#  languages            :string           default("Common")
#  name                 :string           not null
#  platinum_pieces      :integer          default(0)
#  proficiency          :integer          default(2)
#  role                 :string           default("Player Character")
#  silver_pieces        :integer          default(0), not null
#  slug                 :string           not null
#  speed                :string           default("30 feet"), not null
#  status               :integer          default("alive"), not null
#  strength             :integer          default(10), not null
#  type                 :string
#  wisdom               :integer          default(10), not null
#  xp                   :integer          default(0), not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  armor_id             :integer
#  campaign_id          :bigint
#  guild_id             :bigint
#  race_id              :integer          default(1), not null
#  shield_id            :integer
#  weapon_2h_id         :integer
#  weapon_lh_id         :integer
#  weapon_rh_id         :integer
#
# Indexes
#
#  index_characters_on_campaign_id  (campaign_id)
#  index_characters_on_guild_id     (guild_id)
#  index_characters_on_slug         (slug)
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#  fk_rails_...  (guild_id => guilds.id)
#


class NonPlayerCharacter < Character

  def challenge_rating
    DndRules.cr_for_npc(self)
  end

  def description_text
    npc_desc = [
      '<div class="p-3">',
      "<h6>Alignment: <strong>#{alignment}</strong></h6>",
      "<h6>Challenge Rating: #{challenge_rating}</h6>",
      "<p><strong>Armor Class</strong>  #{armor_class}</p>",
      "<p><strong>Hit Points</strong>  #{hit_points}</p>",
      "<p><strong>Speed</strong>  #{speed}</p>",
      "<table class='table'><thead><tr><th>STR</th><th>DEX</th><th>CON</th><th>INT</th><th>WIS</th><th>CHA</th></tr></thead>",
      "<tbody><tr><td>#{strength}</td><td>#{dexterity}</td><td>#{constitution}</td><td>#{intelligence}</td><td>#{wisdom}</td><td>#{charisma}</td></tr></tbody></table>",
      "<p><strong>Languages</strong>  #{languages}</p>"
    ]

    unless character_actions.empty?
      npc_desc << '<h5 class="mt-3">Actions</h5>'
      character_actions.each do |npc_action|
        npc_desc << "<h6 class=\"mt-2\">#{npc_action.name}</h6><div>#{npc_action.description}</div>"
        npc_desc << "<p><strong>Attack Bonus</strong> +#{npc_action.attack_bonus} | <strong>Damage Bonus</strong> +#{npc_action.damage_bonus} | <strong>Damage Dice</strong> #{npc_action.damage_dice}</p>"
      end
    end

    unless spells.empty?
      npc_desc << '<h5 class="mt-3">Spells</h5>'
      npc_desc << spells.order(level: :asc).map { |spell|
        "<strong>#{spell.name} <small>(#{spell.level != 0 ? "level #{spell.level}" : 'Cantrip'})</small></strong>"
      }.join(', ')
    end

    npc_desc << '</div>'

    npc_desc.join
  end
end

# frozen_string_literal: true

class CampaignSync
  # Quests' monsters are in their encounters now, but a quest push from an
  # older module, or one queued in Foundry before the move, can still list
  # monsters among its links (a DM Guru monster, or a book reference to one).
  # Those go to the end of the quest's first encounter instead (a new fight
  # called "Encounter" when it has none), keeping their order and how many,
  # and the rest of the list stays the quest's.
  class QuestMonsters
    def initialize(campaign, quest)
      @campaign = campaign
      @quest = quest
    end

    # The links that stay the quest's
    def move!(list)
      return list unless list.is_a?(Array) && list.all?(Hash)

      monsters, rest = list.partition { |link| monster?(link) }
      Links.new(first_encounter, 'encounter').append!(monsters) if monsters.any?
      rest
    end

    private

    def monster?(link)
      return true if link['linkableType'] == 'Monster'
      return false unless link['linkableType'] == 'CampaignReference' && link['linkableId'].to_s.match?(ID_FORMAT)

      @campaign.book_references.exists?(id: link['linkableId'].to_s.to_i, category: 'monster')
    end

    def first_encounter
      @quest.encounters.first || @quest.encounters.create!(name: 'Encounter', kind: 'combat', position: 0)
    end
  end
end

# frozen_string_literal: true

class MagicItemsUtility
  class << self
    def cost_for_rarity(rarity)
      case rarity
      when 'common'
        100
      when 'uncommon'
        500
      when 'rare'
        5000
      when 'very rare'
        50_000
      when 'legendary'
        75_000
      else
        500
      end
    end
  end
end

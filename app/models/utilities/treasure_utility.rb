# frozen_string_literal: true

class TreasureUtility
  class << self
    def coins
      {
        copper_pieces: 0,
        silver_pieces: 0,
        electrum_pieces: 0,
        gold_pieces: 0,
        platinum_pieces: 0
      }
    end

    def create_individual_treasure(challenge_rating)
      challenge_rating_float = case challenge_rating
                               when '1/8', '1/4', '1/2'
                                 0
                               else
                                 challenge_rating.to_i
                               end
      dice_roll = DndRules.roll_dice(1, 100)
      case challenge_rating_float
      when 0..4
        cr_0_individual(dice_roll)
      when 5..10
        cr_5_individual(dice_roll)
      when 11..16
        cr_11_individual(dice_roll)
      else
        cr_17_individual(dice_roll)
      end
    end

    def cr_0_individual(dice_roll)
      individual_coins = coins
      case dice_roll
      when 1..30
        individual_coins[:copper_pieces] = DndRules.roll_dice(5, 6)
      when 31..60
        individual_coins[:silver_pieces] = DndRules.roll_dice(4, 6)
      when 61..70
        individual_coins[:electrum_pieces] = DndRules.roll_dice(3, 6)
      when 71..95
        individual_coins[:gold_pieces] = DndRules.roll_dice(3, 6)
      else
        individual_coins[:platinum_pieces] = DndRules.roll_dice(1, 6)
      end
      individual_coins
    end

    def cr_5_individual(dice_roll)
      individual_coins = coins
      case dice_roll
      when 1..30
        individual_coins[:copper_pieces] = DndRules.roll_dice(4, 6) * 100
        individual_coins[:electrum_pieces] = DndRules.roll_dice(1, 6) * 10
      when 31..60
        individual_coins[:silver_pieces] = DndRules.roll_dice(6, 6) * 10
        individual_coins[:gold_pieces] = DndRules.roll_dice(2, 6) * 10
      when 61..70
        individual_coins[:electrum_pieces] = DndRules.roll_dice(3, 6) * 10
        individual_coins[:gold_pieces] = DndRules.roll_dice(2, 6) * 10
      when 71..95
        individual_coins[:gold_pieces] = DndRules.roll_dice(4, 6) * 10
      else
        individual_coins[:gold_pieces] = DndRules.roll_dice(2, 6) * 10
        individual_coins[:platinum_pieces] = DndRules.roll_dice(3, 6)
      end
      individual_coins
    end

    def cr_11_individual(dice_roll)
      individual_coins = coins
      case dice_roll
      when 1..20
        individual_coins[:silver_pieces] = DndRules.roll_dice(4, 6) * 100
        individual_coins[:gold_pieces] = DndRules.roll_dice(1, 6) * 100
      when 21..35
        individual_coins[:electrum_pieces] = DndRules.roll_dice(1, 6) * 100
        individual_coins[:gold_pieces] = DndRules.roll_dice(1, 6) * 100
      when 36..75
        individual_coins[:gold_pieces] = DndRules.roll_dice(2, 6) * 100
        individual_coins[:platinum_pieces] = DndRules.roll_dice(1, 6) * 10
      else
        individual_coins[:gold_pieces] = DndRules.roll_dice(2, 6) * 100
        individual_coins[:platinum_pieces] = DndRules.roll_dice(2, 6) * 10
      end
      individual_coins
    end

    def cr_17_individual(dice_roll)
      individual_coins = coins
      case dice_roll
      when 1..15
        individual_coins[:electrum_pieces] = DndRules.roll_dice(2, 6) * 1000
        individual_coins[:gold_pieces] = DndRules.roll_dice(8, 6) * 100
      when 16..55
        individual_coins[:gold_pieces] = DndRules.roll_dice(1, 6) * 1000
        individual_coins[:platinum_pieces] = DndRules.roll_dice(1, 6) * 100
      else
        individual_coins[:gold_pieces] = DndRules.roll_dice(1, 6) * 1000
        individual_coins[:platinum_pieces] = DndRules.roll_dice(2, 6) * 100
      end
      individual_coins
    end

    def create_treasure_hoard(challenge_rating)
      challenge_rating_int = case challenge_rating
                             when '1/8', '1/4', '1/2'
                               0
                             else
                               challenge_rating.to_i
                             end

      case challenge_rating_int
      when 0..5
        cr_0_hoard
      when 6..11
        cr_5_hoard
      when 12..17
        cr_11_hoard
      else
        cr_17_hoard
      end
    end

    def cr_0_hoard
      # TODO: CR 0-4 treasure hoard
    end

    def cr_5_hoard
      # TODO: CR 5-10 treasure hoard
    end

    def cr_11_hoard
      # TODO: CR 11-16 treasure hoard
    end

    def cr_17_hoard
      # TODO: CR 17+ treasure hoard
    end
  end
end

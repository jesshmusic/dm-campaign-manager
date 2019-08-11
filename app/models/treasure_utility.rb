# frozen_string_literal: true

class TreasureUtility
  class << self
    def create_individual_treasure(challenge_rating)
      challenge_rating_float = case challenge_rating
                               when '1/8'
                                 0.125
                               when '1/4'
                                 0.25
                               when '1/2'
                                 0.5
                               else
                                 challenge_rating.to_f
                               end

      case challenge_rating_float
      when 0.0...5.0
        cr_0_individual
      when 5.0...11.0
        cr_5_individual
      when 11.0...17.0
        cr_11_individual
      else
        cr_17_individual
      end
    end

    def cr_0_individual
      # TODO: CR 0-4 treasure hoard
    end

    def cr_5_individual
      # TODO: CR 5-10 treasure hoard
    end

    def cr_11_individual
      # TODO: CR 11-16 treasure hoard
    end

    def cr_17_individual
      # TODO: CR 17+ treasure hoard
    end

    def create_treasure_hoard(challenge_rating)
      challenge_rating_float = case challenge_rating
                               when '1/8'
                                 0.125
                               when '1/4'
                                 0.25
                               when '1/2'
                                 0.5
                               else
                                 challenge_rating.to_f
                               end

      case challenge_rating_float
      when 0.0...5.0
        cr_0_hoard
      when 5.0...11.0
        cr_5_hoard
      when 11.0...17.0
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

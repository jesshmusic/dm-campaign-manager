class HumanSurnameGen
  class << self
    def get_surname
      is_curse = true
      name = ''
      while is_curse
        if rand < 0.1
          name = HumanNameFragments::NAME_9.sample + HumanNameFragments::NAME_10.sample + HumanNameFragments::NAME_11.sample + HumanNameFragments::NAME_10.sample + HumanNameFragments::NAME_12.sample
        elsif rand < 0.25
          name = HumanNameFragments::NAME_21.sample + HumanNameFragments::NAME_22.sample
        elsif rand < 0.35
          name = HumanNameFragments::NAME_30.sample + HumanNameFragments::NAME_31.sample + HumanNameFragments::NAME_32.sample + HumanNameFragments::NAME_31.sample + HumanNameFragments::NAME_33.sample
        elsif rand < 0.45
          name = HumanNameFragments::NAME_50.sample + HumanNameFragments::NAME_51.sample + HumanNameFragments::NAME_52.sample + HumanNameFragments::NAME_51.sample + HumanNameFragments::NAME_52.sample + HumanNameFragments::NAME_51.sample + HumanNameFragments::NAME_53.sample
        elsif rand < 0.55
          name = HumanNameFragments::NAME_50.sample + HumanNameFragments::NAME_51.sample + HumanNameFragments::NAME_52.sample + HumanNameFragments::NAME_51.sample + HumanNameFragments::NAME_53.sample
        elsif rand < 0.65
          name = HumanNameFragments::NAME_62.sample + HumanNameFragments::NAME_63.sample + HumanNameFragments::NAME_64.sample + HumanNameFragments::NAME_63.sample + HumanNameFragments::NAME_64.sample + HumanNameFragments::NAME_63.sample + HumanNameFragments::NAME_64.sample + HumanNameFragments::NAME_63.sample
        elsif rand < 0.75
          name = HumanNameFragments::NAME_62.sample + HumanNameFragments::NAME_63.sample + HumanNameFragments::NAME_64.sample + HumanNameFragments::NAME_63.sample + HumanNameFragments::NAME_64.sample + HumanNameFragments::NAME_63.sample
        elsif rand < 0.85
          name = HumanNameFragments::NAME_70.sample + HumanNameFragments::NAME_71.sample + HumanNameFragments::NAME_72.sample
        else
          name = HumanNameFragments::NAME_80.sample + HumanNameFragments::NAME_14.sample + HumanNameFragments::NAME_81.sample + HumanNameFragments::NAME_14.sample + HumanNameFragments::NAME_81.sample + HumanNameFragments::NAME_14.sample + HumanNameFragments::NAME_82.sample
        end
        is_curse = TestBadWords.run(name)
      end
      name
    end
  end
end
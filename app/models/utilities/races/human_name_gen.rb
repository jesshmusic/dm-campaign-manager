class HumanNameGen
  class << self

    def get_name(gender = nil)
      name = if gender.nil?
               if rand > 0.5
                 self.get_male_name
               else
                 self.get_female_name
               end
             elsif gender == 'male'
               self.get_male_name
             else
               self.get_female_name
             end

    end

    private

    def get_male_name
      is_curse = true
      name = ''
      while is_curse
        rand_int = rand(15)

        if rand_int < 2
          name = HumanNameFragments::NAME_1.sample + HumanNameFragments::NAME_2.sample + HumanNameFragments::NAME_3.sample + HumanNameFragments::NAME_2.sample + HumanNameFragments::NAME_4.sample
        elsif rand_int < 4
          name = HumanNameFragments::NAME_13.sample + HumanNameFragments::NAME_14.sample + HumanNameFragments::NAME_15.sample + HumanNameFragments::NAME_14.sample + HumanNameFragments::NAME_16.sample
        elsif rand_int < 6
          if rand_int == 4
            name = HumanNameFragments::NAME_23.sample + HumanNameFragments::NAME_24.sample + HumanNameFragments::NAME_25.sample + HumanNameFragments::NAME_24.sample + HumanNameFragments::NAME_26.sample
          else
            name = HumanNameFragments::NAME_23.sample + HumanNameFragments::NAME_24.sample + HumanNameFragments::NAME_26.sample
          end
        elsif rand_int < 8
          if rand_int == 6
            name = HumanNameFragments::NAME_34.sample + HumanNameFragments::NAME_35.sample + HumanNameFragments::NAME_36.sample + HumanNameFragments::NAME_35.sample + HumanNameFragments::NAME_37.sample
          else
            name = HumanNameFragments::NAME_34.sample + HumanNameFragments::NAME_35.sample + HumanNameFragments::NAME_37.sample
          end
        elsif rand_int < 10
          if rand_int == 8
            name = HumanNameFragments::NAME_43.sample + HumanNameFragments::NAME_44.sample + HumanNameFragments::NAME_45.sample + HumanNameFragments::NAME_44.sample + HumanNameFragments::NAME_45.sample + HumanNameFragments::NAME_44.sample + HumanNameFragments::NAME_46.sample
          else
            name = HumanNameFragments::NAME_43.sample + HumanNameFragments::NAME_44.sample + HumanNameFragments::NAME_45.sample + HumanNameFragments::NAME_44.sample + HumanNameFragments::NAME_46.sample
          end
        elsif rand_int < 12
          if rand_int == 10
            name = HumanNameFragments::NAME_54.sample + HumanNameFragments::NAME_55.sample + HumanNameFragments::NAME_56.sample + HumanNameFragments::NAME_55.sample + HumanNameFragments::NAME_56.sample + HumanNameFragments::NAME_55.sample + HumanNameFragments::NAME_57.sample
          else
            name = HumanNameFragments::NAME_54.sample + HumanNameFragments::NAME_55.sample + HumanNameFragments::NAME_56.sample + HumanNameFragments::NAME_55.sample + HumanNameFragments::NAME_57.sample
          end
        elsif rand_int < 14
          name = HumanNameFragments::NAME_65.sample + HumanNameFragments::NAME_66.sample + HumanNameFragments::NAME_67.sample
        else
          if rand_int == 12
            name = HumanNameFragments::NAME_73.sample + HumanNameFragments::NAME_74.sample + HumanNameFragments::NAME_75.sample + HumanNameFragments::NAME_74.sample + HumanNameFragments::NAME_75.sample + HumanNameFragments::NAME_74.sample + HumanNameFragments::NAME_76.sample
          else
            name = HumanNameFragments::NAME_73.sample + HumanNameFragments::NAME_74.sample + HumanNameFragments::NAME_75.sample + HumanNameFragments::NAME_74.sample + HumanNameFragments::NAME_76.sample
          end
        end
        is_curse = TestBadWords.run(name)
      end
      name.capitalize + ' ' + HumanSurnameGen.get_surname.capitalize
    end

    def get_female_name
      is_curse = true
      name = ''
      while is_curse
        rand_int = rand(15)

        if rand_int < 2
          if rand_int == 0
            name = HumanNameFragments::NAME_5.sample + HumanNameFragments::NAME_6.sample + HumanNameFragments::NAME_7.sample + HumanNameFragments::NAME_6.sample + HumanNameFragments::NAME_7.sample + HumanNameFragments::NAME_6.sample + HumanNameFragments::NAME_8.sample
          else
            name = HumanNameFragments::NAME_5.sample + HumanNameFragments::NAME_6.sample + HumanNameFragments::NAME_7.sample + HumanNameFragments::NAME_6.sample + HumanNameFragments::NAME_8.sample
          end
        elsif rand_int < 4
          if rand_int == 2
            name = HumanNameFragments::NAME_17.sample + HumanNameFragments::NAME_18.sample + HumanNameFragments::NAME_19.sample + HumanNameFragments::NAME_18.sample + HumanNameFragments::NAME_19.sample + HumanNameFragments::NAME_18.sample + HumanNameFragments::NAME_20.sample
          else
            name = HumanNameFragments::NAME_17.sample + HumanNameFragments::NAME_18.sample + HumanNameFragments::NAME_19.sample + HumanNameFragments::NAME_18.sample + HumanNameFragments::NAME_20.sample
          end
        elsif rand_int < 6
          if rand_int == 4
            name = HumanNameFragments::NAME_27.sample + HumanNameFragments::NAME_24.sample + HumanNameFragments::NAME_28.sample + HumanNameFragments::NAME_24.sample + HumanNameFragments::NAME_29.sample
          else
            name = HumanNameFragments::NAME_27.sample + HumanNameFragments::NAME_24.sample + HumanNameFragments::NAME_29.sample
          end
        elsif rand_int < 8
          if rand_int == 6
            name = HumanNameFragments::NAME_38.sample + HumanNameFragments::NAME_24.sample + HumanNameFragments::NAME_39.sample + HumanNameFragments::NAME_24.sample + HumanNameFragments::NAME_39.sample + HumanNameFragments::NAME_24.sample + HumanNameFragments::NAME_40.sample
          else
            name = HumanNameFragments::NAME_38.sample + HumanNameFragments::NAME_24.sample + HumanNameFragments::NAME_39.sample + HumanNameFragments::NAME_24.sample + HumanNameFragments::NAME_40.sample
          end
        elsif rand_int < 10
          if rand_int == 8
            name = HumanNameFragments::NAME_47.sample + HumanNameFragments::NAME_14.sample + HumanNameFragments::NAME_48.sample + HumanNameFragments::NAME_14.sample + HumanNameFragments::NAME_48.sample + HumanNameFragments::NAME_14.sample + HumanNameFragments::NAME_49.sample
          else
            name = HumanNameFragments::NAME_47.sample + HumanNameFragments::NAME_14.sample + HumanNameFragments::NAME_48.sample + HumanNameFragments::NAME_14.sample + HumanNameFragments::NAME_49.sample
          end
        elsif rand_int < 12
          if rand_int == 10
            name = HumanNameFragments::NAME_58.sample + HumanNameFragments::NAME_59.sample + HumanNameFragments::NAME_60.sample + HumanNameFragments::NAME_59.sample + HumanNameFragments::NAME_60.sample + HumanNameFragments::NAME_59.sample + HumanNameFragments::NAME_61.sample
          else
            name = HumanNameFragments::NAME_58.sample + HumanNameFragments::NAME_59.sample + HumanNameFragments::NAME_60.sample + HumanNameFragments::NAME_59.sample + HumanNameFragments::NAME_61.sample
          end
        elsif rand_int < 14
          name = HumanNameFragments::NAME_68.sample + HumanNameFragments::NAME_69.sample
        else
          if rand_int == 12
            name = HumanNameFragments::NAME_77.sample + HumanNameFragments::NAME_78.sample + HumanNameFragments::NAME_79.sample + HumanNameFragments::NAME_77.sample + HumanNameFragments::NAME_79.sample + HumanNameFragments::NAME_77.sample
          else
            name = HumanNameFragments::NAME_77.sample + HumanNameFragments::NAME_78.sample + HumanNameFragments::NAME_79.sample + HumanNameFragments::NAME_77.sample
          end
        end
        is_curse = TestBadWords.run(name)
      end
      name.capitalize + ' ' + HumanSurnameGen.get_surname.capitalize
    end
  end
end
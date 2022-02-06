class Aasimar
  class << self
    NAME_1 = ['', '', '', '', 'b', 'br', 'c', 'cr', 'h', 'l', 'm', 'n', 'p', 'r', 't', 'v', 'w', 'z']
    NAME_2 = %w[a e i o u y a e i o u y a e i o u y au ai ea ei]
    NAME_3 = %w[d dr g gg gr gw k kr kl l ld lg lw lr lt n nr nw nl r rn rr rw rl v vr w]
    NAME_4 = %w[a i a i a i a i a i a i e a i e a i e o o u u ee ia ie ai ei]
    NAME_5 = %w[d l m n t v]
    NAME_6 = %w[l m n nt r]
    NAME_7 = ['', '', '', '', '', 'br', 'd', 'dr', 'h', 'l', 'm', 'n', 'ph', 'r', 'rh', 'th', 'v', 'w', 'z']
    NAME_8 = %w[a i o a i o a i o a i o a i o a i o e e ia io ea eo]
    NAME_9 = %w[d j l ld ldr lv ll lt m mm mn n nr nv nl ndr nm r rd rk rs s sr sl v]
    NAME_10 = %w[a e i o a e i o a e i o a e i o a e i o ea ia ie]
    NAME_11 = %w[l m n r s z]
    NAME_12 = %w[a e i a e i a e i a e i a e i au ou oe]
    NAME_13 = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'h', 'l', 'm', 'n', 'r']

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
        if rand < 0.5
          name = NAME_7.sample + NAME_8.sample + NAME_9.sample + NAME_10.sample + NAME_13.sample
        else
          name = NAME_7.sample + NAME_8.sample + NAME_9.sample + NAME_10.sample + NAME_11.sample + NAME_12.sample + NAME_13.sample
        end
        is_curse = TestBadWords.run(name)
      end
      name
    end

    def get_female_name
      is_curse = true
      name = ''
      while is_curse
        if rand < 0.5
          name = NAME_1.sample + NAME_2.sample + NAME_3.sample + NAME_4.sample + NAME_6.sample
        else
          name = NAME_1.sample + NAME_2.sample + NAME_3.sample + NAME_4.sample + NAME_5.sample + NAME_4.sample + NAME_6.sample
        end
        is_curse = TestBadWords.run(name)
      end
      name
    end
  end
end
class BugbearNameGen
  class << self
    NAME_1 = %w[b br chr d g gh hr kh n r st t th v z zh]
    NAME_2 = %w[a e i o u]
    NAME_3 = %w[d dd dr g gh gg gr rr rd rg rn t tt tr v vr z zz]
    NAME_4 = %w[a i o u]
    NAME_5 = %w[k lk mkk n nn nk r rk rr th]

    def get_name
      is_curse = true
      name = ''
      while is_curse
        if rand < 0.3
          name = NAME_1.sample + NAME_4.sample + NAME_5.sample
        else
          name = NAME_1.sample + NAME_2.sample + NAME_3.sample + NAME_4.sample + NAME_5.sample
        end
        is_curse = TestBadWords.run(name)
      end
      name
    end
  end
end
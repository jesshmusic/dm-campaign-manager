class HalfOrcNameGen
  class << self
    NAME_1 = %w[Ag Agg Ar Arn As At Atr B Bar Bel Bor Br Brak C Cr D Dor Dr Dur G Gal Gan Gar Gna Gor Got Gr Gram Grim Grom Grum Gul H Hag Han Har Hog Hon Hor Hun Hur K Kal Kam Kar Kel Kil Kom Kor Kra Kru Kul Kur Lum M Mag Mahl Mak Mal Mar Mog Mok Mor Mug Muk Mura N Oggu Ogu Ok Oll Or Rek Ren Ron Rona S Sar Sor T Tan Th Thar Ther Thr Thur Trak Truk Ug Uk Ukr Ull Ur Urth Urtr Z Za Zar Zas Zav Zev Zor Zur Zus]
    NAME_2 = %w[a a a o o e i u u u]
    NAME_3 = %w[bak bar bark bash bur burk d dak dall dar dark dash dim dur durk g gak gall gar gark gash glar gul gur m mak mar marsh mash mir mur n nar nars nur rak rall rash rim rimm rk rsh rth ruk sk tar tir tur z zall zar zur]
    NAME_4 = %w[Al Ar Br Ek El Fal Fel Fol Ful G Gaj Gar Gij Gor Gr Gry Gyn Hur K Kar Kat Ker Ket Kir Kot Kur Kut Lag M Mer Mir Mor N Ol Oot Puy R Rah Rahk Ras Rash Raw Roh Rohk S Sam San Sem Sen Sh Shay Sin Sum Sun Tam Tem Tu Tum Ub Um Ur Van Zan Zen Zon Zun]
    NAME_5 = %w[a a o o e i i u]
    NAME_6 = %w[d da dar dur g gar gh gri gu sh sha shi gum gume gur ki mar mi mira me mur ne ner nir nar nchu ni nur ral rel ri rook ti tah tir tar tur war z zar zara zi zur zura zira]

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
        name = NAME_4.sample + NAME_5.sample + NAME_6.sample
        is_curse = TestBadWords.run(name)
      end
      name.capitalize
    end

    def get_female_name
      is_curse = true
      name = ''
      while is_curse
        name = NAME_1.sample + NAME_2.sample + NAME_3.sample
        is_curse = TestBadWords.run(name)
      end
      name.capitalize
    end
  end
end
class HalfElf
  class << self
    NAME_1 = %w[Al Aro Bar Bel Cor Cra Dav Dor Eir El Fal Fril Gaer Gra Hal Hor Ian Ilo Jam Kev Kri Leo Lor Mar Mei Nil Nor Ori Os Pan Pet Quo Raf Ri Sar Syl Tra Tyr Uan Ul Van Vic Wal Wil Xan Xav Yen Yor Zan Zyl]
    NAME_2 = %w[avor ben borin coril craes deyr dithas elor enas faelor faerd finas fyr gotin gretor homin horn kas koris lamir lanann lumin minar morn nan neak neiros orin ovar parin phanis qarim qinor reak ril ros sariph staer torin tumil valor voril warith word xian xiron yeras ynor zaphir zaren]
    NAME_3 = %w[Alu Aly Ar Bren Byn Car Co Dar Del El Eli Fae Fha Gal Gif Haly Ho Ile Iro Jen Jil Kri Kys Les Lora Ma Mar Mare Neri Nor Ol Ophi Phaye Pri Qi Que Rel Res Sael Saf Syl Ther Tyl Una Uri Ven Vyl Win Wol Xil Xyr Yes Yll Zel Zin]
    NAME_4 = %w[aerys anys bellis bwynn cerys charis diane dove elor enyphe faen fine galyn gwynn hana hophe kaen kilia lahne lynn mae malis mythe nalore noa nys ona phira pisys qarin qwyn rila rora seris stine sys thana theris tihne trana viel vyre walyn waris xaris xipha yaries yra zenya zira]

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
        name = NAME_1.sample + NAME_2.sample
        is_curse = TestBadWords.run(name)
      end
      name.capitalize
    end

    def get_female_name
      is_curse = true
      name = ''
      while is_curse
        name = NAME_3.sample + NAME_4.sample
        is_curse = TestBadWords.run(name)
      end
      name.capitalize
    end
  end
end
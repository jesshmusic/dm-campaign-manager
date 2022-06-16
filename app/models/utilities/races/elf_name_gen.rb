class ElfNameGen
  class << self
    NAME_1 = %w[Ad Ae Bal Bei Car Cra Dae Dor El Ela Er Far Fen Gen Glyn Hei Her Ian Ili Kea Kel Leo Lu Mira Mor Nae Nor Olo Oma Pa Per Pet Qi Qin Ralo Ro Sar Syl The Tra Ume Uri Va Vir Waes Wran Yel Yin Zin Zum]
    NAME_2 = %w[balar beros can ceran dan dithas faren fir geiros golor hice horn jeon jor kas kian lamin lar len maer maris menor myar nan neiros nelis norin peiros petor qen quinal ran ren ric ris ro salor sandoral toris tumal valur ven warin wraek xalim xidor yarus ydark zeiros zumin]
    NAME_3 = %w[Ad Ara Bi Bry Cai Chae Da Dae Eil En Fa Fae Gil Gre Hele Hola Iar Ina Jo Key Kris Lia Lora Mag Mia Neri Ola Ori Phi Pres Qi Qui Rava Rey Sha Syl Tor Tris Ula Uri Val Ven Wyn Wysa Xil Xyr Yes Ylla Zin Zyl]
    NAME_4 = %w[banise bella caryn cyne di dove fiel fina gella gwyn hana harice jyre kalyn krana lana lee leth lynn moira mys na nala phine phyra qirelle ra ralei rel rie rieth rona rora roris satra stina sys thana thyra tris varis vyre wenys wynn xina xisys ynore yra zana zorwyn]

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
      name.capitalize + ' ' + ElfSurnameGen.get_surname.capitalize
    end

    def get_female_name
      is_curse = true
      name = ''
      while is_curse
        name = NAME_3.sample + NAME_4.sample
        is_curse = TestBadWords.run(name)
      end
      name.capitalize + ' ' + ElfSurnameGen.get_surname.capitalize
    end

    def get_surname
      is_curse = true
      name = ''
      random_name = rand
      while is_curse
        if rand < 0.5
          name = NAME_12.sample + NAME_13.sample
        else
          if random_name < 0.3
            name = NAME_5.sample + NAME_6.sample + NAME_7.sample + NAME_8.sample + NAME_9.sample + NAME_10.sample + NAME_11.sample
          elsif random_name < 0.6
            name = NAME_5.sample + NAME_6.sample + NAME_7.sample + NAME_8.sample + NAME_9.sample + NAME_8.sample + NAME_9.sample + NAME_10.sample
          else
            name = NAME_5.sample + NAME_6.sample + NAME_9.sample + NAME_8.sample + NAME_7.sample + NAME_8.sample + NAME_9.sample + NAME_10.sample + NAME_11.sample
          end
        end
        is_curse = TestBadWords.run(name)
      end
      name
    end
  end
end
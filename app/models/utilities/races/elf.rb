class Elf
  class << self
    NAME_1 = %w[Ad Ae Bal Bei Car Cra Dae Dor El Ela Er Far Fen Gen Glyn Hei Her Ian Ili Kea Kel Leo Lu Mira Mor Nae Nor Olo Oma Pa Per Pet Qi Qin Ralo Ro Sar Syl The Tra Ume Uri Va Vir Waes Wran Yel Yin Zin Zum]
    NAME_2 = %w[balar beros can ceran dan dithas faren fir geiros golor hice horn jeon jor kas kian lamin lar len maer maris menor myar nan neiros nelis norin peiros petor qen quinal ran ren ric ris ro salor sandoral toris tumal valur ven warin wraek xalim xidor yarus ydark zeiros zumin]
    NAME_3 = %w[Ad Ara Bi Bry Cai Chae Da Dae Eil En Fa Fae Gil Gre Hele Hola Iar Ina Jo Key Kris Lia Lora Mag Mia Neri Ola Ori Phi Pres Qi Qui Rava Rey Sha Syl Tor Tris Ula Uri Val Ven Wyn Wysa Xil Xyr Yes Ylla Zin Zyl]
    NAME_4 = %w[banise bella caryn cyne di dove fiel fina gella gwyn hana harice jyre kalyn krana lana lee leth lynn moira mys na nala phine phyra qirelle ra ralei rel rie rieth rona rora roris satra stina sys thana thyra tris varis vyre wenys wynn xina xisys ynore yra zana zorwyn]
    NAME_5 = ['', '', '', 'b', 'c', 'd', 'dr', 'f', 'fl', 'g', 'h', 'k', 'l', 'm', 'n', 'r', 'qu', 's', 'sh', 't', 'th', 'v', 'w', 'x', 'y']
    NAME_6 = %w[ae ie ia ei ey a e i o u a e i o u a e i o u a e i o u a e i o u a e i o u]
    NAME_7 = %w[dr l l ld ldr ll lph lt lth m n ndr nn nt ph r r rd rn s sh st str th thr v]
    NAME_8 = %w[a e i o u]
    NAME_9 = %w[dr lk ndr nthr sc st str thr c h l m n nn ph r rr s ss v x]
    NAME_10 = %w[ii ie aea ia ua a e i o a e i o a e i o a e i o a e i o a e i o a e i o a e i o]
    NAME_11 = ['', '', '', '', '', 'l', 'n', 'nn', 'nt', 'r', 's', 'sh', 'th']
    NAME_12 = %w[alder amber ash aspen autumn azure beech birch blue bold bronze cedar crimson dawn dew diamond dusk eager elder elm ember even fall far feather fir flower fog forest gem gold green hazel light lunar mist moon moss night oak oaken ocean poplar rain rapid raven sage shadow silent silver spark spirit spring star still stone summer sun swift wild willow wind winter wood]
    NAME_13 = %w[beam bell birth blossom breath breeze brook cloud crown dew dream dreamer fall fate flight flow flower fond gaze gazer gift gleam grove guard heart heel hold kind light mane might mind moon path petal pride rest river seeker sense shadow shard shine singer smile song spark spell spirit star vale walker watcher whisper wish]

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
      name.capitalize + ' ' + self.get_surname.capitalize
    end

    def get_female_name
      is_curse = true
      name = ''
      while is_curse
        name = NAME_3.sample + NAME_4.sample
        is_curse = TestBadWords.run(name)
      end
      name.capitalize + ' ' + self.get_surname.capitalize
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
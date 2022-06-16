class GnomeNameGen
  class << self
    NAME_1 = %w[Al Ari Bil Bri Cal Cor Dav Dor Eni Er Far Fel Ga Gra His Hor Ian Ipa Je Jor Kas Kel Lan Lo Man Mer Nes Ni Or Oru Pana Po Qua Quo Ras Ron Sa Sal Sin Tan To Tra Um Uri Val Vor War Wil Wre Xal Xo Ye Yos Zan Zil]
    NAME_2 = %w[bar ben bis corin cryn don dri fan fiz gim grim hik him ji jin kas kur len lin min mop morn nan ner ni pip pos rick ros rug ryn ser ston tix tor ver vyn win wor xif xim ybar yur ziver zu]
    NAME_3 = %w[Alu Ari Ban Bree Car Cel Daphi Do Eili El Fae Fen Fol Gal Gren Hel Hes Ina Iso Jel Jo Klo Kri Lil Lori Min My Ni Ny Oda Or Phi Pri Qi Que Re Rosi Sa Sel Spi Ta Tifa Tri Ufe Uri Ven Vo Wel Wro Xa Xyro Ylo Yo Zani Zin]
    NAME_4 = %w[bi bys celi ci dira dysa fi fyx gani gyra hana hani kasys kini la li lin lys mila miphi myn myra na niana noa nove phina pine qaryn qys rhana roe sany ssa sys tina tra wyn wyse xi xis yaris yore za zyre]
    NAME_5 = ['', '', 'b', 'd', 'f', 'g', 'h', 'l', 'm', 'n', 'p', 'r', 's', 't', 'w', 'z']
    NAME_6 = %w[ae oo ee aa a e i o u a e i o u a e i o u a e i o u a e i o u a e i o u a e i o u a e i o u]
    NAME_7 = %w[bbl ckl f ff ggl kk lb lk ln lr lw mb ml mm mml mp mpl nb ng ngg nn np p pl pp r rc rg rk rn rr s sg sgr]
    NAME_8 = %w[a a e e i o u]
    NAME_9 = %w[b d n r s t]
    NAME_10 = %w[a e e i o]
    NAME_11 = ['', '', 'ck', 'g', 'l', 'l', 'll', 'mp', 'n', 'n', 'n', 'nd', 'r', 'r', 'rs', 's', 's']
    NAME_12 = %w[bl bbl ckl dl ddl ggl gl mbl mpl pl ppl]
    NAME_13 = %w[babble baffle bellow belly berry billow bold boon brass brisk broad bronze cobble copper dapple dark dazzle deep fapple fiddle fine fizzle flicker fluke glitter gobble gold iron kind last light long loud lucky marble pale pebble puddle quick quiet quill shadow short silver single sparkle spring squiggle stark stout strong swift thistle thunder tinker toggle tossle true twin twist waggle whistle wiggle wild wobble]
    NAME_14 = %w[back badge belch bell belt bit block bonk boot boots bottom braid branch brand case cheek cloak collar cord craft crag diggles drop dust dwadle fall feast fen fern field firn flight flow front gem gift grace guard hand heart helm hide hold kind ligt lob mane mantle mask patch peak pitch pocket reach rest river rock shield song span spark spell spring stamp stand stitch stone thread top trick twist wander]

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
            name = NAME_5.sample + NAME_6.sample + NAME_7.sample + NAME_8.sample + NAME_11.sample
          elsif random_name < 0.6
            name = NAME_5.sample + NAME_6.sample + NAME_7.sample + NAME_8.sample + NAME_9.sample + NAME_10.sample + NAME_11.sample
          else
            name = NAME_5.sample + NAME_6.sample + NAME_7.sample + NAME_8.sample + NAME_9.sample + NAME_10.sample + NAME_9.sample + NAME_10.sample + NAME_11.sample
          end
        end
        is_curse = TestBadWords.run(name)
      end
      name
    end
  end
end
class DwarfNameGen
  class << self
    NAME_1 = %w[Ad Am Arm Baer Daer Bal Ban Bar Bel Ben Ber Bhal Bhar Bhel Bram Bran Brom Brum Bun Dal Dar Dol Dul Eb Em Erm Far Gal Gar Ger Gim Gral Gram Gran Grem Gren Gril Gry Gul Har Hjal Hjol Hjul Hor Hul Hur Kar Khar Kram Krom Krum Mag Mal Mel Mor Muir Mur Rag Ran Reg Rot Thal Thar Thel Ther Tho Thor Thul Thur Thy Tor Ty Um Urm Von]
    NAME_2 = %w[adin bek brek dahr dain dal dan dar dek dir dohr dor drak dram dren drom drum drus duhr dur dus garn gram gran grim grom gron grum grun gurn gus iggs kahm kam kohm kom kuhm kum kyl man mand mar mek miir min mir mond mor mun mund mur mus myl myr nam nar nik nir nom num nur nus nyl rak ram ren rig rigg rik rim rom ron rum rus ryl tharm tharn thran thrum thrun]
    NAME_3 = %w[An Ar Baer Bar Bel Belle Bon Bonn Braen Bral Bralle Bran Bren Bret Bril Brille Brol Bron Brul Bryl Brylle Bryn Bryt Byl Bylle Daer Dear Dim Ed Ein El Gem Ger Gwan Gwen Gwin Gwyn Gym Ing Jen Jenn Jin Jyn Kait Kar Kat Kath Ket Las Lass Les Less Lyes Lys Lyss Maer Maev Mar Mis Mist Myr Mys Myst Naer Nal Nas Nass Nes Nis Nys Raen Ran Red Reyn Run Ryn Sar Sol Tas Taz Tis Tish Tiz Tor Tys Tysh]
    NAME_4 = %w[belle bera delle deth dielle dille dish dora dryn dyl giel glia glian gwyn la leen leil len lin linn lyl lyn lynn ma mera mora mura myl myla nan nar nas nera nia nip nis niss nora nura nyl nys nyss ra ras res ri ria rielle rin ris ros ryl ryn sael selle sora syl thel thiel tin tyn va van via vian waen win wyn wynn]
    NAME_5 = %w[b br c d dr f g gl gr h l m r str t thr]
    NAME_6 = %w[ae a e o u a e o u a e o u a e o u]
    NAME_7 = %w[br d fd h k lbr ld ll mn ng nh nk r rd rth tg thg zz]
    NAME_8 = %w[a e i o u]
    NAME_9 = %w[g h k n r v]
    NAME_10 = %w[a a e e i o u]
    NAME_11 = %w[ck g hk hr k ln m n nn r rk rr rt]
    NAME_12 = %w[battle big black blood bold boulder brave brawn bright broad bronze brood burrow cold dark deep drunk even ever fire first flint frost frozen giant goblin gold golden gray great half hammer hard iron keen kind last light loud mad marble might molten mountain silver smug stark steel stern stone storm stout strong thunder troll true wild]
    NAME_13 = %w[ale anvil axe back bane beard belch belt blade bleeder blood boot boots bottom braid branch breaker breath brow buster delver eye eyes fall feast finder fist fists flight force forge found front fury gift grace grip guard hammer hand handle head heart helm hold horn kin kind kith mane mantle mask might pass past pride reach rest roar rock shaper shield song stand stone storm strike tale tankard ward]

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
        if random_name < 0.5
          name = NAME_12.sample + NAME_13.sample
        elsif random_name < 0.75
          name = NAME_5.sample + NAME_6.sample + NAME_7.sample + NAME_10.sample + NAME_11.sample
        else
          name = NAME_5.sample + NAME_6.sample + NAME_7.sample + NAME_8.sample + NAME_9.sample + NAME_10.sample + NAME_11.sample
        end
        is_curse = TestBadWords.run(name)
      end
      name
    end
  end
end
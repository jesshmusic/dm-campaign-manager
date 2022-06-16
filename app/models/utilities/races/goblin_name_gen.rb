class GoblinNameGen
  class << self
    NAME_1 = ['', '', 'c', 'cr', 'd', 'g', 'h', 'j', 'kr', 'm', 'n', 'p', 'r', 's', 'st', 't', 'v', 'vr', 'z', 'zr']
    NAME_2 = %w[a e i o u a u]
    NAME_3 = %w[ch dg dr g gd gl gg gr j ll rr rd]
    NAME_4 = ['', 'b', 'g', 'gg', 'k', 'lk', 'rg', 'rk', 's', 't']
    NAME_5 = ['', '', 'b', 'd', 'g', 'j', 'm', 'n', 'p', 'q', 'r', 'v', 'z']
    NAME_6 = %w[a i u a i u o e]
    NAME_7 = %w[b br d dr g gn gv gr lg lgr ld ldr lv lz ln nd nv nr rg rz rdr rgr rt]
    NAME_8 = %w[d dd g l ld ll n nd nn y v z]
    NAME_9 = ['', '', 'k', 'l', 'n', 'r', 's', 't']
    NAME_10 = %w[Ant Bait Baitworm Bearbelch Bearbite Beardung Beetle Belch Bigchin Birdbrain Bitenose Bitesize Blockhead Boarbait Boardung Bonehead Bottomfeeder Bottomfood Brainmush Breadstick Bucket Buffoon Bugbite Candlestick Chickenbrain Chowder Clam Coldnose Crawly Deviant Dirtbrain Dirtface Donkey Dungbreath Fly Frogface Froghead Frogwart Gnat Gnatface Grubface Grubgrub Guano Ingrate Insect Larva Leech Leechbrain Leechhead Leechnose Louse Lousehead Maggot Maggotbrain Malformed Mealworm Mite Mitemouth Moldbrain Moldnose Mongrel Mud Mudface Mudmouth Mudmug Mudnose Mule No-Ear No-Ears No-Eyes No-Nose No-Toes One-Eye Owlball Peon Pest Pig Pigface Pighead Pigmud Pigmug Pinkeye Redeye Sleaze Slime Slug Slugmug Snack Snailbrain Snailnose Snot Snotnose Spiderbait Toadbrain Toadface Toadwart Toenail Uglymug Vermin Wartface Weasel Weevil Worm Wormfood Wormmouth Wriggler]
    NAME_11 = %w[Wide Ugly Strange Slime Pale Grime Grease Bone Bent Bitter Broken Dirt Dull Fat Flat Frail Glob Gout Grim Grub Half Ichor Limp Lump Mad Meek Mold Moss Muck Mud Murk Numb Oaf Shrill Sick Smug Snail Snot Slug Stink Stub Wart Weak Worm]
    NAME_12 = %w[arm arms ear eye eyes bone bones brain cheek cheeks chin face flab flank foot feet gob gut guts head knuckle knuckles leg legs maw mug nose tooth teeth will]

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

    def get_common_name
      if rand < 0.5
        NAME_10.sample
      else
        NAME_11.sample + NAME_12.sample
      end
    end

    def get_male_name
      is_curse = true
      name = ''
      random_name = rand
      while is_curse
        name = if random_name < 0.4
                 get_common_name
               elsif random_name < 0.65
                 NAME_1.sample + NAME_2.sample + NAME_4.sample
               else
                 NAME_1.sample + NAME_2.sample + NAME_3.sample + NAME_2.sample + NAME_4.sample
               end
        is_curse = TestBadWords.run(name)
      end
      name.capitalize
    end

    def get_female_name
      is_curse = true
      name = ''
      random_name = rand
      while is_curse
        name = if random_name < 0.3
                 get_common_name
               elsif random_name < 0.5
                 NAME_5.sample + NAME_6.sample + NAME_9.sample
               elsif random_name < 0.75
                 NAME_5.sample + NAME_6.sample + NAME_7.sample + NAME_6.sample + NAME_9.sample
               else
                 NAME_5.sample + NAME_6.sample + NAME_7.sample + NAME_6.sample + NAME_8.sample + NAME_6.sample + NAME_9.sample
               end
        is_curse = TestBadWords.run(name)
      end
      name.capitalize
    end
  end
end
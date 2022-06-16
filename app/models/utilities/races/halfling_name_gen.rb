class HalflingNameGen
  class << self
    NAME_1 = %w[An Ar Bar Bel Con Cor Dan Dav El Er Fal Fin Flyn Gar Go Hal Hor Ido Ira Jan Jo Kas Kor La Lin Mar Mer Ne Nor Ori Os Pan Per Pim Quin Quo Ri Ric San Shar Tar Te Ul Uri Val Vin Wen Wil Xan Xo Yar Yen Zal Zen]
    NAME_2 = %w[ace amin bin bul dak dal der don emin eon fer fire gin hace horn kas kin lan los min mo nad nan ner orin os pher pos ras ret ric rich rin ry ser sire ster ton tran umo ver vias von wan wrick yas yver zin zor zu]
    NAME_3 = %w[An Ari Bel Bre Cal Chen Dar Dia Ei Eo Eli Era Fay Fen Fro Gel Gra Ha Hil Ida Isa Jay Jil Kel Kith Le Lid Mae Mal Mar Ne Ned Odi Ora Pae Pru Qi Qu Ri Ros Sa Shae Syl Tham Ther Tryn Una Uvi Va Ver Wel Wi Xan Xi Yes Yo Zef Zen]
    NAME_4 = %w[alyn ara brix byn caryn cey da dove drey elle eni fice fira grace gwen haly jen kath kis leigh la lie lile lienne lyse mia mita ne na ni nys ola ora phina prys rana ree ri ris sica sira sys tina trix ula vira vyre wyn wyse yola yra zana zira]
    NAME_5 = %w[amber apple autumn barley big boulder bramble bright bronze brush cherry cinder clear cloud common copper deep dust earth elder ember fast fat fern flint fog fore free glen glow gold good grand grass great green haven heart high hill hog humble keen laughing lea leaf light little lone long lunar marble mild mist moon moss night nimble proud quick raven reed river rose rumble shadow silent silver smooth soft spring still stone stout strong summer sun swift tall tea ten thistle thorn toss true twilight under warm whisper wild wise]
    NAME_6 = %w[ace barrel beam belly berry bloom blossom bluff bottle bough brace braid branch brand bridge brook brush cheeks cloak cobble creek crest dance dancer dew dream earth eye eyes feet fellow finger fingers flow flower foot found gather glide grove hand hands hare heart hill hollow kettle lade leaf man mane mantle meadow moon mouse pot rabbit seeker shadow shine sky song spark spell spirit step stride sun surge top topple vale water whistle willow wind wood woods]

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
      while is_curse
        name = NAME_5.sample + NAME_6.sample
        is_curse = TestBadWords.run(name)
      end
      name
    end
  end
end
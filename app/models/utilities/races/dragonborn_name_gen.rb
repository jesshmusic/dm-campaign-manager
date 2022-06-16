class DragonbornNameGen
  class << self
    NAME_1 = %w[Ali Ar Ba Bal Bel Bha Bren Caer Calu Dur Do Dra Era Faer Fro Gre Ghe Gora He Hi Ior Jin Jar Kil Kriv Lor Lumi Mar Mor Med Nar Nes Na Oti Orla Pri Pa Qel Ravo Ras Rho Sa Sha Sul Taz To Trou Udo Uro Vor Vyu Vrak Wor Wu Wra Wul Xar Yor Zor Zra]
    NAME_2 = %w[barum bor broth ciar crath daar dhall dorim farn fras gar ghull grax hadur hazar jhan jurn kax kris kul lasar lin mash morn naar prax qiroth qrin qull rakas rash rinn roth sashi seth skan trin turim varax vroth vull warum wunax xan xiros yax ythas zavur zire ziros]
    NAME_3 = %w[Ari A Bi Bel Cris Ca Drys Da Erli Esh Fae Fen Gur Gri Hin Ha Irly Irie Jes Jo Ka Kel Ko Lilo Lora Mal Mi Na Nes Nys Ori O Ophi Phi Per Qi Quil Rai Rashi So Su Tha Ther Uri Ushi Val Vyra Welsi Wra Xy Xis Ya Yr Zen Zof]
    NAME_4 = %w[birith bis bith coria cys dalynn drish drith faeth fyire gil gissa gwen hime hymm karyn kira larys liann lyassa meila myse norae nys patys pora qorel qwen rann riel rina rinn rish rith saadi shann sira thibra thyra vayla vyre vys wophyl wyn xiris xora yassa yries zita zys]
    NAME_5 = ['', '', '', '', 'c', 'cl', 'cr', 'd', 'dr', 'f', 'g', 'k', 'kl', 'kr', 'l', 'm', 'my', 'n', 'ny', 'pr', 'sh', 't', 'th', 'v', 'y']
    NAME_6 = %w[a e i a e i o u a e i a e i o u a e i a e i o u aa ia ea ua uu]
    NAME_7 = %w[c cc ch lm lk lx ld lr ldr lt lth mb mm mp mph mr mt nk nx nc p ph r rd rj rn rrh rth st tht x]
    NAME_8 = %w[c cm cn d j k km l n nd ndr nk nsht nth r s sht shkm st t th x]
    NAME_9 = %w[d j l ll m n nd rg r rr rd]
    NAME_10 = %w[c d k l n r s sh th]

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
        if random_name < 0.4
          name = NAME_5.sample + NAME_6.sample + NAME_7.sample + NAME_6.sample + NAME_10.sample
        elsif random_name < 0.7
          name = NAME_5.sample + NAME_6.sample + NAME_7.sample + NAME_6.sample + NAME_8.sample + NAME_6.sample + NAME_10.sample
        else
          name = NAME_5.sample + NAME_6.sample + NAME_7.sample + NAME_6.sample + NAME_8.sample + NAME_6.sample + NAME_9.sample + NAME_6.sample + NAME_10.sample
        end
        is_curse = TestBadWords.run(name)
      end
      name
    end
  end
end
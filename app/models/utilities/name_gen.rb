# frozen_string_literal: true

require 'openai'

class NameGen
  attr_accessor :names


  class << self

    # Generate fantasy names
    def generate_name(prompt)
      openai = OpenAI::Client.new(api_key: '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')
      response = openai.completions(
        engine: 'text-davinci-002',
        prompt: prompt,
        max_tokens: 25,
        temperature: 1,
        n: 1,
        stop: '\n'
      )
      response['choices'][0]['text'].strip
    end

    def generate_prompt(race, gender, custom = '')
      "Create a single random name of a #{gender} #{race} from the Dungeons and Dragons setting.\n
      #{custom}\n
      Try to avoid using the names of existing fictional characters or creatures."
    end

    def get_dragon_name(gender)
      generate_name("Create a unique fantasy #{gender} dragon name that sounds majestic and ancient. The name should be
      at least two syllables long. The name should also end with a one- or two-syllable suffix that evokes power or
      grandeur, such as -gon, -thor, -ax, -yxx, -ix, -axa, -yxxa, -ixa, or -mir.")
    end

    def get_demon_name(gender)
      generate_name(generate_prompt('demon', gender))
    end

    def get_goblin_name(gender)
      generate_name(generate_prompt('goblin', gender, 'It can either have a single name, a first and last name, or a title similar to "the Slayer"'))
    end

    def get_orc_name(gender)
      generate_name(generate_prompt('orc', gender, 'It can either have a single name, a first and last name, or a title similar to "the Slayer"'))
    end

    def get_half_orc_name(gender)
      generate_name(generate_prompt('half-orc', gender, 'It should have a first and last name or a title. The random name can also be a mix or orcish or human type names.'))
    end

    def get_ogre_name(gender)
      generate_name(generate_prompt('ogre', gender ))
    end

    def get_human_name(gender)
      generate_name(generate_prompt('human', gender, 'It should have a first and last name or a title'))
    end

    def get_halfling_name(gender)
      generate_name(generate_prompt('halfling', gender, 'It should have a first and last name'))
    end

    def get_dwarf_name(gender)
      generate_name(generate_prompt('dwarf', gender, 'It should have a first and last name or title. Do not use the names "Gimli", "Gimli son of Gloin", "Durin Oakenshield", "Thorin Oakenshield"'))
    end

    def get_dragonborn_name(gender)
      generate_name(generate_prompt('dragonborn', gender, 'Some prefixes for the first name might include: Ak, Bi, Daa, Fari, Hara, Havi, Jhe, Kav, Kori, Mis, Nal, Per, Rai, Sor, Sur, Tha, Uad, Arjh, Balas, Bhar, Don, Ghe, Hes, Kri, Medr, Meh, Nad, Pandj, Patr, Rho, Shama, Shedi, Tar.
 Some suffixes for the first name might include: ra, sh, aar, ash, inn, arn, esh, iv, rax, oon, ed, jed, in, ar, og, ur, un, as, gon, or, on, el, am, ash, un, hun, in, un.
 Some prefixes for the last name might include: Cleth, Daar, Del, Drach, Fenk, Kepeshk, Kerrh, Kambat, Linxak, Mya, Nemon, Norix, Ophin, Prexi, Shestend, Turnur, Verthis, Yarj.
Some middle syllables for the last name might include: tin, den, mir, chedan, kab, esh, rhy, hyl, senda, stan, mon, xius, phin, jand, liath, ur, thurgi, jer.
 Some suffixes for the last name might include: thiallor, drian, mirev, dion, kabradon, kmolik, hylon, tuul, sendalor, stan, monis, ius, stalajiir, andilin, eliath, roth, sathurgiesh, or jerit'))

    end

    def random_name(gender = nil, race = 'human')
      case race
      when 'dragon'
        get_dragon_name(gender)
      when 'demon'
        get_demon_name(gender)
      when 'dwarf'
        get_dwarf_name(gender)
      when 'orc'
        get_orc_name(gender)
      when 'half_orc'
        get_half_orc_name(gender)
      when 'ogre'
        get_ogre_name(gender)
      when 'goblin'
        get_goblin_name(gender)
      when 'human'
        get_human_name(gender)
      when 'halfling'
        get_halfling_name(gender)
      when 'dragonborn'
        get_dragonborn_name(gender)
      else
        generate_name(generate_prompt(race, gender, 'It should include a first and last name or title'))
      end
    end

    def random_tavern_name
      generate_name('Create a single random name of a tavern or inn in the Dungeons and Dragons setting. Try to avoid using the names of existing fictional places.')
    end

    def random_monster_name
      generate_name('Create a single random name of a monster in the Dungeons and Dragons setting. It should not be an existing monster in D&D, but rather the name of some new kind of creature.')
    end
  end
end

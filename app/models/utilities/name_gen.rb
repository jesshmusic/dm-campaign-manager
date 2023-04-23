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
        max_tokens: 50,
        n: 1,
        stop: '\n'
      )
      response['choices'][0]['text'].strip
    end

    def get_dragon_name
      generate_name('Generate a random name of a dragon from the Dungeons and Dragons setting')
    end

    def get_demon_name
      generate_name('Generate a random name of a demon from the Dungeons and Dragons setting')
    end

    def get_orc_name(gender = nil)
      generate_name('Generate a random name of an orc from the Dungeons and Dragons setting. The last name is optional.')
    end

    def get_half_orc_name(gender = nil)
      generate_name('Generate a random name of a half-orc from the Dungeons and Dragons setting. The last name is optional.')
    end

    def get_ogre_name(gender = nil)
      generate_name('Generate a random name of an ogre from the Dungeons and Dragons setting')
    end

    def get_human_name(gender = nil)
      generate_name("Generate a random name of a human #{gender} with a first and last name from the Dungeons and Dragons setting")
    end

    def get_halfling_name(gender = nil)
      generate_name("Generate a random name of a halfling #{gender} with a first and last name from the Dungeons and Dragons setting")
    end

    def random_name(gender = nil, race = 'human')
      generate_name("Generate a random name of a #{race} #{gender} with a first and last name from the Dungeons and Dragons setting")
    end

    def random_tavern_name
      generate_name('Generate a random name of a tavern or inn in the Dungeons and Dragons setting')
    end

    def random_monster_name
      generate_name('Generate a random name of a monster in the Dungeons and Dragons setting. It should not be an existing monster in D&D, but rather the name of some new kind of creature.')
    end
  end
end

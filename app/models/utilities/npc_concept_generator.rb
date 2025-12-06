# frozen_string_literal: true

# Generates complete NPC concepts using OpenAI
# Takes minimal input (CR, type, alignment, description) and returns a full creature concept
class NpcConceptGenerator
  MAX_DESCRIPTION_LENGTH = 500
  MAX_OUTPUT_TOKENS = 1500

  class << self
    def generate(params)
      validate_params!(params)

      client = OpenAIClient.new(api_key: ENV.fetch('OPENAI_API_KEY', nil))
      prompt = build_prompt(params)

      response = client.completions(
        prompt: prompt,
        max_tokens: MAX_OUTPUT_TOKENS,
        temperature: 0.7, # Lower temperature for more consistent JSON output
        json_mode: true,  # Force OpenAI to return valid JSON
        return_usage: true
      )

      result = parse_response(response[:content], params)

      # Add token usage to successful responses
      result[:token_usage] = response[:usage] if result[:error].nil? && response[:usage]

      result
    rescue OpenAIClient::Error => e
      Rails.logger.error "NpcConceptGenerator OpenAI error: #{e.message}"
      { error: "AI service error: #{e.message.truncate(100)}. Please try again." }
    end

    private

    def validate_params!(params)
      description = params[:description].to_s

      raise ArgumentError, "Description exceeds maximum length of #{MAX_DESCRIPTION_LENGTH} characters" if description.length > MAX_DESCRIPTION_LENGTH

      raise ArgumentError, 'Description must be at least 10 characters' if description.length < 10

      cr = params[:challenge_rating].to_s
      return if valid_cr?(cr)

      raise ArgumentError, 'Invalid challenge rating'
    end

    def valid_cr?(cr)
      CrCalc.challenge_ratings.keys.map(&:to_s).include?(cr)
    end

    def build_prompt(params)
      cr = params[:challenge_rating] || '1'
      monster_type = params[:monster_type] || 'humanoid'
      alignment = params[:alignment] || 'neutral'
      description = sanitize_description(params[:description])

      cr_data = CrCalc.challenge_ratings[cr.to_sym]
      prof_bonus = cr_data[:prof_bonus]
      target_hp_min = cr_data[:hit_points_min]
      target_hp_max = cr_data[:hit_points_max]
      target_ac = cr_data[:armor_class]
      attack_bonus = cr_data[:attack_bonus]

      <<~PROMPT
        You are a D&D 5e creature designer API. Your response must be ONLY a valid JSON object - no explanations, no markdown formatting, no code blocks, no text before or after the JSON. Start your response with { and end with }.

        Requirements:
        - Challenge Rating: #{cr} (proficiency bonus +#{prof_bonus})
        - Type: #{monster_type}
        - Alignment: #{alignment}
        - Target HP range: #{target_hp_min}-#{target_hp_max}
        - Target AC: around #{target_ac}
        - Attack bonus should be around +#{attack_bonus}

        User's concept description: "#{description}"

        Generate a complete creature with:
        1. A creative, evocative name fitting the description
        2. A 2-3 sentence description of the creature's appearance, demeanor, and distinguishing features
        3. Appropriate size for the creature type and CR
        4. Ability scores that make sense for the concept (total around #{ability_score_total_for_cr(cr)})
        5. 1-2 movement types with appropriate speeds
        6. Thematic senses (darkvision, etc. if appropriate)
        7. 2-4 actions including attacks (with Multiattack if CR >= 2)
        8. 1-3 special abilities that fit the theme
        9. Reactions if thematically appropriate
        10. Legendary actions ONLY if CR >= 10

        Return this exact JSON structure:
        {
          "name": "Creature Name",
          "description": "A 2-3 sentence description of the creature's appearance, demeanor, and distinguishing features.",
          "size": "medium",
          "monster_type": "#{monster_type}",
          "alignment": "#{alignment}",
          "armor_class": 14,
          "armor_description": "natural armor",
          "hit_points": 45,
          "hit_dice": "6d8+18",
          "strength": 16,
          "dexterity": 14,
          "constitution": 16,
          "intelligence": 10,
          "wisdom": 12,
          "charisma": 8,
          "speeds": [
            {"name": "walk", "value": 30},
            {"name": "climb", "value": 20}
          ],
          "senses": [
            {"name": "darkvision", "value": 60},
            {"name": "passive Perception", "value": 13}
          ],
          "saving_throws": ["Constitution", "Strength"],
          "skills": ["Athletics", "Perception"],
          "damage_resistances": [],
          "damage_immunities": [],
          "damage_vulnerabilities": [],
          "condition_immunities": [],
          "languages": "Common",
          "actions": [
            {"name": "Multiattack", "desc": "The creature makes two claw attacks."},
            {"name": "Claw", "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d10 + 3) slashing damage."}
          ],
          "special_abilities": [
            {"name": "Keen Smell", "desc": "The creature has advantage on Wisdom (Perception) checks that rely on smell."}
          ],
          "reactions": [],
          "legendary_actions": []
        }

        Ensure all attack bonuses and damage are appropriate for CR #{cr}.
        CRITICAL: Output ONLY the JSON object. No markdown, no code blocks, no explanations. Start with { and end with }.
      PROMPT
    end

    def ability_score_total_for_cr(cr)
      cr_num = CrCalc.cr_string_to_num(cr.to_s)
      # Base total of 72 (average 12 per stat), scales up slightly with CR
      base = 72
      bonus = [cr_num.to_i * 2, 20].min
      base + bonus
    end

    def sanitize_description(description)
      return '' if description.blank?

      description.to_s
                 .gsub(/```[\s\S]*?```/, '')
                 .gsub(/^(system|assistant|user):/i, '')
                 .gsub(/ignore (all |previous )?instructions/i, '')
                 .strip
                 .truncate(MAX_DESCRIPTION_LENGTH)
    end

    def parse_response(response, params)
      return { error: 'The AI returned an empty response. Please try again with a different description.' } if response.blank?

      # Log response for debugging
      Rails.logger.debug { "NpcConceptGenerator raw response: #{response[0..500]}" }

      # Try to extract JSON - handle cases where AI includes markdown code blocks
      json_str = extract_json(response)
      if json_str.blank?
        Rails.logger.error "NpcConceptGenerator could not extract JSON from: #{response[0..200]}"
        return { error: 'The AI response was not in the expected format. Please try again.' }
      end

      # Clean up common JSON issues from AI responses
      json_str = clean_json_string(json_str)

      parsed = JSON.parse(json_str, symbolize_names: true)

      # Normalize and validate the response
      normalize_concept(parsed, params)
    rescue JSON::ParserError => e
      Rails.logger.error "NpcConceptGenerator JSON parse error: #{e.message}, JSON: #{json_str[0..200]}"
      { error: "Failed to parse AI response: #{e.message.truncate(100)}. Please try again." }
    end

    def extract_json(response)
      # First try to find JSON inside markdown code blocks
      code_block_match = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/m)
      return code_block_match[1] if code_block_match

      # Otherwise find the outermost JSON object (non-greedy for nested objects)
      # Use a balanced brace matching approach
      start_idx = response.index('{')
      return nil unless start_idx

      brace_count = 0
      end_idx = start_idx
      response[start_idx..].each_char.with_index do |char, idx|
        brace_count += 1 if char == '{'
        brace_count -= 1 if char == '}'
        if brace_count.zero?
          end_idx = start_idx + idx
          break
        end
      end

      response[start_idx..end_idx]
    end

    def clean_json_string(json_str)
      json_str
        .gsub(/,\s*}/, '}')           # Remove trailing commas before }
        .gsub(/,\s*\]/, ']')          # Remove trailing commas before ]
        .gsub(/:\s*'([^']*)'/, ': "\1"') # Convert single quotes to double quotes
    end

    def normalize_concept(parsed, params)
      cr = params[:challenge_rating] || '1'
      cr_data = CrCalc.challenge_ratings[cr.to_sym]

      {
        name: parsed[:name].to_s.presence || 'Unnamed Creature',
        description: parsed[:description].to_s.truncate(1000),
        size: normalize_size(parsed[:size]),
        monster_type: parsed[:monster_type].to_s.presence || params[:monster_type] || 'humanoid',
        alignment: parsed[:alignment].to_s.presence || params[:alignment] || 'neutral',
        armor_class: parsed[:armor_class].to_i.clamp(5, 25),
        armor_description: parsed[:armor_description].to_s,
        hit_points: parsed[:hit_points].to_i.clamp(1, 999),
        hit_dice: parsed[:hit_dice].to_s.presence || calculate_hit_dice(parsed[:hit_points], parsed[:size], parsed[:constitution]),
        challenge_rating: cr,
        xp: cr_data[:xp],
        prof_bonus: cr_data[:prof_bonus],
        strength: parsed[:strength].to_i.clamp(1, 30),
        dexterity: parsed[:dexterity].to_i.clamp(1, 30),
        constitution: parsed[:constitution].to_i.clamp(1, 30),
        intelligence: parsed[:intelligence].to_i.clamp(1, 30),
        wisdom: parsed[:wisdom].to_i.clamp(1, 30),
        charisma: parsed[:charisma].to_i.clamp(1, 30),
        speeds: normalize_array(parsed[:speeds], :speed),
        senses: normalize_array(parsed[:senses], :sense),
        saving_throws: Array(parsed[:saving_throws]).map(&:to_s),
        skills: Array(parsed[:skills]).map(&:to_s),
        damage_resistances: Array(parsed[:damage_resistances]).map(&:to_s),
        damage_immunities: Array(parsed[:damage_immunities]).map(&:to_s),
        damage_vulnerabilities: Array(parsed[:damage_vulnerabilities]).map(&:to_s),
        condition_immunities: Array(parsed[:condition_immunities]).map(&:to_s),
        languages: parsed[:languages].to_s.presence || 'None',
        actions: normalize_actions(parsed[:actions]),
        special_abilities: normalize_actions(parsed[:special_abilities]),
        reactions: normalize_actions(parsed[:reactions]),
        legendary_actions: normalize_actions(parsed[:legendary_actions])
      }
    end

    def normalize_size(size)
      valid_sizes = %w[tiny small medium large huge gargantuan]
      size_str = size.to_s.downcase
      valid_sizes.include?(size_str) ? size_str : 'medium'
    end

    def normalize_array(arr, type)
      Array(arr).map do |item|
        if item.is_a?(Hash)
          { name: item[:name].to_s, value: item[:value].to_i }
        else
          { name: item.to_s, value: type == :speed ? 30 : 60 }
        end
      end
    end

    def normalize_actions(actions)
      Array(actions)
        .map { |action| { name: action[:name].to_s, desc: action[:desc].to_s } }
        .reject { |a| a[:name].blank? }
    end

    def calculate_hit_dice(hit_points, size, constitution)
      hit_points = hit_points.to_i
      constitution = constitution.to_i
      con_mod = (constitution - 10) / 2

      hit_die = size_to_hit_die(size)

      avg_per_die = (hit_die / 2.0) + 0.5 + con_mod
      num_dice = [(hit_points / avg_per_die).round, 1].max

      con_bonus = num_dice * con_mod
      if con_bonus.positive?
        "#{num_dice}d#{hit_die}+#{con_bonus}"
      elsif con_bonus.negative?
        "#{num_dice}d#{hit_die}#{con_bonus}"
      else
        "#{num_dice}d#{hit_die}"
      end
    end

    def size_to_hit_die(size)
      case size.to_s.downcase
      when 'tiny' then 4
      when 'small' then 6
      when 'large' then 10
      when 'huge' then 12
      when 'gargantuan' then 20
      else 8 # medium or default
      end
    end
  end
end

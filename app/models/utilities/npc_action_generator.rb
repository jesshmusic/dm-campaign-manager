# frozen_string_literal: true

# Generates NPC actions, special abilities, and spells using OpenAI
class NpcActionGenerator
  MAX_DESCRIPTION_LENGTH = 600 # Slightly more than frontend limit to account for encoding
  MAX_OUTPUT_TOKENS = 800

  class << self
    def generate(params)
      validate_params!(params)

      client = OpenAIClient.new(api_key: ENV.fetch('OPENAI_API_KEY', nil))
      prompt = build_prompt(params)

      response = client.completions(
        prompt: prompt,
        max_tokens: MAX_OUTPUT_TOKENS,
        temperature: 0.8
      )

      parse_response(response)
    rescue OpenAIClient::Error => e
      Rails.logger.error "NpcActionGenerator OpenAI error: #{e.message}"
      default_response
    rescue JSON::ParserError => e
      Rails.logger.error "NpcActionGenerator JSON parse error: #{e.message}"
      default_response
    end

    private

    def validate_params!(params)
      description = params[:description].to_s

      if description.length > MAX_DESCRIPTION_LENGTH
        raise ArgumentError, "Description exceeds maximum length of #{MAX_DESCRIPTION_LENGTH} characters"
      end

      if description.length < 10
        raise ArgumentError, 'Description must be at least 10 characters'
      end
    end

    def build_prompt(params)
      cr = params[:challenge_rating] || '1'
      monster_type = params[:monster_type] || 'humanoid'
      size = params[:size] || 'medium'
      ac = params[:armor_class] || 10
      hp = params[:hit_points] || 10
      archetype = params[:archetype] || 'any'
      saves = Array(params[:saving_throws]).join(', ')
      skills = Array(params[:skills]).join(', ')
      description = sanitize_description(params[:description])
      number_of_attacks = (params[:number_of_attacks] || 1).to_i
      monster_name = params[:monster_name].presence || 'the creature'

      is_caster = %w[cleric spellcaster].include?(archetype.to_s.downcase)
      needs_multiattack = number_of_attacks > 1

      multiattack_instruction = if needs_multiattack
                                  <<~MULTI
                                    - IMPORTANT: This creature can make #{number_of_attacks} attacks per turn using Multiattack.
                                    - You MUST include a "Multiattack" action as the FIRST action in the list.
                                    - The Multiattack description format: "#{monster_name.capitalize} makes #{number_of_attacks} attacks: [specify which attacks, e.g., 'two with its claws and one with its bite']."
                                    - Then include 2-3 individual attack actions (like Bite, Claw, Tail, etc.) that Multiattack references.
                                    - Each individual attack action represents ONE attack, not multiple. Do NOT say "makes two claw attacks" in an action - just describe ONE attack.
                                    - Standard D&D format for an attack: "Melee Weapon Attack: +X to hit, reach X ft., one target. Hit: X (XdX + X) damage type damage."
                                  MULTI
                                else
                                  '- Include 2-4 actions (attacks, special actions)'
                                end

      system_prompt = <<~PROMPT
        You are a D&D 5e creature stat block generator. Generate appropriate actions and abilities for the creature described below. Return ONLY valid JSON with no additional text or markdown.

        Creature Stats:
        - Challenge Rating: #{cr}
        - Type: #{size} #{monster_type}
        - Armor Class: #{ac}
        - Hit Points: #{hp}
        - Archetype: #{archetype}
        - Number of Attacks: #{number_of_attacks}
        #{saves.present? ? "- Saving Throw Proficiencies: #{saves}" : ''}
        #{skills.present? ? "- Skill Proficiencies: #{skills}" : ''}

        User Description: "#{description}"

        Requirements:
        - Actions should be appropriate for CR #{cr} (attack bonus around +#{proficiency_for_cr(cr) + 2}, damage appropriate for CR)
        #{multiattack_instruction}
        - Include 1-3 special abilities if thematically appropriate
        #{is_caster ? "- Include 4-8 spells appropriate for a CR #{cr} #{archetype}" : '- Do NOT include spells unless the description specifically mentions magic'}
        - Keep descriptions concise but evocative

        Return this exact JSON structure:
        {
          "actions": [
            {"name": "Action Name", "desc": "Description with attack bonus and damage if applicable", "attack_bonus": 5, "damage": "1d8+3 slashing"}
          ],
          "special_abilities": [
            {"name": "Ability Name", "desc": "Description of the ability"}
          ],
          "spells": ["Spell Name 1", "Spell Name 2"]
        }

        Respond with ONLY the JSON, no other text.
      PROMPT

      system_prompt
    end

    def sanitize_description(description)
      return '' if description.blank?

      # Remove potential prompt injection attempts
      description.to_s
                 .gsub(/```[\s\S]*?```/, '') # Remove code blocks
                 .gsub(/^(system|assistant|user):/i, '') # Remove role prefixes
                 .gsub(/ignore (all |previous )?instructions/i, '') # Remove common injection phrases
                 .strip
                 .truncate(MAX_DESCRIPTION_LENGTH)
    end

    def proficiency_for_cr(cr)
      CrCalc.proficiency_for_cr(cr.to_s)
    end

    def parse_response(response)
      return default_response if response.blank?

      # Try to extract JSON from the response
      json_match = response.match(/\{[\s\S]*\}/m)
      return default_response unless json_match

      parsed = JSON.parse(json_match[0], symbolize_names: true)

      # Ensure expected structure
      {
        actions: Array(parsed[:actions]).map { |a| normalize_action(a) },
        special_abilities: Array(parsed[:special_abilities]).map { |a| normalize_action(a) },
        spells: Array(parsed[:spells]).map(&:to_s)
      }
    end

    def normalize_action(action)
      {
        name: action[:name].to_s,
        desc: action[:desc].to_s,
        attack_bonus: action[:attack_bonus]&.to_i,
        damage: action[:damage].to_s
      }.compact
    end

    def default_response
      {
        actions: [
          { name: 'Attack', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8 + 2) slashing damage.' }
        ],
        special_abilities: [],
        spells: []
      }
    end
  end
end

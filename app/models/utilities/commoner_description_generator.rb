# frozen_string_literal: true

# Generates descriptions for commoner NPCs using OpenAI
class CommonerDescriptionGenerator
  MAX_OUTPUT_TOKENS = 200

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

      { description: response.to_s.strip }
    rescue OpenAIClient::Error => e
      Rails.logger.error "CommonerDescriptionGenerator OpenAI error: #{e.message}"
      { error: "AI service error: #{e.message.truncate(100)}. Please try again." }
    end

    private

    def validate_params!(params)
      raise ArgumentError, 'Name is required' if params[:name].blank?
    end

    def build_prompt(params)
      name = params[:name]
      race = params[:race].presence || 'human'
      gender = params[:gender].presence || 'unknown'
      role = params[:role].presence || 'commoner'

      <<~PROMPT
        Generate a brief, evocative description (2-3 sentences) for a D&D commoner NPC:
        - Name: #{name}
        - Race: #{race}
        - Gender: #{gender}
        - Role/Occupation: #{role}

        Describe their appearance, demeanor, and one distinguishing characteristic that makes them memorable.
        Return ONLY the description text, no labels, formatting, or quotes.
      PROMPT
    end
  end
end

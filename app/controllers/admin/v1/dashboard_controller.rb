# frozen_string_literal: true

require 'utilities/openai/client'
require 'dotenv/load'

module Admin
  module V1
    class DashboardController < SecuredController
      before_action :set_user
      skip_before_action :authorize_request, only: %i[index random_fantasy_name random_tavern_name random_monster_name adventure_hook]

      # GET /index
      def index
        authorize :dashboard, :index?
        @dms = User.where(role: :dungeon_master)
      end

      def update_from_srd
        authorize :dashboard, :update_from_srd
      end

      def random_fantasy_name
        gender = params[:random_monster_gender]
        gender = %w[male female].sample if gender.nil? || gender.strip.empty?

        race   = params[:random_monster_race]
        race   = 'human' if race.nil? || race.strip.empty?

        new_name = NameGen.random_name(gender: gender, race: race)

        render json: { name: new_name }
      end

      def random_tavern_name
        render json: { name: NameGen.random_tavern_name }
      end

      def random_monster_name
        render json: { name: NameGen.random_monster_name }
      end

      def adventure_hook
        openai = OpenAI::Client.new(api_key: ENV.fetch('OPENAI_API_KEY', nil))

        player_count   = params[:player_count].to_i
        average_level  = params[:average_level].to_i

        prompt = <<~PROMPT.strip
          Create a compelling adventure hook for a Dungeons & Dragons 2024 campaign.

          - The party consists of #{player_count} players, average level #{average_level}.
          - Use themes appropriate for D&D 2024: ancient ruins, magical phenomena, political intrigue, etc.
          - Limit the response to 1 to 3 short paragraphs.
          - Make it useful for a Dungeon Master to launch an adventure arc.
          - Do not include gibberish or filler. End the response cleanly.
          - Output only the adventure hook. No titles or bullet points.
        PROMPT

        hook = openai.completions(
          prompt: prompt,
          model: 'gpt-4o',
          temperature: 1.0,
          top_p: 0.95,
          presence_penalty: 0.5,
          frequency_penalty: 0.3,
          max_tokens: 300
        )

        render json: { adventure_hook: hook }
      end

      private

      def set_user
        curr_user = AuthorizationService.new(request.headers).get_current_user
        @user = curr_user
      end
    end
  end
end

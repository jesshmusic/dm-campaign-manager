# frozen_string_literal: true

module Admin::V1
  class CharactersController < ApplicationController

    def random_fantasy_name
      random_npc_gender = params[:random_npc_gender] || %w[male female].sample
      random_npc_race = params[:random_npc_race] || 'human'
      render json: {name: NameGen.random_name(random_npc_gender, random_npc_race)}
    end

    def generate_npc
      render json: {npc: NpcGenerator.generate_npc(params)}
    end

    def generate_commoner
      random_npc_gender = params[:random_npc_gender] || %w[male female].sample
      random_npc_race = params[:random_npc_race] || 'human'
      render json: {npc: NpcGenerator.generate_commoner(random_npc_gender, random_npc_race)}
    end

  end
end

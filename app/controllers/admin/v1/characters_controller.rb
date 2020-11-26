# frozen_string_literal: true

module Admin::V1
  class CharactersController < ApplicationController

    def random_fantasy_name
      random_npc_gender = params[:random_npc_gender] || %w[male female].sample
      render json: {name: NameGen.random_name(random_npc_gender)}
    end

  end
end

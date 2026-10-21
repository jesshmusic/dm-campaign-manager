# frozen_string_literal: true

module Admin
  module V1
    module Foundry
      # A DM Guru monster as a dnd5e actor, for Dorman Lakely's Campaign
      # Planner to import into a Foundry world: the DM's own homebrew, or the
      # public SRD monsters. Someone else's homebrew is not found.
      class MonstersController < BaseController
        rescue_from ActiveRecord::RecordNotFound do
          render json: { errors: ['Monster not found'] }, status: :not_found
        end

        # GET /v1/foundry/monsters/:id
        # { id, name, actor }, actor being the data for Actor.create (see Monster#foundry_actor)
        def show
          monster = Monster.where(user_id: [nil, @user.id])
                           .includes(:monster_actions, :special_abilities, :reactions, :legendary_actions, :senses, :speeds)
                           .find(params[:id])
          render json: { id: monster.id.to_s, name: monster.name, actor: monster.foundry_actor }
        end
      end
    end
  end
end

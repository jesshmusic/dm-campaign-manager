# frozen_string_literal: true

module Admin::V1
  class SearchController < ApplicationController
    before_action :set_user
    def index
      @results = {
        count: 0,
        results: []
      }

      if params[:search]
        @results[:results] = Condition.search_for(params[:search])
                                     .pluck(:name, :description, :slug)
                                     .map {|name, description, slug| {
                                       name: name,
                                       description: description,
                                       url: "/app/conditions/#{slug}"
                                     }}
        @results[:results] += DndClass.search_for(params[:search])
                                    .pluck(:name, :slug)
                                    .map {|name, slug| {
                                      name: name,
                                      description: '',
                                      url: "/app/classes/#{slug}"
                                    }}
        @results[:results] += Item.search_for(params[:search])
                           .pluck(:name, :desc, :slug)
                           .map {|name, desc, slug| {
                             name: name,
                             description: desc.first,
                             url: "/app/items/#{slug}"
                           }}
        @results[:results] += Monster.search_for(params[:search])
                                 .pluck(:name, :challenge_rating, :slug)
                                 .map {|name, challenge_rating, slug| {
                                   name: name,
                                   description: "CR: #{challenge_rating}",
                                   url: "/app/monsters/#{slug}"
                                 }}
        @results[:results] += Race.search_for(params[:search])
                                 .pluck(:name, :size_description, :slug)
                                 .map {|name, size_description, slug| {
                                   name: name,
                                   description: size_description,
                                   url: "/app/races/#{slug}"
                                 }}
        @results[:results] += Rule.search_for(params[:search])
                                     .pluck(:name, :description, :slug)
                                     .map {|name, description, slug| {
                                       name: name,
                                       description: description,
                                       url: "/app/rules/#{slug}"
                                     }}
        @results[:results] += Skill.search_for(params[:search])
                                            .pluck(:name, :desc, :slug)
                                            .map {|name, desc, slug| {
                                              name: name,
                                              description: desc,
                                              url: "/app/skills/#{slug}"
                                            }}
        @results[:results] += Spell.search_for(params[:search])
                             .pluck(:name, :description, :slug)
                             .map {|name, description, slug| {
                               name: name,
                               description: description,
                               url: "/app/spells/#{slug}"
                             }}
        @results[:count] = @results[:results].count
      end

      render json: @results
    end

    private

    def set_user
      curr_user = AuthorizationService.new(request.headers).get_current_user
      @user = curr_user
    end
  end
end

# frozen_string_literal: true

# JSON CRUD for a campaign's child records. Including controllers define
# `resource_scope` (e.g. @campaign.npcs) and `resource_params`.
module CampaignChildResource
  extend ActiveSupport::Concern

  included do
    before_action :set_resource, only: %i[show update destroy]
  end

  def index
    render json: resource_scope.map(&:as_json_for_api)
  end

  def show
    render json: @resource.as_json_for_api
  end

  def create
    resource = resource_scope.new(resource_params)
    if resource.save
      render json: resource.as_json_for_api, status: :created
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotUnique
    # e.g. two sessions created at once both taking the next number
    render json: { errors: ['That conflicts with a change made at the same time. Please try again.'] }, status: :conflict
  end

  def update
    if @resource.update(resource_params)
      render json: @resource.as_json_for_api
    else
      render json: { errors: @resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @resource.destroy!
    head :no_content
  end

  private

  def set_resource
    @resource = resource_scope.find(params[:id])
  end
end

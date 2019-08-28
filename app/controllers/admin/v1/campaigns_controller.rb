# frozen_string_literal: true

module Admin::V1
  class CampaignsController < ApplicationController
    before_action :set_campaign, only: %i[show edit update destroy]
    before_action :authenticate_user!, except: %i[index show]

    # GET /campaigns
    # GET /campaigns.json
    def index
      @campaigns = Campaign.all
      authorize Campaign
      @current_user = current_user
      @campaigns = @campaigns.search_for(params[:search]) if params[:search].present?
      respond_to do |format|
        format.html { @pagy, @campaigns = pagy(@campaigns) }
        format.json
      end
    end

    # GET /campaigns/1
    # GET /campaigns/1.json
    def show
      authorize @campaign
      if params[:search].present?
        @pagy, @adventures = pagy(Adventure.where(campaign_id: @campaign.id).search_for(params[:search]))
      else
        @pagy, @adventures = pagy(Adventure.where(campaign_id: @campaign.id))
      end
    end

    # GET /campaigns/new
    def new
      @campaign = Campaign.new
      authorize @campaign
      @campaign.user = current_user
    end

    # GET /campaigns/1/edit
    def edit
      authorize @campaign
    end

    # POST /campaigns
    # POST /campaigns.json
    def create
      @campaign = Campaign.new(campaign_params)
      authorize @campaign
      @campaign.user = current_user

      respond_to do |format|
        if @campaign.save
          format.html { redirect_to v1_campaign_url(slug: @campaign.slug), notice: 'Campaign was successfully created.' }
          format.json { render :show, status: :created, location: @campaign }
        else
          format.html { render :new }
          format.json { render json: @campaign.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /campaigns/1
    # PATCH/PUT /campaigns/1.json
    def update
      authorize @campaign
      respond_to do |format|
        if @campaign.update(campaign_params)
          format.html { redirect_to v1_campaign_url(slug: @campaign.slug), notice: 'Campaign was successfully updated.' }
          format.json { render :show, status: :ok, location: @campaign }
        else
          format.html { render :edit }
          format.json { render json: @campaign.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /campaigns/1
    # DELETE /campaigns/1.json
    def destroy
      authorize @campaign
      @campaign.destroy
      respond_to do |format|
        format.html { redirect_to v1_campaigns_url, notice: 'Campaign was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_campaign
      @campaign = Campaign.find_by(slug: params[:slug])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def campaign_params
      params.require(:campaign).permit(
        :name, :description, :world,
        character_ids: [],
        adventures_attributes: [
          :id,
          :name,
          :description,
          :_destroy,
          character_ids: [],
          adventure_world_location_attributes: %i[id _destroy world_location_id],
          encounters_attributes: [
            :id,
            :copper_pieces,
            :description,
            :electrum_pieces,
            :gold_pieces,
            :name,
            :platinum_pieces,
            :silver_pieces,
            :xp,
            :_destroy,
            encounter_monsters_attributes: %i[id number_of_monsters monster_id _destroy],
            equipment_items_attributes: [
              :id, :quantity, :_destroy, item_ids: []
            ]
          ]
        ],
        world_locations_attributes: %i[id name description _destroy],
        world_events_attributes: %i[id when name description _destroy]
      )
    end
  end
end

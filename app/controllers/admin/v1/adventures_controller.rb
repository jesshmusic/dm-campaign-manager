# frozen_string_literal: true

module Admin::V1
  class AdventuresController < ApplicationController
    before_action :set_adventure, only: %i[show edit update destroy]
    before_action :set_campaign

    # GET /campaigns/campaign_slug/adventures
    # GET /campaigns/campaign_slug/adventures.json
    def index
      authorize Adventure
      @adventures = if params[:search].present?
                      Adventure.where(campaign_id: @campaign.id).search_for(params[:search])
                    else
                      Adventure.where(campaign_id: @campaign.id)
                    end
      respond_to do |format|
        format.html { @pagy, @adventures = pagy(@adventures) }
        format.json
      end
    end

    # GET /campaigns/campaign_slug/adventures/1
    # GET /campaigns/campaign_slug/adventures/1.json
    def show
      authorize @adventure
      if params[:search].present?
        @pagy, @encounters = pagy(Encounter.where(adventure_id: @adventure.id).search_for(params[:search]))
      else
        @pagy, @encounters = pagy(Encounter.where(adventure_id: @adventure.id).order('location ASC'))
      end
    end

    # GET /campaigns/campaign_slug/adventures/new
    def new
      @adventure = Adventure.new
      @adventure.campaign = @campaign
      authorize @adventure
    end

    # GET /campaigns/campaign_slug/adventures/1/edit
    def edit
      authorize @adventure
    end

    # POST /campaigns/campaign_slug/adventures
    # POST /campaigns/campaign_slug/adventures.json
    def create
      @adventure = Adventure.new(adventure_params)
      @adventure.campaign = @campaign
      authorize @adventure

      respond_to do |format|
        if @adventure.save
          format.html { redirect_to v1_campaign_adventure_url(@campaign, @adventure), notice: 'Adventure was successfully created.' }
          format.json { render :show, status: :created, location: @adventure }
        else
          format.html { render :new }
          format.json { render json: @adventure.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /campaigns/campaign_slug/adventures/1
    # PATCH/PUT /campaigns/campaign_slug/adventures/1.json
    def update
      authorize @adventure
      respond_to do |format|
        if @adventure.update(adventure_params)
          format.html { redirect_to v1_campaign_adventure_url(@campaign, @adventure), notice: 'Adventure was successfully updated.' }
          format.json { render :show, status: :ok, location: @adventure }
        else
          format.html { render :edit }
          format.json { render json: @adventure.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /campaigns/campaign_slug/adventures/1
    # DELETE /campaigns/campaign_slug/adventures/1.json
    def destroy
      authorize @adventure
      @adventure.destroy
      respond_to do |format|
        format.html { redirect_to campaign_adventures_url(@campaign), notice: 'Adventure was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_campaign
      @campaign = Campaign.find_by(slug: params[:campaign_slug])
    end

    def set_adventure
      @adventure = Adventure.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def adventure_params
      params.require(:adventure).permit(
        :name, :description, :campaign_id,
        character_ids: [], monster_ids: [], item_ids: [],
        adventure_world_location_attributes: %i[id _destroy world_location_id],
        encounters_attributes: [
          :id,
          :copper_pieces,
          :description,
          :electrum_pieces,
          :gold_pieces,
          :location,
          :name,
          :platinum_pieces,
          :silver_pieces,
          :xp,
          :_destroy,
          encounter_monsters_attributes: %i[id number_of_monsters monster_id _destroy]
        ]
      )
    end
  end
end

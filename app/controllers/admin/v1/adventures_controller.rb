# frozen_string_literal: true

module Admin::V1
  class AdventuresController < ApplicationController
    before_action :set_adventure, only: %i[show edit update destroy]
    before_action :set_campaign

    # GET /campaigns/campaign_slug/adventures
    # GET /campaigns/campaign_slug/adventures.json
    def index
      authorize @campaign, :show?
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
      authorize @campaign
      authorize @adventure
    end

    # GET /campaigns/campaign_slug/adventures/new
    def new
      authorize @campaign, :show?
      @adventure = Adventure.new
      @adventure.campaign = @campaign
      authorize @adventure
    end

    # GET /campaigns/campaign_slug/adventures/1/edit
    def edit
      authorize @campaign
      authorize @adventure
    end

    # POST /campaigns/campaign_slug/adventures
    # POST /campaigns/campaign_slug/adventures.json
    def create
      authorize @campaign, :show?
      @adventure = Adventure.new(adventure_params)
      @adventure.campaign = @campaign
      authorize @adventure

      respond_to do |format|
        if @adventure.save
          format.html { redirect_to v1_campaign_adventure_url(@campaign, @adventure), notice: 'Adventure was successfully created.' }
          format.json { render :show, status: :created }
        else
          format.html { render :new }
          format.json { render json: @adventure.errors.full_messages.join(', '), status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /campaigns/campaign_slug/adventures/1
    # PATCH/PUT /campaigns/campaign_slug/adventures/1.json
    def update
      authorize @campaign, :show?
      authorize @adventure
      respond_to do |format|
        if @adventure.update(adventure_params)
          format.html { redirect_to v1_campaign_adventure_url(@campaign, @adventure), notice: 'Adventure was successfully updated.' }
          format.json { render :show, status: :ok }
        else
          format.html { render :edit }
          format.json { render json: @adventure.errors.full_messages.join(', '), status: :unprocessable_entity }
        end
      end
    end

    # DELETE /campaigns/campaign_slug/adventures/1
    # DELETE /campaigns/campaign_slug/adventures/1.json
    def destroy
      authorize @campaign, :show?
      authorize @adventure
      @adventure.destroy
      respond_to do |format|
        format.html { redirect_to v1_campaign_adventures_url(@campaign), notice: 'Adventure was successfully destroyed.' }
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
        :id,
        :name,
        :description,
        :_destroy,
        character_ids: [],
        adventure_world_location_attributes: [
          :id,
          :world_location_id,
          world_location_attributes: %i[name description map_x map_y campaign_id]
        ],
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
          :sort,
          :xp,
          :_destroy,
          encounter_monsters_attributes: %i[id number_of_monsters monster_id _destroy],
          encounter_items_attributes: %i[id quantity item_id _destroy]
        ]
      )
    end
  end
end

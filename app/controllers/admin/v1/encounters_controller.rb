# frozen_string_literal: true

module Admin::V1
  class EncountersController < ApplicationController
    before_action :set_encounter, only: %i[show edit update destroy]
    before_action :set_campaign_and_adventure, except: [:random_individual_treasure]

    # GET /encounters/1
    # GET /encounters/1.json
    def show
      authorize @campaign, :show?
      authorize @encounter
    end

    # GET /campaigns/campaign_slug/adventures/1/encounters/new
    def new
      authorize @campaign, :show?
      @encounter = Encounter.new
      @encounter.adventure = @adventure
      authorize @encounter
    end

    # GET /encounters/1/edit
    def edit
      authorize @campaign, :show?
      authorize @encounter
    end

    # POST /campaigns/campaign_slug/adventures/encounters
    # POST /campaigns/campaign_slug/adventures/encounters.json
    def create
      authorize @campaign, :show?
      @encounter = Encounter.new(encounter_params)
      @encounter.adventure = @adventure
      authorize @encounter

      respond_to do |format|
        if @encounter.save
          format.html { redirect_to v1_campaign_adventure_encounter_url(@campaign, @adventure, @encounter), notice: 'Encounter was successfully created.' }
          format.json { render :show, status: :created }
        else
          format.html { render :new }
          format.json { render json: @encounter.errors.full_messages.join(', '), status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /campaigns/campaign_slug/adventures/1/encounters/1
    # PATCH/PUT /campaigns/campaign_slug/adventures/1/encounters/1.json
    def update
      authorize @campaign, :show?
      authorize @encounter
      respond_to do |format|
        if @encounter.update(encounter_params)
          unless params[:encounter_tracker]
            reset_encounter
            @encounter.save!
          end
          format.html { redirect_to v1_campaign_adventure_encounter_url(@campaign, @adventure, @encounter), notice: 'Encounter was successfully updated.' }
          format.json { render :show, status: :ok }
        else
          format.html { render :edit }
          format.json { render json: @encounter.errors.full_messages.join(', '), status: :unprocessable_entity }
        end
      end
    end

    # DELETE /campaigns/campaign_slug/adventures/1/encounters/1
    # DELETE /campaigns/campaign_slug/adventures/1/encounters/1.json
    def destroy
      authorize @campaign, :show?
      authorize @encounter
      @encounter.destroy
      respond_to do |format|
        format.html { redirect_to v1_campaign_adventures_url(@campaign), notice: 'Adventure was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    def random_individual_treasure
      authorize Encounter
      challenge_rating = params[:xp] ? DndRules.challenge_rating_for_xp(params[:xp]) : DndRules.challenge_rating_for_xp(600)
      render json: TreasureUtility.create_individual_treasure(challenge_rating)
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_campaign_and_adventure
      @campaign = Campaign.find_by(slug: params[:campaign_slug])
      @adventure = Adventure.find(params[:adventure_id])
    end

    def set_encounter
      @encounter = Encounter.find(params[:id])
    end

    def reset_encounter
      @encounter.update_encounter
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def encounter_params
      params.require(:encounter).permit(
        :id,
        :copper_pieces,
        :current_mob_index,
        :description,
        :electrum_pieces,
        :gold_pieces,
        :in_progress,
        :location,
        :name,
        :platinum_pieces,
        :round,
        :silver_pieces,
        :sort,
        :xp,
        :_destroy,
        character_ids: [],
        encounter_monsters_attributes: %i[id number_of_monsters monster_id _destroy],
        encounter_items_attributes: %i[id quantity item_id _destroy],
        encounter_combatants_attributes: %i[id combat_order_number current_hit_points initiative_roll notes character_id monster_id]
      )
    end
  end
end

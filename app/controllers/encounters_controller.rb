class EncountersController < ApplicationController
  before_action :set_encounter, only: %i[show edit update]

  # GET /encounters/1
  # GET /encounters/1.json
  def show
    authorize @encounter
  end

  # GET /encounters/1/edit
  def edit
    authorize @encounter
  end

  # PATCH/PUT /encounters/1
  # PATCH/PUT /encounters/1.json
  def update
    respond_to do |format|
      if @encounter.update(encounter_params)
        format.html { redirect_to @encounter, notice: 'Encounter was successfully updated.' }
        format.json { render :show, status: :ok, location: @encounter }
      else
        format.html { render :edit }
        format.json { render json: @encounter.errors, status: :unprocessable_entity }
      end
    end
  end

  def random_individual_treasure
    challenge_rating = params[:xp] ? DndRules.challenge_raiting_for_xp(params[:xp]) : DndRules.challenge_raiting_for_xp(params[600])
    render json: TreasureUtility.create_individual_treasure(challenge_rating)
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_encounter
    @encounter = Encounter.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def encounter_params
    params.fetch(:encounter, {})
  end
end

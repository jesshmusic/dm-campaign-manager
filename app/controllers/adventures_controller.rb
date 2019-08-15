# frozen_string_literal: true

class AdventuresController < ApplicationController
  before_action :set_adventure, only: %i[show edit update destroy]

  # GET /adventures/1
  # GET /adventures/1.json
  def show
  end

  # GET /adventures/1/edit
  def edit
  end

  # PATCH/PUT /adventures/1
  # PATCH/PUT /adventures/1.json
  def update
    authorize @adventure
    respond_to do |format|
      if @adventure.update(adventure_params)
        format.html { redirect_to @adventure, notice: 'Adventure was successfully updated.' }
        format.json { render :show, status: :ok, location: @adventure }
      else
        format.html { render :edit }
        format.json { render json: @adventure.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /adventures/1
  # DELETE /adventures/1.json
  def destroy
    authorize @adventure
    @adventure.destroy
    respond_to do |format|
      format.html { redirect_to adventures_url, notice: 'Adventure was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_adventure
    @adventure = Adventure.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def adventure_params
    params.require(:adventure).permit(
        :name, :description, :campaign_id,
        player_character_ids: [], non_player_character_ids: [],
        monster_ids: [], item_ids: []
    )
  end
end

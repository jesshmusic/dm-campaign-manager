# frozen_string_literal: true

module Admin::V1
  class SpellsController < ApplicationController
    before_action :set_spell, only: %i[show edit update destroy]
    before_action :authenticate_user!, except: %i[index show]

    # GET /spells
    # GET /spells.json
    def index
      authorize Spell
      @spells = if params[:search].present?
                  Spell.search_for(params[:search])
                else
                  Spell.all
                end
      @spells = if !current_user
                  @spells.where(user_id: nil)
                elsif current_user.admin?
                  @spells
                else
                  @spells.where(user_id: nil).or(@items.where(user_id: current_user.id))
                end
      respond_to do |format|
        format.html { @pagy, @spells = pagy(@spells) }
        format.json do
          render json: @spells.as_json(methods: :spell_classes)
        end
      end
    end

    # GET /spells/1
    # GET /spells/1.json
    def show
      authorize @spell
      respond_to do |format|
        format.html { @spell }
        format.json { render json: @spell.as_json(methods: :spell_classes) }
      end
    end

    # GET /spells/new
    def new
      @spell = Spell.new
      authorize @spell
    end

    # GET /spells/1/edit
    def edit
      authorize @spell
    end

    # POST /spells
    # POST /spells.json
    def create
      @spell = Spell.new(spell_params)
      authorize @spell
      @spell.user = current_user if current_user.dungeon_master?

      respond_to do |format|
        if @spell.save
          format.html { redirect_to spell_url(slug: @spell.slug), notice: 'Spell was successfully created.' }
          format.json { render :show, status: :created, location: @spell }
        else
          format.html { render :new }
          format.json { render json: @spell.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /spells/1
    # PATCH/PUT /spells/1.json
    def update
      authorize @spell

      respond_to do |format|
        if @spell.update(spell_params)
          format.html { redirect_to spell_url(slug: @spell.slug), notice: 'Spell was successfully updated.' }
          format.json { render :show, status: :ok, location: @spell }
        else
          format.html { render :edit }
          format.json { render json: @spell.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /spells/1
    # DELETE /spells/1.json
    def destroy
      authorize @spell
      @spell.destroy

      respond_to do |format|
        format.html { redirect_to spells_url, notice: 'Spell was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_spell
      @spell = Spell.find_by(slug: params[:slug])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def spell_params
      params.require(:spell).permit(:name, :description, :higher_level, :page, :range, :material, :ritual, :duration, :concentration, :casting_time, :level, components: [], dnd_class_ids: [])
    end
  end
end

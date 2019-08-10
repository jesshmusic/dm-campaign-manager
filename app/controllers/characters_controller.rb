# frozen_string_literal: true

class CharactersController < ApplicationController
  before_action :set_character, only: %i[show edit update destroy]
  before_action :authenticate_user!, except: %i[index show]

  # GET /characters
  # GET /characters.json
  def index
    @characters = if params[:search].present?
                    Character.search_for(params[:search])
                  else
                    Character.all
                  end

    if !current_user
      @pagy, @characters = pagy(@characters.where(user_id: nil))
    elsif current_user.admin?
      @pagy, @characters = pagy(@characters)
    else
      @pagy, @characters = pagy(@characters.where(user_id: current_user.id).order('name ASC'))
    end
  end

  # GET /characters/1
  # GET /characters/1.json
  def show; end

  # GET /characters/new
  def new
    @character = Character.new
    authorize @character
    @character.user = current_user
  end

  # GET /characters/1/edit
  def edit; end

  # POST /characters
  # POST /characters.json
  def create
    @character = Character.new(character_params)
    authorize @character
    pc_slug = @character.name.parameterize.truncate(80, omission: '')
    pc_slug = "#{current_user.username}_#{pc_slug}"
    @character.slug = Character.exists?(slug: pc_slug) ? "#{pc_slug}_#{@character.id}" : pc_slug
    @character.user = current_user

    respond_to do |format|
      if @character.save
        campaign_character = CampaignCharacter.new
        campaign_character.campaign = Campaign.find(character_params[:campaign_id])
        campaign_character.character = @character
        campaign_character.save
        format.html { redirect_to @character, notice: ' character was successfully created.' }
        format.json { render :show, status: :created, location: @character }
      else
        format.html { render :new }
        format.json { render json: @character.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /characters/1
  # PATCH/PUT /characters/1.json
  def update
    authorize @character
    respond_to do |format|
      if @character.update(character_params)
        campaign_character = CampaignCharacter.find_or_create_by(character_id: @character.id)
        campaign_character.campaign = Campaign.find(character_params[:campaign_id])
        campaign_character.character = @character
        campaign_character.save
        format.html { redirect_to @character, notice: ' character was successfully updated.' }
        format.json { render :show, status: :ok, location: @character }
      else
        format.html { render :edit }
        format.json { render json: @character.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /characters/1
  # DELETE /characters/1.json
  def destroy
    authorize @character
    @character.destroy
    respond_to do |format|
      format.html { redirect_to characters_url, notice: ' character was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  # POST /characters/create_random_npc
  def create_random_npc
    @character = Character.new
    authorize @character
    @character.user = current_user
    @character.dnd_classes << DndClass.find_by(name: character_params[:dnd_class_name])
    @character.level = character_params[:level]
    @character.character_type = 'npc'
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_character
    @character = Character.find_by(slug: params[:slug])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def character_params
    params.require(:character).permit(
      :name, :description, :alignment, :armor_class, :campaign_id, :character_type,
      :charisma, :constitution, :copper_pieces, :dexterity, :dnd_class_name,
      :electrum_pieces, :gold_pieces, :hit_points, :hit_points_current, :initiative,
      :intelligence, :languages, :level, :platinum_pieces, :proficiency,
      :race, :role, :silver_pieces, :speed, :spell_ability, :spell_attack_bonus,
      :spell_save_dc, :strength, :wisdom, :xp,
      dnd_class_ids: [], spell_ids: [], magic_item_ids: [],
      equipment_items_attributes: [
        :id, :quantity, :_destroy, item_ids: []
      ],
      skills_attributes: %i[
        id name score _destroy
      ]
    )
  end

  def generate_bard_npc; end
end

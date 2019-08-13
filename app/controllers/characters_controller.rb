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

  def pc_index
    @characters = if params[:search].present?
                    PlayerCharacter.search_for(params[:search])
                  else
                    PlayerCharacter.all
                  end

    if !current_user
      @pagy, @characters = pagy(@characters.where(user_id: nil))
    elsif current_user.admin?
      @pagy, @characters = pagy(@characters)
    else
      @pagy, @characters = pagy(@characters.where(user_id: current_user.id).order('name ASC'))
    end
  end

  def npc_index
    @characters = if params[:search].present?
                    NonPlayerCharacter.search_for(params[:search])
                  else
                    NonPlayerCharacter.all
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
    @character = if params[:type] && params[:type] == 'PlayerCharacter'
                   PlayerCharacter.new
                 elsif params[:type] && params[:type] == 'NonPlayerCharacter'
                   NonPlayerCharacter.new
                 else
                   Character.new
                 end
    authorize @character
    @character.role = ''
    @character.build_stat_block
  end

  # GET /characters/new/generate_npc
  def generate_npc
    @character = NonPlayerCharacter.new
    authorize @character
    @character.role = ''
  end

  # GET /characters/1/edit
  def edit; end

  # POST /characters
  # POST /characters.json
  def create
    @character = if params[:type] && params[:type] == 'PlayerCharacter'
                   PlayerCharacter.new(character_params)
                 elsif params[:type] && params[:type] == 'NonPlayerCharacter'
                   NonPlayerCharacter.new(character_params)
                 else
                   Character.new(character_params)
                 end
    authorize @character
    @character.user = current_user

    respond_to do |format|
      if @character.save
        format.html { redirect_to @character, notice: ' character was successfully created.' }
        format.json { render :show, status: :created, location: @character }
      else
        format.html { render :new }
        format.json { render json: @character.errors, status: :unprocessable_entity }
      end
    end
  end

  # POST /characters/generate_npc
  def create_generated_npc
    @character = NpcGenerator.generate_npc(
      character_params[:name], DndClass.find(character_params[:dnd_class_ids].first), character_params[:race],
      character_params[:alignment], character_params[:level], character_params[:role],
      current_user, character_params[:campaign_ids], character_params[:min_score]
    )
    authorize @character
    respond_to do |format|
      if @character.save
        format.html { redirect_to @character, notice: 'NPC was successfully created.' }
        format.json { render :show, status: :created, location: @character }
      else
        format.html { render :new }
        format.json { render json: @character.errors, status: :unprocessable_entity }
      end
    end
  end

  def random_fantasy_name
    random_npc_gender = params[:random_npc_gender] || %w[male female].sample
    render json: { name: NameGen.random_name(random_npc_gender) }
  end

  # PATCH/PUT /characters/1
  # PATCH/PUT /characters/1.json
  def update
    authorize @character
    respond_to do |format|
      if @character.update(character_params)
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

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_character
    @character = Character.find_by(slug: params[:slug])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def character_params
    params.require(@character.type.underscore.to_sym).permit(
      :name, :description, :alignment, :type,
      :copper_pieces, :dexterity, :dnd_class_name, :electrum_pieces, :gold_pieces,
      :languages, :level, :platinum_pieces, :race, :role, :silver_pieces, :spell_ability,
      :spell_attack_bonus, :spell_save_dc, :user_id, :xp, :min_score,
      campaign_ids: [], dnd_class_ids: [], spell_ids: [], magic_item_ids: [],
      stat_block_attributes: %i[
        id armor_class charisma constitution dexterity hit_dice_modifier hit_dice_number hit_dice_value hit_points hit_points_current initiative intelligence proficiency speed strength wisdom
      ],
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

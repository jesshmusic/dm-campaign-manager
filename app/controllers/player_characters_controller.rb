class PlayerCharactersController < ApplicationController
  before_action :set_player_character, only: %i[show edit update destroy]
  before_action :authenticate_user!, except: %i[index show]

  # GET /player_characters
  # GET /player_characters.json
  def index
    @player_characters = PlayerCharacter.all
    if params[:search].present?
      @pagy, @player_characters = pagy(PlayerCharacter.search_for(params[:search]))
    else
      @pagy, @player_characters = pagy(PlayerCharacter.all)
    end
  end

  # GET /player_characters/1
  # GET /player_characters/1.json
  def show
  end

  # GET /player_characters/new
  def new
    @player_character = PlayerCharacter.new
    authorize @player_character
    @player_character.user = current_user
  end

  # GET /player_characters/1/edit
  def edit
  end

  # POST /player_characters
  # POST /player_characters.json
  def create
    @player_character = PlayerCharacter.new(player_character_params)
    authorize @player_character
    pc_slug = @player_character.name.parameterize.truncate(80, omission: '')
    pc_slug = "#{current_user.username}_#{pc_slug}"
    @player_character.slug = PlayerCharacter.exists?(slug: pc_slug) ? "#{pc_slug}_#{@player_character.id}" : pc_slug

    @player_character.user = current_user

    respond_to do |format|
      if @player_character.save
        format.html { redirect_to @player_character, notice: 'Player character was successfully created.' }
        format.json { render :show, status: :created, location: @player_character }
      else
        format.html { render :new }
        format.json { render json: @player_character.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /player_characters/1
  # PATCH/PUT /player_characters/1.json
  def update
    authorize @player_character
    respond_to do |format|
      if @player_character.update(player_character_params)
        format.html { redirect_to @player_character, notice: 'Player character was successfully updated.' }
        format.json { render :show, status: :ok, location: @player_character }
      else
        format.html { render :edit }
        format.json { render json: @player_character.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /player_characters/1
  # DELETE /player_characters/1.json
  def destroy
    authorize @player_character
    @player_character.destroy
    respond_to do |format|
      format.html { redirect_to player_characters_url, notice: 'Player character was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_player_character
      @player_character = PlayerCharacter.find_by(slug: params[:slug])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def player_character_params
      params.require(:player_character).permit(
        :name,
        :description,
        character_stat_attributes: [
          :id, :alignment, :armor_class,
          :charisma, :constitution, :copper_pieces,
          :dexterity, :gold_pieces, :hit_points,
          :hit_points_current, :initiative, :intelligence,
          :languages, :level, :platinum_pieces,
          :proficiency, :race, :silver_pieces,
          :speed, :spell_ability, :spell_attack_bonus,
          :spell_save_dc, :strength, :wisdom, :xp
        ],
        equipment_items_attributes: [
          :id,
          :quantity,
          :_destroy,
          item_ids: []
        ]
      )
    end
end

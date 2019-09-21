# frozen_string_literal: true

module Admin::V1
  class CharactersController < ApplicationController
    before_action :set_character, only: %i[show edit update destroy]
    before_action :authenticate_user!, except: %i[index show]
    before_action :set_campaign

    # GET /characters
    # GET /characters.json
    def index
      authorize Character
      @characters = if params[:search].present?
                      Character.search_for(params[:search])
                    else
                      Character.all
                    end
      @characters = params[:type].present? ? @characters.where(type: params[:type]) : @characters
      @characters = params[:user_id].present? ? @characters.where(user_id: params[:user_id]) : @characters
      respond_to do |format|
        format.html { @pagy, @characters = pagy(@characters) }
        format.json
      end
    end

    # GET /characters/1
    # GET /characters/1.json
    def show
      authorize @character
    end

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
      @character.character_classes.build
    end

    # GET /characters/new/generate_npc
    def generate_npc
      @character = NonPlayerCharacter.new
      authorize @character
      @character.role = ''
    end

    # GET /characters/1/edit
    def edit
      authorize @character
    end

    # POST /characters
    # POST /characters.json
    def create
      @character = if params[:player_character]
                     PlayerCharacter.new(character_params('PlayerCharacter'))
                   elsif params[:non_player_character]
                     NonPlayerCharacter.new(character_params('NonPlayerCharacter'))
                   else
                     Character.new(character_params('Character'))
                   end
      authorize @campaign
      authorize @character
      @character.campaign = @campaign

      respond_to do |format|
        if @character.save
          redirect_path = if @character.type == 'NonPlayerCharacter'
                            v1_campaign_non_player_character_path(@campaign, @character)
                          elsif @character.type == 'PlayerCharacter'
                            v1_campaign_player_character_path(@campaign, @character)
                          else
                            v1_campaign_character_path(@campaign, @character)
                          end
          format.html { redirect_to redirect_path, notice: ' character was successfully created.' }
          format.json { render :show, status: :created }
        else
          puts @character.errors.to_json
          format.html { render :new }
          format.json { render json: {errors: @character.errors.full_messages.join(', ')}, status: :unprocessable_entity }
        end
      end
    end

    # POST /characters/generate_npc
    def create_generated_npc
      @character = NpcGenerator.generate_npc(
        name: character_params('NonPlayerCharacter')[:name],
        race_id: character_params('NonPlayerCharacter')[:race_id],
        role: character_params('NonPlayerCharacter')[:role],
        alignment: character_params('NonPlayerCharacter')[:alignment],
        min_score: character_params('NonPlayerCharacter')[:min_score],
        campaign_id: @campaign.id,
        character_classes_attributes: character_params('NonPlayerCharacter')[:character_classes_attributes]
      )
      authorize @campaign
      authorize @character
      respond_to do |format|
        if @character.save
          redirect_path = if @character.type == 'NonPlayerCharacter'
                            v1_campaign_non_player_character_path(@campaign, @character)
                          elsif @character.type == 'PlayerCharacter'
                            v1_campaign_player_character_path(@campaign, @character)
                          else
                            v1_campaign_character_path(@campaign, @character)
                          end
          format.html { redirect_to redirect_path, notice: 'NPC was successfully created.' }
          format.json { render :show, status: :created }
        else
          format.html { render :new }
          format.json { render json: @character.errors.full_messages.join(', '), status: :unprocessable_entity }
        end
      end
    end

    def random_fantasy_name
      authorize Character
      random_npc_gender = params[:random_npc_gender] || %w[male female].sample
      render json: {name: NameGen.random_name(random_npc_gender)}
    end

    # PATCH/PUT /characters/1
    # PATCH/PUT /characters/1.json
    def update
      authorize @campaign
      authorize @character
      respond_to do |format|
        if @character.update(character_params(params[:type]))
          redirect_path = if @character.type == 'NonPlayerCharacter'
                            v1_campaign_non_player_character_path(@campaign, @character)
                          elsif @character.type == 'PlayerCharacter'
                            v1_campaign_player_character_path(@campaign, @character)
                          else
                            v1_campaign_character_path(@campaign, @character)
                          end
          format.html { redirect_to redirect_path, notice: ' character was successfully updated.' }
          format.json { render :show, status: :ok }
        else
          format.html { render :edit }
          format.json { render json: @character.errors.full_messages.join(', '), status: :unprocessable_entity }
        end
      end
    end

    # DELETE /characters/1
    # DELETE /characters/1.json
    def destroy
      authorize @campaign
      authorize @character
      @character.destroy
      respond_to do |format|
        format.html { redirect_to v1_campaign_url(@campaign), notice: ' character was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_character
      @character = Character.find_by(slug: params[:slug])
    end

    def set_campaign
      @campaign = Campaign.find_by(slug: params[:campaign_slug])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def character_params(type)
      params.require(type.underscore.to_sym).permit(
        :id, :name, :description, :alignment, :type, :background,
        :copper_pieces, :dexterity, :dnd_class_name, :electrum_pieces, :gold_pieces,
        :languages, :level, :platinum_pieces, :race, :role, :silver_pieces, :spell_ability,
        :spell_attack_bonus, :spell_save_dc, :xp, :min_score, :armor_class_modifier,
        :armor_class, :charisma, :constitution, :dexterity, :hit_points, :hit_points_current,
        :initiative, :intelligence, :proficiency, :speed, :strength, :wisdom, :race_id,
        :armor_id, :shield_id, :weapon_2h_id, :weapon_lh_id, :weapon_rh_id,
        spell_ids: [],
        character_spells_attributes: %i[id is_prepared spell_class spell_id],
        character_items_attributes: %i[id quantity carrying equipped item_id _destroy],
        character_classes_attributes: %i[
          id level proficiency_bonus spell_attack_bonus spell_save_dc dnd_class_id _destroy
        ],
        skills_attributes: %i[
          id name score _destroy
        ]
      )
    end
  end
end

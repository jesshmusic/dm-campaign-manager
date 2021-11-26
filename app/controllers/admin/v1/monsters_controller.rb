# frozen_string_literal: true

module Admin::V1
  class MonstersController < SecuredController
    before_action :set_user
    before_action :set_monster, only: %i[show edit update destroy]
    skip_before_action :authorize_request, only: %i[index show monster_refs monster_categories quick_monster generate_monster convert_2e_npc generate_commoner calculate_cr info_for_cr generate_action_desc]

    # GET /v1/monsters
    # GET /v1/monsters.json
    def index
      authorize Monster
      @monsters = if params[:search].present?
                    Monster.search_for(params[:search]).order(monster_type: :asc, name: :asc)
                  else
                    Monster.all.order(monster_type: :asc, name: :asc)
                  end
      @monsters = if !@user
                    @monsters.where(user_id: nil)
                  elsif @user.admin? && !params[:refs].present?
                    @monsters
                  else
                    @monsters.where(user_id: nil).or(@monsters.where(user_id: @user.id))
                  end
      @monsters = @monsters.where(challenge_rating: params[:challenge_rating]) if params[:challenge_rating].present?
      @monsters = @monsters.where(user_id: params[:user_id]) if params[:user_id]

      respond_to do |format|
        format.html { @pagy, @monsters = pagy(@monsters) }
        format.json
      end
    end

    # GET /v1/monster-categories
    def monster_categories
      authorize Monster
      monster_types = Monster.pluck(:monster_type).uniq
      monster_cats = []
      if params[:search].present?
        monster_types.each do |monster_type|
          monster_results = {
            name: monster_type.capitalize,
            monsters: Monster.search_for(params[:search]).where(monster_type: monster_type).map { |monster| {
              name: monster.name,
              challenge: monster.challenge_string,
              alignment: monster.alignment,
              hitPoints: monster.hit_points_string,
              slug: monster.slug
            } }
          }
          monster_cats << monster_results unless monster_results[:monsters].count < 1
        end
      else
        monster_types.each do |monster_type|
          monster_cats << {
            name: monster_type.capitalize,
            monsters: Monster.where(monster_type: monster_type).map { |monster| {
              name: monster.name,
              challenge: monster.challenge_string,
              alignment: monster.alignment,
              hitPoints: monster.hit_points_string,
              slug: monster.slug
            } }
          }
        end
      end

      render json: { count: monster_cats.count, results: monster_cats.sort_by { |e| e[:name] } }
    end

    # GET /v1/monsters/:slug
    # GET /v1/monsters/:slug.json
    def show
      authorize @monster
      respond_to do |format|
        format.html { @monster }
        format.json
      end
    end

    # POST /monsters
    # POST /monsters.json
    def create
      @monster = Monster.new(monster_params)
      authorize @monster
      @monster.user = @user if @user.dungeon_master?

      respond_to do |format|
        if @monster.save
          format.html { redirect_to v1_monster_url(slug: @monster.slug), notice: 'Monster was successfully created.' }
          format.json { render :show, status: :created }
        else
          format.html { render :new }
          format.json { render json: @monster.errors.full_messages.join(', '), status: :unprocessable_entity }
        end
      end
    end

    def generate_monster
      @monster = NpcGenerator.generate_npc(monster_params, @user)
      respond_to do |format|
        format.json
      end
    end

    def quick_monster
      @monster = NpcGenerator.quick_monster(monster_params, @user)
      respond_to do |format|
        format.json
      end
    end

    def generate_action_desc
      render json: { desc: NpcGenerator.generate_action_desc(params) }
    end

    def info_for_cr
      cr_info = CrCalc.challenge_ratings[params[:challenge_rating].to_sym].as_json
      render json: { challenge: cr_info }
    end

    def calculate_cr
      render json: { challenge: CrCalc.calculate_cr(params) }
    end

    def convert_2e_npc
      @monster = NpcGenerator.convert_2e_npc(params)
      render :show, status: :ok
    end

    def generate_commoner
      random_npc_gender = params[:random_monster_gender] || %w[male female].sample
      random_npc_race = params[:random_monster_race] || 'human'
      @monster = NpcGenerator.generate_commoner(random_npc_gender, random_npc_race, @user)
      respond_to do |format|
        format.json
      end
    end

    # PATCH/PUT /monsters/:slug
    # PATCH/PUT /monsters/:slug.json
    def update
      authorize @monster

      respond_to do |format|
        if @monster.update(monster_params)
          format.html { redirect_to v1_monster_url(slug: @monster.slug), notice: 'Monster was successfully updated.' }
          format.json { render :show, status: :ok }
        else
          format.html { render :edit }
          format.json { render json: @monster.errors.full_messages.join(', '), status: :unprocessable_entity }
        end
      end
    end

    # DELETE /monsters/:slug
    # DELETE /monsters/:slug.json
    def destroy
      authorize @monster
      @monster.destroy

      respond_to do |format|
        format.html { redirect_to v1_monsters_url, notice: 'Monster was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private

    def set_user
      curr_user = AuthorizationService.new(request.headers).get_current_user
      @user = curr_user
    end

    # Use callbacks to share common setup or constraints between api.
    def set_monster
      puts params
      @monster = Monster.friendly.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def monster_params
      params.require(:monster).permit(
        :alignment, :api_url, :armor_class, :attack_bonus,
        :challenge_rating, :charisma, :constitution,
        :dexterity, :hit_dice, :hit_points, :intelligence,
        :languages, :monster_subtype, :monster_type,
        :name, :prof_bonus, :save_dc, :size,
        :strength, :wisdom, :xp,
        :number_of_attacks, :archetype,
        damage_immunities: [],
        damage_vulnerabilities: [],
        damage_resistances: [],
        condition_immunities: [],
        monster_proficiencies_attributes: %i[id prof_id value _destroy],
        senses_attributes: %i[
          name value _destroy
        ],
        speeds_attributes: %i[
          name value _destroy
        ],
        monster_actions_attributes: %i[
          desc name _destroy
        ],
        legendary_actions_attributes: %i[
          desc name _destroy
        ],
        special_abilities_attributes: %i[
          desc name _destroy
        ],
        reactions_attributes: %i[
          desc name _destroy
        ]
      )
    end
  end
end

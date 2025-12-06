# frozen_string_literal: true

module Admin
  module V1
    class MonstersController < SecuredController
      CR_AI_RATE_LIMIT_SECONDS = 5

      before_action :set_user
      before_action :set_monster, only: %i[show edit update destroy]
      skip_before_action :authorize_request,
                         only: %i[index show monster_refs monster_categories actions_by_name quick_monster generate_commoner calculate_cr info_for_cr
                                  generate_action_desc special_abilities generate_npc_actions generate_npc_concept create_from_concept]

      # GET /v1/monsters
      # GET /v1/monsters.json
      def index
        authorize Monster
        @monsters = if params[:search].present?
                      Monster.search_for(params[:search]).order(monster_type: :asc, name: :asc)
                    else
                      Monster.order(monster_type: :asc, name: :asc)
                    end
        @monsters = if !@user
                      @monsters.where(user_id: nil)
                    elsif @user.admin? && params[:refs].blank?
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
        monster_types = Monster.distinct.pluck(:monster_type)
        monster_cats = []
        if params[:search].present?
          monster_types.each do |monster_type|
            monster_results = {
              name: monster_type.capitalize,
              monsters: Monster.search_for(params[:search]).where(monster_type: monster_type).map do |monster|
                {
                  name: monster.name,
                  challenge: monster.challenge_string,
                  alignment: monster.alignment,
                  hitPoints: monster.hit_points_string,
                  slug: monster.slug
                }
              end
            }
            monster_cats << monster_results unless monster_results[:monsters].count < 1
          end
        else
          monster_types.each do |monster_type|
            monster_cats << {
              name: monster_type.capitalize,
              monsters: Monster.where(monster_type: monster_type).map do |monster|
                {
                  name: monster.name,
                  challenge: monster.challenge_string,
                  alignment: monster.alignment,
                  hitPoints: monster.hit_points_string,
                  slug: monster.slug
                }
              end
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

      def generate_commoner
        random_npc_gender = params[:random_monster_gender] || %w[male female].sample
        random_npc_race = params[:random_monster_race] || 'human'
        role = params[:role].presence
        @monster = NpcGenerator.generate_commoner(random_npc_gender, random_npc_race, @user, role)
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

      def actions_by_name
        action_name = params[:action_name]
        actions = Action.where('lower(name) like ?', "%#{action_name.downcase}%").map do |monster_action|
          damage_dice = monster_action.desc[/([1-9]\d*)?d([1-9]\d*)/m]
          info_text = "(#{monster_action.type.titlecase}): #{monster_action.desc.truncate(75)}"
          if monster_action.name == 'Multiattack'
            info_text = "(#{monster_action.type.titlecase}): #{monster_action.desc.truncate(75)}"
          elsif damage_dice && damage_dice != ''
            info_text = "(#{monster_action.type.titlecase}): #{damage_dice}"
          end
          {
            id: monster_action.id,
            name: monster_action.name,
            info: info_text,
            monster_name: monster_action.monster ? monster_action.monster.name : '',
            description: monster_action.desc
          }
        end
        render json: { actions: actions }
      end

      def generate_action_desc
        render json: { desc: NpcGenerator.generate_action_desc(params) }
      end

      def info_for_cr
        cr_sym = params[:challenge_rating].to_sym
        cr_info = CrCalc.challenge_ratings[cr_sym].as_json
        render json: { challenge: cr_info }
      end

      def calculate_cr
        @monster = Monster.new(monster_params)
        use_ai = params[:use_ai] != 'false' # Default to true unless explicitly disabled

        # Rate limit AI-enhanced CR calculations
        if use_ai && cr_ai_rate_limited?
          # Return base CR without AI if rate limited
          result = CrCalc.calculate_base_cr(@monster)
          result[:rate_limited] = true
          result[:retry_after] = cr_ai_retry_after
          render json: { challenge: result }
          return
        end

        # Track last AI call time
        session[:last_cr_ai_call] = Time.current.to_i if use_ai

        render json: { challenge: CrCalc.calculate_challenge(@monster, use_ai: use_ai) }
      end

      def special_abilities
        @special_abilities = if params[:search].present?
                               SpecialAbility.search_for(params[:search]).order(name: :asc).map(&:name).uniq
                             else
                               SpecialAbility.all.map(&:name).uniq
                             end
        render json: { special_abilities: @special_abilities }
      end

      # POST /v1/generate_npc_actions
      # Generate actions, special abilities, and spells using AI
      def generate_npc_actions
        result = NpcActionGenerator.generate(npc_action_params)
        render json: result
      rescue ArgumentError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # POST /v1/generate_npc_concept
      # Generate a complete NPC concept using AI from minimal input
      def generate_npc_concept
        result = NpcConceptGenerator.generate(npc_concept_params)
        if result[:error]
          render json: { error: result[:error] }, status: :unprocessable_entity
        else
          token_usage = result.delete(:token_usage)
          render json: { concept: result, token_usage: token_usage }
        end
      rescue ArgumentError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # POST /v1/create_from_concept
      # Create a monster from an approved AI-generated concept
      def create_from_concept
        @monster = Monster.new(monster_from_concept_params)
        @monster.user = @user if @user&.dungeon_master? || @user&.admin?

        # Validate required fields
        if @monster.name.blank?
          render json: { error: 'Name is required' }, status: :unprocessable_entity
          return
        end

        # Build nested associations from concept data
        build_monster_from_concept(@monster, params)

        if @user && @monster.save
          render :show, status: :created
        elsif @user.nil?
          # Return unsaved monster for non-logged-in users
          render :show, status: :ok
        else
          render json: { error: @monster.errors.full_messages.join(', ') }, status: :unprocessable_entity
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
        Rails.logger.debug params
        @monster = Monster.friendly.find(params[:id])
      end

      def npc_action_params
        params.permit(:description, :challenge_rating, :monster_type, :size,
                      :armor_class, :hit_points, :archetype, :token,
                      :number_of_attacks, :monster_name,
                      saving_throws: [], skills: [])
      end

      def npc_concept_params
        params.permit(:description, :challenge_rating, :monster_type, :alignment)
      end

      def monster_from_concept_params
        # armor_description, saving_throws, skills are intentionally excluded
        # - armor_description: not a Monster attribute (display only)
        # - saving_throws/skills: handled separately via build_proficiencies_from_concept
        params.require(:concept).permit(
          :name, :size, :monster_type, :alignment,
          :armor_class, :hit_points, :hit_dice,
          :challenge_rating, :xp, :prof_bonus,
          :strength, :dexterity, :constitution, :intelligence, :wisdom, :charisma,
          :languages,
          damage_resistances: [], damage_immunities: [],
          damage_vulnerabilities: [], condition_immunities: []
        )
      end

      def build_monster_from_concept(monster, params)
        concept = params[:concept]
        return unless concept

        # Build speeds
        build_nested_from_params(concept[:speeds]) do |speed|
          monster.speeds.build(name: speed['name'] || speed[:name], value: speed['value'] || speed[:value])
        end

        # Build senses
        build_nested_from_params(concept[:senses]) do |sense|
          monster.senses.build(name: sense['name'] || sense[:name], value: sense['value'] || sense[:value])
        end

        # Build actions
        build_nested_from_params(concept[:actions]) do |action|
          monster.monster_actions.build(name: action['name'] || action[:name], desc: action['desc'] || action[:desc])
        end

        # Build special abilities
        build_nested_from_params(concept[:special_abilities]) do |ability|
          monster.special_abilities.build(name: ability['name'] || ability[:name], desc: ability['desc'] || ability[:desc])
        end

        # Build reactions
        build_nested_from_params(concept[:reactions]) do |reaction|
          monster.reactions.build(name: reaction['name'] || reaction[:name], desc: reaction['desc'] || reaction[:desc])
        end

        # Build legendary actions
        build_nested_from_params(concept[:legendary_actions]) do |action|
          monster.legendary_actions.build(name: action['name'] || action[:name], desc: action['desc'] || action[:desc])
        end

        # Build proficiencies for saving throws and skills
        build_proficiencies_from_concept(monster, concept)
      end

      def build_nested_from_params(params_array)
        return if params_array.blank?

        # Convert to array if needed and iterate
        items = if params_array.is_a?(ActionController::Parameters)
                  params_array.to_h.values
                elsif params_array.is_a?(Hash)
                  params_array.values
                else
                  Array(params_array)
                end

        items.each do |item|
          next unless item.is_a?(Hash) || item.is_a?(ActionController::Parameters)

          yield item
        end
      end

      def build_proficiencies_from_concept(monster, concept)
        # Map saving throws to proficiencies
        saving_throws = concept[:saving_throws] || concept['saving_throws']
        extract_array_values(saving_throws).each do |save_name|
          prof = Prof.find_by('lower(name) = ?', "saving throw: #{save_name.to_s.downcase}")
          next unless prof

          ability_mod = begin
            monster.send(save_name.to_s.downcase.to_sym)
          rescue StandardError
            10
          end
          value = DndRules.ability_score_modifier(ability_mod) + monster.prof_bonus.to_i
          monster.monster_proficiencies.build(prof_id: prof.id, value: value)
        end

        # Map skills to proficiencies
        skills = concept[:skills] || concept['skills']
        extract_array_values(skills).each do |skill_name|
          prof = Prof.find_by('lower(name) = ?', "skill: #{skill_name.to_s.downcase}")
          next unless prof

          monster.monster_proficiencies.build(prof_id: prof.id, value: monster.prof_bonus.to_i)
        end
      end

      def extract_array_values(params_value)
        return [] unless params_value

        if params_value.respond_to?(:values)
          params_value.values
        else
          Array(params_value)
        end
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def monster_params
        params.require(:monster).permit(
          :alignment, :api_url, :armor_class, :attack_bonus,
          :challenge_rating, :charisma, :constitution,
          :creature_description,
          :dexterity, :hit_dice, :hit_points, :intelligence,
          :languages, :monster_subtype, :monster_type,
          :name, :prof_bonus, :save_dc, :size,
          :strength, :wisdom, :xp,
          :number_of_attacks, :archetype,
          damage_immunities: [],
          damage_vulnerabilities: [],
          damage_resistances: [],
          condition_immunities: [],
          special_ability_options: [],
          action_options: [],
          spell_ids: [],
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

      # Rate limiting helpers for AI CR calculations
      def cr_ai_rate_limited?
        last_call = session[:last_cr_ai_call]
        return false unless last_call

        Time.current.to_i - last_call < CR_AI_RATE_LIMIT_SECONDS
      end

      def cr_ai_retry_after
        last_call = session[:last_cr_ai_call]
        return 0 unless last_call

        remaining = CR_AI_RATE_LIMIT_SECONDS - (Time.current.to_i - last_call)
        [remaining, 0].max
      end
    end
  end
end

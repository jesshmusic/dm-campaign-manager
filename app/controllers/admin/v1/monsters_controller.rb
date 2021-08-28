# frozen_string_literal: true

module Admin::V1
  class MonstersController < ApplicationController
    before_action :set_monster, only: %i[show edit update destroy]
    before_action :authenticate_user!, except: %i[index show monster_refs monster_categories]

    # GET /monsters
    # GET /monsters.json
    def index
      authorize Monster
      @monsters = if params[:refs].present?
                    @monsters = Monster.all.order(name: :asc).map { |monster|
                      {
                        name: monster.name,
                        slug: monster.slug
                      }
                    }
                    render json: {count: @monsters.count, results: @monsters}
                  elsif params[:search].present?
                    Monster.search_for(params[:search]).order(monster_type: :asc, name: :asc)
                  else
                    Monster.all.order(monster_type: :asc, name: :asc)
                  end
      unless params[:refs].present?
        @monsters = if !current_user
                      @monsters.where(user_id: nil)
                    elsif current_user.admin? && !params[:refs].present?
                      @monsters
                    else
                      @monsters.where(user_id: nil).or(@monsters.where(user_id: current_user.id))
                    end
        @monsters = @monsters.where(challenge_rating: params[:challenge_rating]) if params[:challenge_rating].present?
      end
      respond_to do |format|
        format.html { @pagy, @monsters = pagy(@monsters) }
        format.json
      end
    end

    def monster_refs
      authorize Monster
      @monsters = Monster.all.order(name: :asc).map { |monster|
        {
          name: monster.name,
          slug: monster.slug
        }
      }
      render json: {count: @monsters.count, results: @monsters}
    end

    def monster_categories
      authorize Monster
      monster_types = Monster.pluck(:monster_type).uniq
      monster_cats = []
      monster_types.each do |monster_type|
        monster_cats << {
          name: monster_type.capitalize,
          monsters: Monster.where(monster_type: monster_type).map { |monster|
            {
              name: monster.name,
              slug: monster.slug
            }
          }
        }
      end
      render json: {count: monster_cats.count, results: monster_cats.sort_by{|e| e[:name]}}
    end

    # GET /monsters/1
    # GET /monsters/1.json
    def show
      authorize @monster
      respond_to do |format|
        format.html { @monster }
        format.json
      end
    end

    # GET /monsters/new
    def new
      @monster = Monster.new
      authorize @monster
    end

    # GET /monsters/1/edit
    def edit
      authorize @monster
    end

    # POST /monsters
    # POST /monsters.json
    def create
      @monster = Monster.new(monster_params)
      authorize @monster
      @monster.user = current_user if current_user.dungeon_master?

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

    # PATCH/PUT /monsters/1
    # PATCH/PUT /monsters/1.json
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

    # DELETE /monsters/1
    # DELETE /monsters/1.json
    def destroy
      authorize @monster
      @monster.destroy

      respond_to do |format|
        format.html { redirect_to v1_monsters_url, notice: 'Monster was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_monster
      @monster = Monster.find_by(slug: params[:slug])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def monster_params
      params.require(:monster).permit(
        :name, :size, :monster_type, :monster_subtype,
        :alignment, :damage_vulnerabilities,
        :damage_resistances, :damage_immunities, :condition_immunities,
        :languages, :challenge_rating, :api_url,
        :armor_class, :charisma, :constitution, :dexterity, :hit_dice,
        :hit_points, :intelligence, :strength, :wisdom,
        :legendary_description,
        condition_ids: [],
        monster_proficiencies_attributes: %i[id prof_id value _destroy],
        senses: %i[
          blindsight darkvision passive_perception tremorsense truesight
        ],
        speed: %i[
          burrow climb fly hover swim walk
        ],
        actions_attributes: %i[
          name description attack_bonus damage_bonus damage_dice
        ],
        legendary_action_attributes: %i[
          name description attack_bonus damage_bonus damage_dice
        ],
        special_abilities_attributes: %i[
          name description attack_bonus damage_bonus damage_dice
        ],
        reactions_attributes: %i[
          name description attack_bonus damage_bonus damage_dice
        ]
      )
    end
  end
end

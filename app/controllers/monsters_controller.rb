# frozen_string_literal: true

class MonstersController < ApplicationController
  before_action :set_monster, only: %i[show edit update destroy]
  before_action :authenticate_user!, except: %i[index show]

  # GET /monsters
  # GET /monsters.json
  def index
    @monsters = if params[:search].present?
                  Monster.search_for(params[:search])
                else
                  Monster.all
                end

    if !current_user
      @pagy, @monsters = pagy(@monsters.where(user_id: nil))
    elsif current_user.admin?
      @pagy, @monsters = pagy(@monsters)
    else
      @pagy, @monsters = pagy(@monsters.where(user_id: nil).or(@monsters.where(user_id: current_user.id)).order('name ASC'))
    end
  end

  # GET /monsters/1
  # GET /monsters/1.json
  def show; end

  # GET /monsters/new
  def new
    @monster = Monster.new
    authorize @monster
  end

  # GET /monsters/1/edit
  def edit; end

  # POST /monsters
  # POST /monsters.json
  def create
    @monster = Monster.new(monster_params)
    authorize @monster
    @monster.user = current_user if current_user.dungeon_master?

    respond_to do |format|
      if @monster.save
        format.html { redirect_to monster_url(slug: @monster.slug), notice: 'Monster was successfully created.' }
        format.json { render :show, status: :created, location: @monster }
      else
        format.html { render :new }
        format.json { render json: @monster.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /monsters/1
  # PATCH/PUT /monsters/1.json
  def update
    authorize @monster

    respond_to do |format|
      if @monster.update(monster_params)
        format.html { redirect_to monster_url(slug: @monster.slug), notice: 'Monster was successfully updated.' }
        format.json { render :show, status: :ok, location: @monster }
      else
        format.html { render :edit }
        format.json { render json: @monster.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /monsters/1
  # DELETE /monsters/1.json
  def destroy
    authorize @monster
    @monster.destroy

    respond_to do |format|
      format.html { redirect_to monsters_url, notice: 'Monster was successfully destroyed.' }
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
      :alignment, :armor_class, :hit_points, :hit_dice,
      :speed, :strength, :dexterity, :constitution,
      :intelligence, :wisdom, :charisma, :damage_vulnerabilities,
      :damage_resistances, :damage_immunities, :condition_immunities,
      :senses, :languages, :challenge_rating, :api_url,
      monster_action_attributes: %i[
        id name description attack_bonus damage_bonus damage_dice _destroy
      ],
      monster_legendary_action_attributes: %i[
        id name description attack_bonus damage_bonus damage_dice _destroy
      ],
      monster_special_ability_attributes: %i[
        id name description attack_bonus damage_bonus damage_dice _destroy
      ],
      skills_attributes: %i[
        id name score _destroy
      ]
    )
  end
end

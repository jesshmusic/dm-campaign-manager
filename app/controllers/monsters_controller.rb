class MonstersController < ApplicationController
  before_action :set_monster, only: %i[show edit update destroy]
  before_action :authenticate_user!, except: %i[index show]

  # GET /monsters
  # GET /monsters.json
  def index
    if params[:search].present?
      @monsters = Monster.search_for(params[:search])
    else
      @monsters = Monster.all.order('name ASC')
    end
  end

  # GET /monsters/1
  # GET /monsters/1.json
  def show
  end

  # GET /monsters/new
  def new
    @monster = Monster.new
    authorize @monster
  end

  # GET /monsters/1/edit
  def edit
  end

  # POST /monsters
  # POST /monsters.json
  def create
    @monster = Monster.new(monster_params)
    authorize @monster

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
      params.require(:monster).permit(:name, :size, :monster_type, :monster_subtype, :alignment, :armor_class, :hit_points, :hit_dice, :speed, :strength, :dexterity, :constitution, :intelligence, :wisdom, :charisma, :damage_vulnerabilities, :damage_resistances, :damage_immunities, :condition_immunities, :senses, :languages, :challenge_rating, :api_url)
    end
end

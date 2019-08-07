class SpellsController < ApplicationController
  before_action :set_spell, only: %i[show edit update destroy]
  before_action :authenticate_user!, except: %i[index show]

  # GET /spells
  # GET /spells.json
  def index
    if params[:search].present?
      @pagy, @spells = pagy(Spell.search_for(params[:search]))
    else
      @pagy, @spells = pagy(Spell.where(user_id: nil).or(Spell.where(user_id: current_user.id)).order('name ASC'))
    end
  end

  # GET /spells/1
  # GET /spells/1.json
  def show
  end

  # GET /spells/new
  def new
    @spell = Spell.new
    authorize @spell
  end

  # GET /spells/1/edit
  def edit
  end

  # POST /spells
  # POST /spells.json
  def create
    @spell = Spell.new(spell_params)
    authorize @spell

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

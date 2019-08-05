class DndClassesController < ApplicationController
  before_action :set_dnd_class, only: %i[show edit update destroy]
  before_action :authenticate_user!, except: %i[index show]

  # GET /dnd_classes
  # GET /dnd_classes.json
  def index
    if params[:search].present?
      @dnd_classes = DndClass.search_for(params[:search])
    elsif current_user.admin?
      DndClass.all
    else
      @dnd_classes = DndClass.where(user_id: nil).or(DndClass.where(user_id: current_user.id))
    end
  end

  # GET /dnd_classes/1
  # GET /dnd_classes/1.json
  def show
  end

  # GET /dnd_classes/new
  def new
    @dnd_class = DndClass.new
    authorize @dnd_class
    @dnd_class.prof_choices.build
  end

  # GET /dnd_classes/1/edit
  def edit
    # if @dnd_class.prof_choices.count == 0
    #   @dnd_class.prof_choices.build
    # else
    #   puts @dnd_class.prof_choices.to_json
    # end
  end

  # POST /dnd_classes
  # POST /dnd_classes.json
  def create
    @dnd_class = DndClass.new(dnd_class_params)
    authorize @dnd_class
    dnd_class_slug = @dnd_class.name.parameterize.truncate(80, omission: '')
    dnd_class_slug = "#{current_user.username}_#{dnd_class_slug}" if current_user.dungeon_master?
    @dnd_class.slug = DndClass.exists?(slug: dnd_class_slug) ? "#{dnd_class_slug}_#{@dnd_class.id}" : dnd_class_slug
    
    respond_to do |format|
      if @current_user.dungeon_master? && @current_user.dnd_classes << @dnd_class
        format.html { redirect_to dnd_class_url(slug: @dnd_class.slug), notice: 'Dnd class was successfully created.' }
        format.json { render :show, status: :created, location: @dnd_class }
      elsif @dnd_class.save
        format.html { redirect_to dnd_class_url(slug: @dnd_class.slug), notice: 'Dnd class was successfully created.' }
        format.json { render :show, status: :created, location: @dnd_class }
      else
        format.html { render :new }
        format.json { render json: @dnd_class.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /dnd_classes/1
  # PATCH/PUT /dnd_classes/1.json
  def update
    authorize @dnd_class
    respond_to do |format|
      if @dnd_class.update(dnd_class_params)
        format.html { redirect_to dnd_class_url(slug: @dnd_class.slug), notice: 'Dnd class was successfully updated.' }
        format.json { render :show, status: :ok, location: @dnd_class }
      else
        format.html { render :edit }
        format.json { render json: @dnd_class.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /dnd_classes/1
  # DELETE /dnd_classes/1.json
  def destroy
    authorize @dnd_class
    @dnd_class.destroy
    respond_to do |format|
      format.html { redirect_to dnd_classes_url, notice: 'Dnd class was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_dnd_class
      @dnd_class = DndClass.find_by(slug: params[:slug])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def dnd_class_params
      params.require(:dnd_class).permit(
        :name,
        :hit_die,
        :api_url,
        prof_ids: [],
        spell_ids: [],
        prof_choices_attributes: [
          :id,
          :name,
          :num_choices,
          :prof_choice_type,
          :_destroy,
          prof_ids: []
        ]
      )
    end
end

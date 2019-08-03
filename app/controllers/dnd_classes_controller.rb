class DndClassesController < ApplicationController
  before_action :set_dnd_class, only: [:show, :edit, :update, :destroy]

  # GET /dnd_classes
  # GET /dnd_classes.json
  def index
    if params[:search].present?
      @dnd_classes = DndClass.search_for(params[:search])
    else
      @dnd_classes = DndClass.all
    end
  end

  # GET /dnd_classes/1
  # GET /dnd_classes/1.json
  def show
  end

  # GET /dnd_classes/new
  def new
    @dnd_class = DndClass.new
  end

  # GET /dnd_classes/1/edit
  def edit
  end

  # POST /dnd_classes
  # POST /dnd_classes.json
  def create
    @dnd_class = DndClass.new(dnd_class_params)

    respond_to do |format|
      if @dnd_class.save
        format.html { redirect_to @dnd_class, notice: 'Dnd class was successfully created.' }
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
    respond_to do |format|
      if @dnd_class.update(dnd_class_params)
        format.html { redirect_to @dnd_class, notice: 'Dnd class was successfully updated.' }
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
    @dnd_class.destroy
    respond_to do |format|
      format.html { redirect_to dnd_classes_url, notice: 'Dnd class was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_dnd_class
      @dnd_class = DndClass.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def dnd_class_params
      params.require(:dnd_class).permit(:name, :hit_die, :api_url, :proficiencies, :saving_throws, :proficiency_choices)
    end
end

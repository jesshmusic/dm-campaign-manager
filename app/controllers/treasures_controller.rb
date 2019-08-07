class TreasuresController < ApplicationController
  before_action :set_treasure, only: [:show, :edit, :update, :destroy]

  # GET /treasures
  # GET /treasures.json
  def index
    @treasures = Treasure.all
    if params[:search].present?
      @pagy, @treasures = pagy(Treasure.search_for(params[:search]))
    else
      @pagy, @treasures = pagy(Treasure.where(user_id: nil).or(Treasure.where(user_id: current_user.id)).order('name ASC'))
    end
  end

  # GET /treasures/1
  # GET /treasures/1.json
  def show
  end

  # GET /treasures/new
  def new
    @treasure = Treasure.new
    authorize @treasure
  end

  # GET /treasures/1/edit
  def edit
  end

  # POST /treasures
  # POST /treasures.json
  def create
    @treasure = Treasure.new(treasure_params)
    authorize @treasure

    respond_to do |format|
      if @treasure.save
        format.html { redirect_to @treasure, notice: 'Treasure was successfully created.' }
        format.json { render :show, status: :created, location: @treasure }
      else
        format.html { render :new }
        format.json { render json: @treasure.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /treasures/1
  # PATCH/PUT /treasures/1.json
  def update
    authorize @treasure

    respond_to do |format|
      if @treasure.update(treasure_params)
        format.html { redirect_to @treasure, notice: 'Treasure was successfully updated.' }
        format.json { render :show, status: :ok, location: @treasure }
      else
        format.html { render :edit }
        format.json { render json: @treasure.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /treasures/1
  # DELETE /treasures/1.json
  def destroy
    authorize @treasure
    @treasure.destroy

    respond_to do |format|
      format.html { redirect_to treasures_url, notice: 'Treasure was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_treasure
      @treasure = Treasure.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def treasure_params
      params.require(:treasure).permit(
        :name,
        :description,
        :copper_pieces,
        :silver_pieces,
        :gold_pieces,
        :platinum_pieces,
        :user_id,
        magic_item_ids: [],
        equipment_items_attributes: [
          :id,
          :quantity,
          :_destroy,
          item_ids: []
        ]
      )
    end
end

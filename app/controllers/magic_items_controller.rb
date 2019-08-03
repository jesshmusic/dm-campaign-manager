class MagicItemsController < ApplicationController
  before_action :set_magic_item, only: [:show, :edit, :update, :destroy]

  # GET /magic_items
  # GET /magic_items.json
  def index
    if params[:search].present?
      @magic_items = MagicItem.search_for(params[:search])
    else
      @magic_items = MagicItem.all.order('name ASC')
    end
  end

  # GET /magic_items/1
  # GET /magic_items/1.json
  def show
  end

  # GET /magic_items/new
  def new
    @magic_item = MagicItem.new
  end

  # GET /magic_items/1/edit
  def edit
  end

  # POST /magic_items
  # POST /magic_items.json
  def create
    @magic_item = MagicItem.new(magic_item_params)

    respond_to do |format|
      if @magic_item.save
        format.html { redirect_to @magic_item, notice: 'Magic item was successfully created.' }
        format.json { render :show, status: :created, location: @magic_item }
      else
        format.html { render :new }
        format.json { render json: @magic_item.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /magic_items/1
  # PATCH/PUT /magic_items/1.json
  def update
    respond_to do |format|
      if @magic_item.update(magic_item_params)
        format.html { redirect_to @magic_item, notice: 'Magic item was successfully updated.' }
        format.json { render :show, status: :ok, location: @magic_item }
      else
        format.html { render :edit }
        format.json { render json: @magic_item.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /magic_items/1
  # DELETE /magic_items/1.json
  def destroy
    @magic_item.destroy
    respond_to do |format|
      format.html { redirect_to magic_items_url, notice: 'Magic item was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_magic_item
      @magic_item = MagicItem.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def magic_item_params
      params.require(:magic_item).permit(:name, :magic_item_type, :description, :rarity, :requires_attunement)
    end
end

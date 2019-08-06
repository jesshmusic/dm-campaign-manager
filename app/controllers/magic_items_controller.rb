class MagicItemsController < ApplicationController
  before_action :set_magic_item, only: %i[show edit update destroy]
  before_action :authenticate_user!, except: %i[index show]

  # GET /magic_items
  # GET /magic_items.json
  def index
    if params[:search].present?
      @pagy, @magic_items = pagy(MagicItem.search_for(params[:search]))
    else
      @pagy, @magic_items = pagy(MagicItem.all.order('name ASC'))
    end
  end

  # GET /magic_items/1
  # GET /magic_items/1.json
  def show
  end

  # GET /magic_items/new
  def new
    @magic_item = MagicItem.new
    authorize @magic_item
  end

  # GET /magic_items/1/edit
  def edit
  end

  # POST /magic_items
  # POST /magic_items.json
  def create
    @magic_item = MagicItem.new(magic_item_params)
    authorize @magic_item

    respond_to do |format|
      if @magic_item.save
        format.html { redirect_to magic_item_url(slug: @magic_item.slug), notice: 'Magic item was successfully created.' }
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
    authorize @magic_item

    respond_to do |format|
      if @magic_item.update(magic_item_params)
        format.html { redirect_to magic_item_url(slug: @magic_item.slug), notice: 'Magic item was successfully updated.' }
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
    authorize @magic_item

    @magic_item.destroy
    respond_to do |format|
      format.html { redirect_to magic_items_url, notice: 'Magic item was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_magic_item
      @magic_item = MagicItem.find_by(slug: params[:slug])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def magic_item_params
      params.require(:magic_item).permit(:name, :magic_item_type, :description, :rarity, :requires_attunement)
    end
end

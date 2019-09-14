# frozen_string_literal: true

module Admin::V1
  class ItemsController < ApplicationController
    before_action :set_item, only: %i[show edit update destroy]
    before_action :authenticate_user!, except: %i[index show]

    # GET /items
    # GET /items.json
    def index
      authorize Item
      @items = if params[:search].present?
                 Item.search_for(params[:search])
               else
                 Item.all.order('name ASC')
               end
      @items = @items.where(type: params[:type]) if params[:type].present?
      @items = @items.where.not(sub_category: 'Shield') if params[:shield].present? && params[:shield] == 'false'
      @items = @items.where(sub_category: 'Shield') if params[:shield].present? && params[:shield] == 'true'
      @items = @items.where.not("'Two-Handed' = ANY (weapon_properties)") if params[:two_hand].present? && params[:two_hand] == 'false'
      if params[:two_hand].present? && params[:two_hand] == 'true'
        @items = @items.where("'Two-Handed' = ANY (weapon_properties)")
                       .or(@items.where.not(weapon_2h_damage_type: [nil, '']))
      end
      @items = if !current_user
                 @items.where(user_id: nil)
               elsif current_user.admin?
                 @items
               else
                 @items.where(user_id: nil).or(@items.where(user_id: current_user.id))
               end
      respond_to do |format|
        format.html { @pagy, @items = pagy(@items) }
        format.json
      end
    end

    # GET /items/1
    # GET /items/1.json
    def show
      authorize @item
    end

    # GET /items/new
    def new
      @item = Item.new
      authorize @item
    end

    # GET /items/1/edit
    def edit
      authorize @item
    end

    # POST /items
    # POST /items.json
    def create
      @item = Item.new(item_params)
      authorize @item
      @item.user = current_user if current_user.dungeon_master?

      respond_to do |format|
        if @item.save
          format.html { redirect_to item_url(slug: @item.slug), notice: 'Item was successfully created.' }
          format.json { render :show, status: :created, location: @item }
        else
          format.html { render :new }
          format.json { render json: @item.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /items/1
    # PATCH/PUT /items/1.json
    def update
      authorize @item
      respond_to do |format|
        if @item.update(item_params)
          format.html { redirect_to item_url(slug: @item.slug), notice: 'Item was successfully updated.' }
          format.json { render :show, status: :ok, location: @item }
        else
          format.html { render :edit }
          format.json { render json: @item.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /items/1
    # DELETE /items/1.json
    def destroy
      authorize @item
      @item.destroy
      respond_to do |format|
        format.html { redirect_to items_url, notice: 'Item was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_item
      @item = Item.find_by(slug: params[:slug])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def item_params
      params.require(:item).permit(:api_url, :armor_class, :armor_dex_bonus, :armor_max_bonus, :armor_stealth_disadvantage, :armor_str_minimum, :category, :category_range, :cost_unit, :cost_value, :description, :name, :sub_category, :vehicle_capacity, :vehicle_speed, :vehicle_speed_unit, :weapon_2h_damage_dice_count, :weapon_2h_damage_dice_value, :weapon_2h_damage_type, :weapon_damage_dice_count, :weapon_damage_dice_value, :weapon_damage_type, :weapon_properties, :weapon_range, :weapon_range_long, :weapon_range_normal, :weapon_thrown_range_long, :weapon_thrown_range_normal, :weight)
    end
  end
end

# frozen_string_literal: true

module Admin::V1
  class GuildsController < ApplicationController
    before_action :set_guild, only: %i[show edit update destroy]
    before_action :set_campaign
    before_action :authenticate_user!

    # GET /guilds
    # GET /guilds.json
    def index
      authorize @campaign, :show?
      authorize Guild
      @guilds = if params[:search].present?
                  Guild.search_for(params[:search])
                else
                  Guild.all
                end
      @guilds = @guilds.where(campaign_id: @campaign.id)
      respond_to do |format|
        format.html { @pagy, @characters = pagy(@guilds) }
        format.json
      end
    end

    # GET /guilds/1
    # GET /guilds/1.json
    def show
      authorize @campaign
      authorize @guild
    end

    # GET /guilds/new
    def new
      authorize @campaign, :show?
      @guild = Guild.new
      @guild.campaign = @campaign
    end

    # GET /guilds/1/edit
    def edit
      authorize @campaign, :show?
      authorize @guild
    end

    # POST /guilds
    # POST /guilds.json
    def create
      authorize @campaign, :show?
      @guild = Guild.new(guild_params)
      authorize @guild
      @guild.campaign = @campaign

      respond_to do |format|
        if @guild.save
          format.html { redirect_to v1_campaign_guild_path(@campaign, @guild), notice: 'Guild was successfully created.' }
          format.json { render :show, status: :created }
        else
          format.html { render :new }
          format.json { render json: @guild.errors.full_messages.join(', '), status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /guilds/1
    # PATCH/PUT /guilds/1.json
    def update
      authorize @campaign, :show?
      authorize @guild
      respond_to do |format|
        if @guild.update(guild_params)
          format.html { redirect_to v1_campaign_guild_path(@campaign, @guild), notice: 'Guild was successfully updated.' }
          format.json { render :show, status: :ok }
        else
          format.html { render :edit }
          format.json { render json: @guild.errors.full_messages.join(', '), status: :unprocessable_entity }
        end
      end
    end

    # DELETE /guilds/1
    # DELETE /guilds/1.json
    def destroy
      authorize @campaign, :show?
      authorize @guild
      @guild.destroy
      respond_to do |format|
        format.html { redirect_to v1_campaign_path(@campaign), notice: 'Guild was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private
    # Use callbacks to share common setup or constraints between actions.
    def set_guild
      @guild = Guild.find_by(slug: params[:slug])
    end

    def set_campaign
      @campaign = Campaign.find_by(slug: params[:campaign_slug])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def guild_params
      params.require(:guild).permit(:name, :description, :campaign_id, character_ids: [])
    end
  end
end

class CampaignsController < ApplicationController

  before_action :set_campaign, only: %i[show edit update destroy]
  before_action :authenticate_user!, except: %i[index show]

  # GET /campaigns
  # GET /campaigns.json
  def index
    if params[:search].present?
      @pagy, @campaigns = pagy(Campaign.search_for(params[:search]))
    else
      @pagy, @campaigns = pagy(Campaign.all)
    end
  end

  # GET /campaigns/1
  # GET /campaigns/1.json
  def show
  end

  # GET /campaigns/new
  def new
    @campaign = Campaign.new
    authorize @campaign
    @campaign.user = current_user
  end

  # GET /campaigns/1/edit
  def edit
  end

  # POST /campaigns
  # POST /campaigns.json
  def create
    @campaign = Campaign.new(campaign_params)
    authorize @campaign
    @campaign.user = current_user

    respond_to do |format|
      if @campaign.save
        format.html { redirect_to campaign_url(slug: @campaign.slug), notice: 'Campaign was successfully created.' }
        format.json { render :show, status: :created, location: @campaign }
      else
        format.html { render :new }
        format.json { render json: @campaign.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /campaigns/1
  # PATCH/PUT /campaigns/1.json
  def update
    authorize @campaign
    respond_to do |format|
      if @campaign.update(campaign_params)
        format.html { redirect_to campaign_url(slug: @campaign.slug), notice: 'Campaign was successfully updated.' }
        format.json { render :show, status: :ok, location: @campaign }
      else
        format.html { render :edit }
        format.json { render json: @campaign.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /campaigns/1
  # DELETE /campaigns/1.json
  def destroy
    authorize @campaign
    @campaign.destroy
    respond_to do |format|
      format.html { redirect_to campaigns_url, notice: 'Campaign was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_campaign
      @campaign = Campaign.find_by(slug: params[:slug])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def campaign_params
      params.require(:campaign).permit(:name, :description, :world)
    end
end

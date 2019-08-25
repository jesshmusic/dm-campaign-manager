# frozen_string_literal: true

module Admin::V1
  class CampaignsController < ApplicationController
    before_action :set_campaign, only: %i[show edit update destroy]
    before_action :authenticate_user!, except: %i[index show]

    # GET /campaigns
    # GET /campaigns.json
    def index
      @campaigns = Campaign.all
      authorize Campaign
      @player_campaigns = current_user ? current_user.player_campaigns : []
      @dm_campaigns = current_user&.dungeon_master? || current_user&.admin? ? Campaign.where(user: current_user) : []
      @campaigns = @campaigns.search_for(params[:search]) if params[:search].present?
      @campaigns -= @dm_campaigns
      @campaigns -= @player_campaigns
      respond_to do |format|
        format.html { @pagy, @campaigns = pagy(@campaigns) }
        format.json do
          render json: {
            campaigns: campaigns_small(@campaigns),
            player_campaigns: campaigns_small(@player_campaigns),
            dm_campaigns: campaigns(@dm_campaigns)
          }
        end
      end
    end

    # GET /campaigns/1
    # GET /campaigns/1.json
    def show
      authorize @campaign

      respond_to do |format|
        puts format
        format.html {
          if params[:search].present?
            @pagy, @adventures = pagy(Adventure.where(campaign_id: @campaign.id).search_for(params[:search]))
          else
            @pagy, @adventures = pagy(Adventure.where(campaign_id: @campaign.id))
          end
        }
        format.json do
          if current_user && @campaign.user == current_user
            render json: single_campaign(@campaign)
          else
            render json: single_campaign_small(@campaign)
          end
        end
      end
    end

    # GET /campaigns/new
    def new
      @campaign = Campaign.new
      authorize @campaign
      @campaign.user = current_user
    end

    # GET /campaigns/1/edit
    def edit
      authorize @campaign
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

    # PATCH/PUT /campaigns/1/join_campaign/:user_id
    def join_campaign
      @campaign = Campaign.find(params[:id])
      authorize @campaign
      if User.exists?(id: params[:user_id]) && !@campaign.campaign_users.exists?(user_id: params[:user_id])
        new_user = User.find_by(id: params[:user_id])
        @campaign.campaign_users.create(user: new_user, confirmed: false)
      end
      respond_to do |format|
        if @campaign.save
          format.html { redirect_to campaign_url(slug: @campaign.slug), notice: "You have requested to join the \"#{@campaign.name}\" campaign." }
          format.json { render :show, status: :ok, location: @campaign }
        else
          format.html { render :new }
          format.json { render json: @campaign.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /campaigns/1/confirm_user/:user_id
    def confirm_user
      @campaign = Campaign.find(params[:id])
      authorize @campaign
      if User.exists?(id: params[:user_id]) && @campaign.campaign_users.exists?(user_id: params[:user_id])
        @campaign.campaign_users.find_by(user_id: params[:user_id]).update(confirmed: true)
      end
      respond_to do |format|
        if @campaign.save
          format.html { redirect_to campaign_url(slug: @campaign.slug), notice: 'User was successfully confirmed.' }
          format.json { render :show, status: :ok, location: @campaign }
        else
          format.html { render :new }
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
      params.require(:campaign).permit(
        :name, :description, :world,
        character_ids: [],
        adventures_attributes: [
          :id,
          :name,
          :description,
          :_destroy,
          character_ids: [],
          adventure_world_location_attributes: %i[id _destroy world_location_id],
          encounters_attributes: [
            :id,
            :copper_pieces,
            :description,
            :electrum_pieces,
            :gold_pieces,
            :name,
            :platinum_pieces,
            :silver_pieces,
            :xp,
            :_destroy,
            encounter_monsters_attributes: %i[id number_of_monsters monster_id _destroy],
            equipment_items_attributes: [
              :id, :quantity, :_destroy, item_ids: []
            ]
          ]
        ],
        world_locations_attributes: %i[id name description _destroy],
        world_events_attributes: %i[id when name description _destroy]
      )
    end

    def campaigns(campaigns_list)
      campaigns_list.as_json(include: [:user, :users, :world_locations, :world_events,
                                       adventures: { include: [:encounters] },
                                       characters: { include: [:stat_block, :character_actions, :skills, :spells,
                                                               equipment_items: {
                                                                 include: [:items]
                                                               }] }])
    end

    def campaigns_small(campaigns_list)
      campaigns_list.as_json(include: [:user, :users, :world_locations, :world_events,
                                       characters: { include: %i[stat_block character_actions skills] }])
    end

    def single_campaign(single_campaign)
      single_campaign.as_json(include: [user: {
                                          except: %i[email created_at updated_at deleted_at]
                                        },
                                        users: {
                                          except: %i[email created_at updated_at deleted_at]
                                        },
                                        world_locations: {
                                          except: %i[campaign_id created_at updated_at]
                                        },
                                        world_events: {
                                          except: %i[campaign_id created_at updated_at]
                                        },
                                        adventures: {
                                          include: [encounters: {
                                                      except: %i[adventure_id created_at updated_at],
                                                      include: [
                                                        encounter_monsters: {
                                                          include: [
                                                            monster: {
                                                              include: %i[stat_block]
                                                            }
                                                          ]
                                                        },
                                                        equipment_items: {
                                                          include: %i[items]
                                                        }
                                                      ]
                                                    }],
                                          except: %i[campaign_id created_at updated_at]
                                        },
                                        characters: { include: [character_actions: {
                                                                  except: %i[character_id created_at updated_at]
                                                                },
                                                                skills: {
                                                                  except: %i[created_at updated_at monster_id character_id]
                                                                },
                                                                stat_block: {
                                                                  except: %i[created_at updated_at character_id monster_id]
                                                                },
                                                                equipment_items: {
                                                                  include: [items: { only: %i[id name type sub_category]}],
                                                                  only: %i[id quantity]
                                                                },
                                                                spells: {
                                                                  only: %i[id name page slug spell_level level]
                                                                }],
                                                      only: %i[id name slug level alignment race stat_block]
                                        }],
                              only: %i[id description world name slug]
      )
    end

    def single_campaign_small(single_campaign)
      single_campaign.as_json(include: [:user, :users, :world_locations, :world_events,
                                        characters: { include: %i[stat_block character_actions skills] }])
    end
  end
end

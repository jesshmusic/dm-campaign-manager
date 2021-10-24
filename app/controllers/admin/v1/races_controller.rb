# frozen_string_literal: true

module Admin::V1
  class RacesController < SecuredController
    before_action :set_race, only: [:show, :update, :destroy]
    skip_before_action :authorize_request, only: %i[index show]

    # GET /races
    # GET /races.json
    def index
      authorize Race
      if params[:list].present?
        @races = Race.all.order(name: :asc).map { |race|
          {
            name: race.name,
            slug: race.slug
          }
        }
        render json: { count: @races.count, results: @races }
      else
        @races = if params[:search].present?
                   Race.search_for(params[:search])
                 else
                   Race.all
                 end
        @races = if !current_user
                   @races.where(user_id: nil).order(name: :asc)
                 elsif current_user.admin?
                   @races.order(name: :asc)
                 else
                   @races.where(user_id: nil).or(@races.where(user_id: current_user.id)).order(name: :asc)
                 end
        respond_to do |format|
          format.html { @races }
          format.json
        end
      end
    end

    # GET /races/1
    # GET /races/1.json
    def show
      authorize @race
      respond_to do |format|
        format.html { @race }
        format.json
      end
    end

    # POST /races
    # POST /races.json
    def create
      @race = Race.new(race_params)
      authorize @race
      @race.user = current_user if current_user.dungeon_master?

      respond_to do |format|
        if @current_user.dungeon_master? && @current_user.races << @race
          format.html { redirect_to v1_race_url(slug: @race.slug), notice: 'Race was successfully created.' }
          format.json { render :show, status: :created }
        elsif @race.save
          format.html { redirect_to v1_race_url(slug: @race.slug), notice: 'Race was successfully created.' }
          format.json { render :show, status: :created }
        else
          format.html { render :new }
          format.json { render json: @race.errors.full_messages.join(', '), status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /races/1
    # PATCH/PUT /races/1.json
    def update
      authorize @race
      respond_to do |format|
        if @race.update(race_params)
          format.html { redirect_to v1_race_url(slug: @race.slug), notice: 'Race was successfully updated.' }
          format.json { render :show, status: :ok }
        else
          format.html { render :edit }
          format.json { render json: @race.errors.full_messages.join(', '), status: :unprocessable_entity }
        end
      end
    end

    # DELETE /races/1
    # DELETE /races/1.json
    def destroy
      authorize @race
      @race.destroy
      respond_to do |format|
        format.html { redirect_to v1_races_url, notice: 'Race was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private

    # Use callbacks to share common setup or constraints between api.
    def set_race
      @race = Race.find_by(slug: params[:slug])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def race_params
      params.require(:race).permit(:name, :age, :alignment, :language_choices,
                                   :language_description, :languages, :size, :size_descriptions,
                                   :speed, :starting_languages,
                                   ability_bonus_options_attributes: [:ability, :bonus],
                                   race_traits_attributes: [:name, :desc])
    end
  end
end

# frozen_string_literal: true

module Admin
  module V1
    class BackgroundsController < SecuredController
      before_action :set_background, only: %i[show update destroy]
      skip_before_action :authorize_request, only: %i[index show]

      # GET /backgrounds or /backgrounds.json
      def index
        @backgrounds = if params[:search].present?
                         Background.for_edition(current_edition).search_for(params[:search])
                       else
                         Background.for_edition(current_edition).srd
                       end
      end

      # GET /backgrounds/1 or /backgrounds/1.json
      def show; end

      # POST /backgrounds or /backgrounds.json
      def create
        @background = Background.new(background_params)
        @background.user = current_user
        @background.homebrew = true

        authorize @background

        respond_to do |format|
          if @background.save
            format.html { redirect_to @background, notice: 'Background was successfully created.' }
            format.json { render :show, status: :created, location: [:admin, :v1, @background] }
          else
            format.html { render :new, status: :unprocessable_entity }
            format.json { render json: @background.errors, status: :unprocessable_entity }
          end
        end
      end

      # PATCH/PUT /backgrounds/1 or /backgrounds/1.json
      def update
        authorize @background

        respond_to do |format|
          if @background.update(background_params)
            format.html { redirect_to @background, notice: 'Background was successfully updated.' }
            format.json { render :show, status: :ok, location: [:admin, :v1, @background] }
          else
            format.html { render :edit, status: :unprocessable_entity }
            format.json { render json: @background.errors, status: :unprocessable_entity }
          end
        end
      end

      # DELETE /backgrounds/1 or /backgrounds/1.json
      def destroy
        authorize @background
        @background.destroy

        respond_to do |format|
          format.html { redirect_to backgrounds_url, notice: 'Background was successfully destroyed.' }
          format.json { head :no_content }
        end
      end

      private

      def set_background
        @background = Background.friendly.find(params[:id])
      end

      def background_params
        params.require(:background).permit(
          :name, :description, :feat_name, :tool_proficiency,
          :equipment_option_a, :equipment_option_b,
          ability_scores: [], skill_proficiencies: []
        )
      end
    end
  end
end

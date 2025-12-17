# frozen_string_literal: true

module Admin
  module V1
    class FeatsController < SecuredController
      before_action :set_feat, only: %i[show update destroy]
      skip_before_action :authorize_request, only: %i[index show]

      # GET /feats or /feats.json
      def index
        @feats = if params[:search].present?
                   Feat.for_edition(current_edition).search_for(params[:search])
                 elsif params[:category].present?
                   Feat.for_edition(current_edition).srd.by_category(params[:category])
                 else
                   Feat.for_edition(current_edition).srd
                 end
      end

      # GET /feats/1 or /feats/1.json
      def show; end

      # POST /feats or /feats.json
      def create
        @feat = Feat.new(feat_params)
        @feat.user = current_user
        @feat.homebrew = true

        authorize @feat

        respond_to do |format|
          if @feat.save
            format.html { redirect_to @feat, notice: 'Feat was successfully created.' }
            format.json { render :show, status: :created, location: [:admin, :v1, @feat] }
          else
            format.html { render :new, status: :unprocessable_entity }
            format.json { render json: @feat.errors, status: :unprocessable_entity }
          end
        end
      end

      # PATCH/PUT /feats/1 or /feats/1.json
      def update
        authorize @feat

        respond_to do |format|
          if @feat.update(feat_params)
            format.html { redirect_to @feat, notice: 'Feat was successfully updated.' }
            format.json { render :show, status: :ok, location: [:admin, :v1, @feat] }
          else
            format.html { render :edit, status: :unprocessable_entity }
            format.json { render json: @feat.errors, status: :unprocessable_entity }
          end
        end
      end

      # DELETE /feats/1 or /feats/1.json
      def destroy
        authorize @feat
        @feat.destroy

        respond_to do |format|
          format.html { redirect_to feats_url, notice: 'Feat was successfully destroyed.' }
          format.json { head :no_content }
        end
      end

      private

      def set_feat
        @feat = Feat.friendly.find(params[:id])
      end

      def feat_params
        params.require(:feat).permit(:name, :category, :prerequisite, :description, :repeatable)
      end
    end
  end
end

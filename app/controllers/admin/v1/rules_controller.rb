module Admin::V1
  class RulesController < SecuredController
    before_action :set_rule, only: %i[ show edit update destroy ]
    skip_before_action :authorize_request, only: %i[index show]

    # GET /rules or /rules.json
    def index
      @rules = if params[:search].present?
                 Rule.search_for(params[:search])
               else
                 Rule.where(parent_id: nil)
               end
    end

    # GET /rules/1 or /rules/1.json
    def show
    end

    # POST /rules or /rules.json
    def create
      authorize @rule
      @rule = Rule.new(rule_params)

      respond_to do |format|
        if @rule.save
          format.html { redirect_to @rule, notice: 'Rule was successfully created.' }
          format.json { render :show, status: :created, location: @rule }
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @rule.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /rules/1 or /rules/1.json
    def update
      authorize @rule
      respond_to do |format|
        if @rule.update(rule_params)
          format.html { redirect_to @rule, notice: 'Rule was successfully updated.' }
          format.json { render :show, status: :ok, location: @rule }
        else
          format.html { render :edit, status: :unprocessable_entity }
          format.json { render json: @rule.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /rules/1 or /rules/1.json
    def destroy
      authorize @rule
      @rule.destroy
      respond_to do |format|
        format.html { redirect_to rules_url, notice: 'Rule was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private
    # Use callbacks to share common setup or constraints between actions.
    def set_rule
      @rule = Rule.friendly.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def rule_params
      params.require(:rule).permit(:name, :description, :category, :subcategory, :slug)
    end
  end
end


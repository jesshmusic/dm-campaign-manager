module Admin::V1
  class ConditionsController < SecuredController
    skip_before_action :authorize_request, only: %i[index show]

    def index
      @conditions = if params[:search].present?
                      Condition.search_for(params[:search])
                    else
                      Condition.all
                    end
      respond_to do |format|
        format.html { @pagy, @conditions = pagy(@conditions) }
        format.json
      end
    end

    def show
      @condition = Condition.find_by_slug(params[:slug])
    end
  end
end

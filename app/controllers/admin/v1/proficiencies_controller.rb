class Admin::V1::ProficienciesController < SecuredController
  skip_before_action :authorize_request, only: %i[index show]

  def index
    @proficiencies = if params[:search].present?
                       Prof.search_for(params[:search])
                     else
                       Prof.all
                     end
    respond_to do |format|
      format.html { @pagy, @proficiencies = pagy(@proficiencies) }
      format.json
    end
  end

  def show
    @proficiency = Prof.find_by_slug(params[:slug])
  end
end

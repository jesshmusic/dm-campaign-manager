class Admin::V1::ProficienciesController < SecuredController
  skip_before_action :authorize_request, only: %i[index saving_throws skills show]

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

  def saving_throws
    @proficiencies = if params[:search].present?
                       Prof.search_for(params[:search]).where(prof_type: 'Saving Throws')
                     else
                       Prof.where(prof_type: 'Saving Throws')
                     end
    respond_to do |format|
      format.html { @pagy, @proficiencies = pagy(@proficiencies) }
      format.json
    end
  end

  def skills
    @proficiencies = if params[:search].present?
                       Prof.search_for(params[:search]).where(prof_type: 'Skills')
                     else
                       Prof.where(prof_type: 'Skills')
                     end
    respond_to do |format|
      format.html { @pagy, @proficiencies = pagy(@proficiencies) }
      format.json
    end
  end

  def show
    @proficiency = Prof.friendly.find(params[:id])
  end
end

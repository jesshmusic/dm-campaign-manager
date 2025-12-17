module Admin
  module V1
    class SkillsController < SecuredController
      skip_before_action :authorize_request, only: %i[index show]

      def index
        @skills = if params[:search].present?
                    Skill.for_edition(current_edition).search_for(params[:search])
                  else
                    Skill.for_edition(current_edition)
                  end
        respond_to do |format|
          format.html { @pagy, @skills = pagy(@skills) }
          format.json
        end
      end

      def show
        @skill = Skill.friendly.find(params[:id])
      end
    end
  end
end

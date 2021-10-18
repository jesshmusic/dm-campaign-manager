module Admin::V1
  class SectionsController < SecuredController
    before_action :set_section, only: %i[ show edit update destroy ]
    skip_before_action :authorize_request, only: %i[index show]

    # GET /sections or /sections.json
    def index
      @sections = Section.all
    end

    # GET /sections/1 or /sections/1.json
    def show
    end

    # POST /sections or /sections.json
    def create
      authorize @section
      @section = Section.new(section_params)

      respond_to do |format|
        if @section.save
          format.html { redirect_to @section, notice: 'Section was successfully created.' }
          format.json { render :show, status: :created, location: @section }
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @section.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /sections/1 or /sections/1.json
    def update
      authorize @section
      respond_to do |format|
        if @section.update(section_params)
          format.html { redirect_to @section, notice: 'Section was successfully updated.' }
          format.json { render :show, status: :ok, location: @section }
        else
          format.html { render :edit, status: :unprocessable_entity }
          format.json { render json: @section.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /sections/1 or /sections/1.json
    def destroy
      authorize @section
      @section.destroy
      respond_to do |format|
        format.html { redirect_to v1_sections_url, notice: 'Section was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_section
      @section = Section.find_by(slug: params[:slug])
    end

    # Only allow a list of trusted parameters through.
    def section_params
      params.require(:section).permit(:name, :description, :slug)
    end
  end
end

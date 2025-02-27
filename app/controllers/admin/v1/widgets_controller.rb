module Admin::V1
  class WidgetsController < SecuredController
    before_action :set_user
    before_action :set_widget, only: %i[ show update destroy ]
    skip_before_action :authorize_request, only: %i[index show]

    # GET /widgets or /widgets.json
    def index
      @widgets = Widget.all
    end

    # GET /widgets/1 or /widgets/1.json
    def show
      respond_to do |format|
        format.json { render json: { widget: @widget }, status: :created }
      end
    end

    # POST /widgets or /widgets.json
    def create
      @widget = Widget.new(widget_params)
      authorize @widget
      @widget.user = @user if @user.dungeon_master?

      respond_to do |format|
        if @widget.save
          all_widgets = Widget.all
          format.json { render json: { widget: @widget, widgets: all_widgets, count: all_widgets.count }, status: :created }
        else
          format.json { render json: @widget.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /widgets/1 or /widgets/1.json
    def update
      authorize @widget
      respond_to do |format|
        if @widget.update(widget_params)
          all_widgets = Widget.all
          format.json { render json: { widget: @widget, widgets: all_widgets, count: all_widgets.count }, status: :ok }
        else
          format.json { render json: @widget.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /widgets/1 or /widgets/1.json
    def destroy
      authorize @widget
      @widget.destroy
      respond_to do |format|
        widgets = Widget.all
        format.json { render json: { widgets: widgets, count: Widget.all.count }, status: :created }
      end
    end

    private

    def set_user
      curr_user = AuthorizationService.new(request.headers).get_current_user
      @user = curr_user
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_widget
      @widget = Widget.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def widget_params
      params.require(:widget).permit(:title, :subtitle, :content, :icon)
    end
  end
end

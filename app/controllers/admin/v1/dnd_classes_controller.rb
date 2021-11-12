# frozen_string_literal: true

module Admin::V1
  class DndClassesController < SecuredController
    before_action :set_user
    before_action :set_dnd_class, only: %i[show edit update destroy]
    skip_before_action :authorize_request, only: %i[index show]

    # GET /v1/dnd_classes
    # GET /v1/dnd_classes.json
    def index
      @dnd_classes = if params[:search].present?
                       DndClass.search_for(params[:search])
                     else
                       DndClass.all
                     end

      @dnd_classes = if !@current_user
                       @dnd_classes.where(user_id: nil)
                     elsif @current_user.admin?
                       @dnd_classes
                     else
                       @dnd_classes.where(user_id: nil).or(@dnd_classes.where(user_id: @current_user.id))
                     end
      respond_to do |format|
        format.html { @pagy, @dnd_classes = pagy(@dnd_classes) }
        format.json
      end
    end

    # GET /v1/dnd_classes/:slug
    # GET /v1/dnd_classes/:slug.json
    def show
    end

    # POST /v1/dnd_classes
    # POST /v1/dnd_classes.json
    def create
      @dnd_class = DndClass.new(dnd_class_params)
      authorize @dnd_class
      @dnd_class.user = @current_user if @current_user.dungeon_master?
      @dnd_class.multi_classing = MultiClassing.create()
      respond_to do |format|
        if @current_user.dungeon_master? && @current_user.dnd_classes << @dnd_class
          format.html { redirect_to v1_dnd_class_url(slug: @dnd_class.slug), notice: 'Dnd class was successfully created.' }
          format.json { render :show, status: :created }
        elsif @dnd_class.save
          format.html { redirect_to v1_dnd_class_url(slug: @dnd_class.slug), notice: 'Dnd class was successfully created.' }
          format.json { render :show, status: :created }
        else
          format.html { render :new }
          format.json { render json: @dnd_class.errors.full_messages.join(', '), status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /v1/dnd_classes/:slug
    # PATCH/PUT /v1/dnd_classes/:slug.json
    def update
      authorize @dnd_class
      respond_to do |format|
        if @dnd_class.update(dnd_class_params)
          format.html { redirect_to v1_dnd_class_url(slug: @dnd_class.slug), notice: 'Dnd class was successfully updated.' }
          format.json { render :show, status: :ok }
        else
          format.html { render :edit }
          format.json { render json: @dnd_class.errors.full_messages.join(', '), status: :unprocessable_entity }
        end
      end
    end

    # DELETE /v1/dnd_classes/:slug
    # DELETE /v1/dnd_classes/:slug.json
    def destroy
      authorize @dnd_class
      @dnd_class.destroy
      respond_to do |format|
        format.html { redirect_to v1_dnd_classes_url, notice: 'Dnd class was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private

    def set_user
      curr_user_atts = session[:user]
      @current_user = curr_user_atts ? User.find_by_auth_id(curr_user_atts['auth_id']) : nil
    end

    # Use callbacks to share common setup or constraints between api.
    def set_dnd_class
      @dnd_class = DndClass.friendly.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def dnd_class_params
      params.require(:dnd_class).permit(
        :api_url,
        :hit_die,
        :name,
        :spell_ability,
        :user,
        ability_score_ids: [],
        prof_ids: [],
        spell_ids: [],
        skill_ids: [],
        subclasses: [],
        dnd_class_levels_attributes: [
          :id,
          :ability_score_bonuses,
          :level,
          :prof_bonus,
          :_destroy,
          class_features_attributes: [
            :id,
            :level,
            :name,
            :reference,
            :_destroy,
            desc: [],
            class_level_choice_attributes: [
              :id,
              :name,
              :num_choices,
              :_destroy,
              choices: []
            ],
            expertise_options_attributes: [
              :id,
              :name,
              :num_choices,
              :_destroy,
              choices: []
            ],
            subfeature_options_attributes: [
              :id,
              :name,
              :num_choices,
              :_destroy,
              choices: []
            ],
            prerequisites_attributes: [
              :id,
              :level,
              :name,
              :_destroy,
            ],
          ],
          class_specifics_attributes: [
            :id,
            :index,
            :name,
            :value,
            :_destroy,
            class_specific_spell_slots_attributes: [
              :id,
              :sorcery_point_cost,
              :spell_slot_level,
              :_destroy,
            ]
          ],
          class_spellcasting_attributes: [
            :id,
            :cantrips_known,
            :spell_slots_level_1,
            :spell_slots_level_2,
            :spell_slots_level_3,
            :spell_slots_level_4,
            :spell_slots_level_5,
            :spell_slots_level_6,
            :spell_slots_level_7,
            :spell_slots_level_8,
            :spell_slots_level_9,
            :spells_known,
            :_destroy,
          ]
        ],
        equipments_attributes: [
          :id,
          :name,
          :quantity,
          :_destroy
        ],
        multi_classing_attributes: [
          :id,
          :_destroy,
          multi_class_prereqs_attributes: [
            :id,
            :ability_score,
            :minimum_score,
            :_destroy,
          ],
          multi_classing_prereq_option_attributes: [
            :id,
            :choose,
            :prereq_type,
            :_destroy,
            multi_class_prereqs_attributes: [
              :id,
              :ability_score,
              :minimum_score,
              :_destroy,
            ],
          ],
          prof_ids: [],
          prof_choices_attributes: [
            :id,
            :name,
            :num_choices,
            :prof_choice_type,
            :_destroy,
            prof_ids: []
          ],
        ],
        prof_choices_attributes: [
          :id,
          :name,
          :num_choices,
          :prof_choice_type,
          :_destroy,
          prof_ids: []
        ],
        spell_casting_attributes: [
          :id,
          :level,
          :ability_score,
          :_destroy,
          spell_casting_infos_attributes: [
            :id,
            :name,
            :_destroy,
            desc: []
          ]
        ],
        starting_equipment_options_attributes: [
          :id,
          :choose,
          :equipment_category,
          :equipment_type,
          :_destroy,
          equipment_ids: [],
          equipment_options_attributes: [
            :id,
            :choose,
            :equipment_category,
            :equipment_type,
            :_destroy,
            equipment_ids: [],
          ]
        ]
      )
    end
  end
end

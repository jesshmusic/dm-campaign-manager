# frozen_string_literal: true

module Admin::V1
  class SpellsController < SecuredController
    before_action :set_spell, only: %i[show edit update destroy]
    skip_before_action :authorize_request, only: %i[index show]

    # GET /spells
    # GET /spells.json
    def index
      authorize Spell
      if params[:list].present?
        @spells = if params[:search].present?
                    Spell.search_for(params[:search]).order(name: :asc).map { |spell|
                      {
                        name: spell.name,
                        id: spell.id,
                        data: {
                          slug: spell.slug,
                          level: spell.level
                        }
                      }
                    }
                  else
                    Spell.all.order(name: :asc).map { |spell|
                      {
                        name: spell.name,
                        id: spell.id,
                        data: {
                          slug: spell.slug,
                          level: spell.level
                        }
                      }
                    }
                  end
        render json: { count: @spells.count, results: @spells }
      else
        @spells = if params[:dnd_class].present? && params[:search].present?
                    Spell.includes(:dnd_classes).where(dnd_classes: { name: params[:dnd_class] }).search_for(params[:search])
                  elsif params[:dnd_class].present?
                    Spell.includes(:dnd_classes).where(dnd_classes: { name: params[:dnd_class] })
                  elsif params[:search].present?
                    Spell.search_for(params[:search])
                  else
                    Spell.all
                  end
        @spells = @spells.where(level: params[:level]) if params[:level].present?
        @spells = if !current_user
                    @spells.where(user_id: nil)
                  elsif current_user.admin?
                    @spells
                  else
                    @spells.where(user_id: nil).or(@spells.where(user_id: current_user.id))
                  end
        respond_to do |format|
          format.html { @pagy, @spells = pagy(@spells) }
          format.json
        end
      end
    end

    # GET /spells/1
    # GET /spells/1.json
    def show
      authorize @spell
      respond_to do |format|
        format.html { @spell }
        format.json
      end
    end

    # POST /spells
    # POST /spells.json
    def create
      @spell = Spell.new(spell_params)
      authorize @spell
      @spell.user = current_user if current_user.dungeon_master?

      respond_to do |format|
        if @spell.save
          format.html { redirect_to v1_spell_url(slug: @spell.slug), notice: 'Spell was successfully created.' }
          format.json { render :show, status: :created }
        else
          format.html { render :new }
          format.json { render json: @spell.errors.full_messages.join(', '), status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /spells/1
    # PATCH/PUT /spells/1.json
    def update
      authorize @spell

      respond_to do |format|
        if @spell.update(spell_params)
          format.html { redirect_to v1_spell_url(slug: @spell.slug), notice: 'Spell was successfully updated.' }
          format.json { render :show, status: :ok }
        else
          format.html { render :edit }
          format.json { render json: @spell.errors.full_messages.join(', '), status: :unprocessable_entity }
        end
      end
    end

    # DELETE /spells/1
    # DELETE /spells/1.json
    def destroy
      authorize @spell
      @spell.destroy

      respond_to do |format|
        format.html { redirect_to v1_spells_url, notice: 'Spell was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private

    # Use callbacks to share common setup or constraints between api.
    def set_spell
      @spell = Spell.find_by(slug: params[:slug])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def spell_params
      params.require(:spell).permit(:name, :description, :higher_level,
                                    :page, :range, :material, :ritual,
                                    :duration, :concentration, :casting_time,
                                    :level, :school,
                                    components: [],
                                    dnd_class_ids: [])
    end
  end
end

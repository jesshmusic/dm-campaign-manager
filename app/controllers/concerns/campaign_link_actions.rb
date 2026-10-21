# frozen_string_literal: true

# Adding, changing (only the quantity) and removing the links of a session,
# quest or encounter (see CampaignLink). Including controllers set
# @link_owner, the session, quest or encounter, in a before_action.
module CampaignLinkActions
  extend ActiveSupport::Concern

  # POST .../links
  def create
    link_params = params.require(:link).permit(:linkable_type, :linkable_id, :quantity)
    unless @link_owner.links.klass::LINKABLE_TYPES.include?(link_params[:linkable_type])
      return render json: { errors: ['Unknown link type'] }, status: :unprocessable_entity
    end

    link = @link_owner.links.new(link_params.merge(position: next_link_position))
    if link.save
      render json: link.as_json_for_api, status: :created
    else
      render json: { errors: link.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH .../links/:id
  # Only the quantity changes; to link something else, add a new link
  def update
    link = @link_owner.links.find(params[:id])
    if link.update(params.require(:link).permit(:quantity))
      render json: link.as_json_for_api
    else
      render json: { errors: link.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE .../links/:id
  def destroy
    @link_owner.links.find(params[:id]).destroy!
    head :no_content
  end

  private

  def next_link_position
    (@link_owner.links.maximum(:position) || -1) + 1
  end
end

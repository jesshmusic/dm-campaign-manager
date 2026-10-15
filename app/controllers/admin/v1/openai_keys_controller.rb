# frozen_string_literal: true

module Admin
  module V1
    # The signed-in user's own OpenAI API key, used for AI planner features.
    # The key is never returned; only whether one is saved and its last four.
    class OpenAIKeysController < SecuredController
      include SignedInUser

      # GET /v1/openai-key
      def show
        render json: key_status
      end

      # PUT /v1/openai-key
      # Checks the key with OpenAI before saving it.
      def update
        api_key = params.require(:openai_key).permit(:api_key)[:api_key].to_s.strip
        @user.openai_api_key = api_key
        return render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity unless @user.valid?

        OpenAIClient.new(api_key: api_key).verify_key!
        @user.save!
        render json: key_status
      rescue OpenAIClient::Error
        render json: { errors: ['OpenAI did not accept that key. Check it and try again.'] }, status: :unprocessable_entity
      end

      # DELETE /v1/openai-key
      def destroy
        @user.update!(openai_api_key: nil)
        head :no_content
      end

      private

      def key_status
        {
          configured: @user.openai_api_key.present?,
          hint: @user.openai_api_key_hint,
          hostedAvailable: @user.premium?
        }
      end
    end
  end
end

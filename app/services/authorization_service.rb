class AuthorizationService
  def initialize(headers = {})
    @headers = headers
  end

  def authenticate_request!
    verify_token
  end

  def get_current_user
    current_user_from_token
  end

  private

  def http_token
    return if @headers['Authorization'].blank?

    @headers['Authorization'].split.last
  end

  def verify_token
    Rails.logger.debug http_token
    JsonWebToken.verify(http_token)
  end

  def current_user_from_token
    return unless http_token

    curr_user = JsonWebToken.current_user_from_token(http_token)
    User.find_by(auth_id: curr_user[0]['sub']) unless curr_user.nil? || curr_user[0]['sub'].nil?
  end
end

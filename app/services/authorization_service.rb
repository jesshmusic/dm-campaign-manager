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
    if @headers['Authorization'].present?
      @headers['Authorization'].split(' ').last
    end
  end

  def verify_token
    puts http_token
    JsonWebToken.verify(http_token)
  end

  def current_user_from_token
    return unless http_token
    JsonWebToken.current_user_from_token(http_token)
  end
end

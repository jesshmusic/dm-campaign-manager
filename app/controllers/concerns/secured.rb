SCOPES = {
  '/private' => nil,
  '/private-scoped' => ['read:messages']
}

private

def authenticate_request!
  @auth_payload, @auth_header = auth_token

  render json: { errors: ['Insufficient scope'] }, status: :unauthorized unless scope_included
rescue JWT::VerificationError, JWT::DecodeError
  render json: { errors: ['Not Authenticated'] }, status: :unauthorized
end

def scope_included
  if SCOPES[request.env['PATH_INFO']] == nil
    true
  else
    # The intersection of the scopes included in the given JWT and the ones in the SCOPES hash needed to access
    # the PATH_INFO, should contain at least one element
    (String(@auth_payload['scope']).split(' ') & (SCOPES[request.env['PATH_INFO']])).any?
  end
end

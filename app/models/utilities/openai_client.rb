# frozen_string_literal: true

require 'json'
require 'net/http'
require 'time'
require 'uri'

# OpenAI API client for chat completions
# Zeitwerk maps openai_client.rb to OpenAIClient (capital AI because of Zeitwerk inflector)
class OpenAIClient
  class Error < RuntimeError; end

  LastResponse = Struct.new(
    :date, :organization, :processing_ms, :request_id,
    :status_code, :status_message, keyword_init: true
  )

  Completion = Struct.new(:choices, :created, :id, :model, :object, keyword_init: true) do
    def created_at
      Time.zone.at(created)
    end
  end
  SearchResult = Struct.new(:document, :object, :score, :text,  keyword_init: true)
  Engine       = Struct.new(:id, :object, :owner, :ready,       keyword_init: true)

  # ─────────────────────────────────────────────────────────────
  # Construction
  # ─────────────────────────────────────────────────────────────
  attr_reader :last_response
  attr_writer :api_key
  attr_accessor :default_model

  DEFAULT_MODEL = ENV.fetch('OPENAI_DEFAULT_MODEL', 'gpt-4o-mini').freeze
  BASE_URI = URI('https://api.openai.com').freeze

  def initialize(api_key:, default_model: DEFAULT_MODEL)
    @api_key       = api_key
    @default_model = default_model
  end

  # ─────────────────────────────────────────────────────────────
  # Chat completions
  # ─────────────────────────────────────────────────────────────
  def completions(prompt:, **opts)
    defaults = {
      temperature: 0.9,
      top_p: 1.0,
      presence_penalty: 0.6,
      frequency_penalty: 0.3,
      n: 1,
      max_tokens: 100,
      model: default_model
    }

    p = defaults.merge(opts)

    body = {
      model: p[:model],
      temperature: p[:temperature],
      top_p: p[:top_p],
      presence_penalty: p[:presence_penalty],
      frequency_penalty: p[:frequency_penalty],
      n: p[:n],
      max_tokens: p[:max_tokens],
      messages: [
        { role: 'user', content: prompt.to_s }
      ]
    }

    # Add JSON response format if requested (forces valid JSON output)
    body[:response_format] = { type: 'json_object' } if p[:json_mode]

    response = post('/v1/chat/completions', body: body)
    choices  = response[:choices].map { |c| c.dig(:message, :content)&.strip }
    content = p[:n] == 1 ? choices.first : choices

    # Return full response if requested
    if p[:return_usage]
      {
        content: content,
        usage: response[:usage]
      }
    else
      content
    end
  end

  # ─────────────────────────────────────────────────────────────
  # Legacy search (unchanged)
  # ─────────────────────────────────────────────────────────────
  def search(documents:, query:, model: default_model)
    body = { documents: documents, query: query }
    search_results = post("/v1/engines/#{model}/search", body: body)
    search_results[:data].map.with_index do |datum, index|
      SearchResult.new(**datum).tap { |r| r.text = documents[index] }
    end
  end

  # ─────────────────────────────────────────────────────────────
  # HTTP helpers
  # ─────────────────────────────────────────────────────────────
  private

  def get(path)
    handle_response http_request(:Get, path)
  end

  def post(path, body:)
    handle_response http_request(:Post, path, body: body.to_json)
  end

  def http_request(method, path, body: nil)
    uri = BASE_URI + path
    req = Net::HTTP.const_get(method).new(uri)
    req.body = body if body
    headers.each { |k, v| req[k] = v }

    Net::HTTP.start(
      uri.hostname, uri.port,
      use_ssl: true,
      open_timeout: 10,
      read_timeout: 60
    ) do |http|
      http.request(req)
    end
  end

  def handle_response(response)
    @last_response = LastResponse.new(
      date: response['date'] && Time.httpdate(response['date']),
      organization: response['openai-organization'],
      processing_ms: response['openai-processing-ms']&.to_i,
      request_id: response['x-request-id'],
      status_code: response.code.to_i,
      status_message: response.message
    )

    body = JSON.parse(response.body, symbolize_names: true)
    return body if response.is_a?(Net::HTTPSuccess)

    raise Error, body.dig(:error, :message) || response.body
  end

  def headers
    {
      'Authorization' => "Bearer #{@api_key}",
      'Content-Type' => 'application/json'
    }
  end
end

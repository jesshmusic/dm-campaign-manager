require "json"
require "net/http"
require "time"
require "uri"

module OpenAI
  class Client
    class Error < RuntimeError
    end

    LastResponse = Struct.new(:date, :organization, :processing_ms, :request_id, :status_code, :status_message, keyword_init: true)
    Completion = Struct.new(:choices, :created, :id, :model, :object, keyword_init: true) do
      def created_at
        Time.at(created)
      end
    end
    Logprobs = Struct.new(:tokens, :token_logprobs, :top_logprobs, :text_offset, keyword_init: true)
    SearchResult = Struct.new(:document, :object, :score, :text, keyword_init: true)
    Engine = Struct.new(:id, :object, :owner, :ready, keyword_init: true)
    Choice = Struct.new(:finish_reason, :index, :logprobs, :text, keyword_init: true)

    attr_reader :last_response
    attr_writer :api_key
    attr_accessor :default_engine

    def initialize(api_key:, default_engine: "davinci")
      @api_key = api_key
      @default_engine = default_engine
    end

    def engine(id = default_engine)
      engine = get("/v1/engines/#{id}")
      Engine.new(**engine)
    end

    def engines
      engines = get("/v1/engines")
      engines[:data].map do |engine|
        Engine.new(**engine)
      end
    end

    def completions(prompt)
      body = {
        "model" => 'gpt-4.1-mini',
        "messages" => [
          {
            "role" => "user",
            "content" => prompt.to_s
          }
        ],
      }.compact

      completion = post("/v1/chat/completions", body: body)


      choices = completion[:choices]&.map do |choice|
        choice[:message][:content] unless choice[:message].nil?
      end

      choices[0]
    end

    def search(documents:, query:, engine: default_engine)
      body = {
        "documents" => documents,
        "query"     => query,
      }.compact

      search_results = post("/v1/engines/#{engine}/search", body: body)
      search_results[:data].map.with_index do |datum, index|
        SearchResult.new(**datum).tap do |result|
          result.text = documents[index]
        end
      end
    end

    private def get(path)
      uri = URI.parse("https://api.openai.com#{path}")
      req = Net::HTTP::Get.new(uri)
      headers.each do |name, value|
        req[name] = value
      end
      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
        http.request(req)
      end
      handle_response(response)
    end

    private def post(path, body: nil)
      uri = URI.parse("https://api.openai.com#{path}")
      req = Net::HTTP::Post.new(uri)
      req.body = body.to_json
      headers.each do |name, value|
        req[name] = value
      end
      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
        http.request(req)
      end
      handle_response(response)
    end

    private def handle_response(response)
      date = Time.httpdate(response["date"]) if response["date"]
      organization = response["openai-organization"]
      processing_ms = response["openai-processing-ms"]&.to_i
      request_id = response["x-request-id"]
      status_code = response.code&.to_i
      status_message = response.message
      @last_response = LastResponse.new(date: date, organization: organization, processing_ms: processing_ms, request_id: request_id, status_code: status_code, status_message: status_message)

      response_body = JSON.parse(response.body, symbolize_names: true)
      case response
      when Net::HTTPSuccess
        response_body
      else
        raise Error, response_body[:error][:message].to_s
      end
    end

    private def headers
      @headers ||= {
        "Authorization" => "Bearer #{@api_key}",
        "Content-Type"  => "application/json",
      }
    end
  end
end

# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CommonerDescriptionGenerator do
  let(:valid_params) do
    {
      name: 'Elara Moonwhisper',
      race: 'Elf',
      gender: 'Female',
      role: 'Healer'
    }
  end

  let(:mock_description) { 'A slender elven woman with silver-streaked hair and kind, knowing eyes. She moves with a quiet grace and always carries a worn leather satchel filled with healing herbs.' }

  describe '.generate' do
    context 'with valid params' do
      before do
        mock_client = instance_double(OpenAIClient)
        allow(OpenAIClient).to receive(:new).and_return(mock_client)
        allow(mock_client).to receive(:completions).and_return(mock_description)
      end

      it 'returns a description hash' do
        result = described_class.generate(valid_params)

        expect(result[:description]).to eq(mock_description)
        expect(result[:error]).to be_nil
      end

      it 'strips whitespace from the response' do
        mock_client = instance_double(OpenAIClient)
        allow(OpenAIClient).to receive(:new).and_return(mock_client)
        allow(mock_client).to receive(:completions).and_return("  #{mock_description}  \n")

        result = described_class.generate(valid_params)

        expect(result[:description]).to eq(mock_description)
      end
    end

    context 'with minimal params' do
      it 'uses defaults for missing optional params' do
        mock_client = instance_double(OpenAIClient)
        allow(OpenAIClient).to receive(:new).and_return(mock_client)
        allow(mock_client).to receive(:completions).and_return(mock_description)

        result = described_class.generate(name: 'John')

        expect(result[:description]).to be_present
      end
    end

    context 'with invalid params' do
      it 'raises error when name is missing' do
        params = valid_params.merge(name: nil)

        expect { described_class.generate(params) }.to raise_error(ArgumentError, /Name is required/)
      end

      it 'raises error when name is blank' do
        params = valid_params.merge(name: '')

        expect { described_class.generate(params) }.to raise_error(ArgumentError, /Name is required/)
      end
    end

    context 'when OpenAI fails' do
      before do
        mock_client = instance_double(OpenAIClient)
        allow(OpenAIClient).to receive(:new).and_return(mock_client)
        allow(mock_client).to receive(:completions).and_raise(OpenAIClient::Error.new('API rate limit exceeded'))
      end

      it 'returns an error hash' do
        result = described_class.generate(valid_params)

        expect(result[:error]).to be_present
        expect(result[:error]).to include('AI service error')
        expect(result[:description]).to be_nil
      end

      it 'truncates long error messages' do
        long_error_message = 'x' * 200
        mock_client = instance_double(OpenAIClient)
        allow(OpenAIClient).to receive(:new).and_return(mock_client)
        allow(mock_client).to receive(:completions).and_raise(OpenAIClient::Error.new(long_error_message))

        result = described_class.generate(valid_params)

        expect(result[:error].length).to be < 150
      end
    end
  end
end

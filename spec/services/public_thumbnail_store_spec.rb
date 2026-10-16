require 'rails_helper'

RSpec.describe PublicThumbnailStore do
  let(:s3) { instance_double(Aws::S3::Client, put_object: true, delete_object: true) }

  before do
    allow(Aws::S3::Client).to receive(:new).and_return(s3)
    allow(ENV).to receive(:fetch).and_call_original
    allow(ENV).to receive(:fetch).with('AWS_S3_BUCKET', nil).and_return('test-bucket')
    allow(ENV).to receive(:[]).and_call_original
    allow(ENV).to receive(:[]).with('AWS_REGION').and_return('us-east-1')
  end

  it 'uploads under thumbnails/ and returns the public URL' do
    result = described_class.put('scenes/1/a.webp', 'bytes', 'image/webp')

    expect(s3).to have_received(:put_object).with(
      bucket: 'test-bucket', key: 'thumbnails/scenes/1/a.webp', body: 'bytes', content_type: 'image/webp'
    )
    expect(result).to eq(key: 'thumbnails/scenes/1/a.webp',
                         url: 'https://test-bucket.s3.us-east-1.amazonaws.com/thumbnails/scenes/1/a.webp')
  end

  it 'deletes only what is under thumbnails/' do
    described_class.delete('thumbnails/scenes/1/a.webp')
    described_class.delete('maps/1/package.zip')
    described_class.delete(nil)

    expect(s3).to have_received(:delete_object).once.with(bucket: 'test-bucket', key: 'thumbnails/scenes/1/a.webp')
  end

  it 'carries on when S3 fails to delete' do
    allow(s3).to receive(:delete_object).and_raise(Aws::S3::Errors::ServiceError.new(nil, 'Nope'))

    expect { described_class.delete('thumbnails/scenes/1/a.webp') }.not_to raise_error
  end
end

# == Schema Information
#
# Table name: foundry_scenes
#
#  id               :bigint           not null, primary key
#  foundry_uuid     :string           not null
#  name             :string           not null
#  thumbnail_s3_key :string           not null
#  thumbnail_url    :string           not null
#  version          :string           not null
#  world_title      :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  user_id          :bigint           not null
#  world_id         :string           not null
#
# Indexes
#
#  index_foundry_scenes_on_user_id_and_foundry_uuid               (user_id,foundry_uuid)
#  index_foundry_scenes_on_user_id_and_world_id_and_foundry_uuid  (user_id,world_id,foundry_uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe FoundryScene, type: :model do
  let(:user) { create(:dungeon_master_user) }
  let(:webp) { "RIFF\x24\x00\x00\x00WEBPVP8 ".b + ("\x00" * 24).b }
  let(:thumbnail) { "data:image/webp;base64,#{Base64.strict_encode64(webp)}" }
  let(:uploaded) { [] }
  let(:deleted) { [] }

  before do
    allow(PublicThumbnailStore).to receive(:put) do |path, _body, _type|
      uploaded << path
      { key: "thumbnails/#{path}", url: "https://test-bucket.s3.us-east-1.amazonaws.com/thumbnails/#{path}" }
    end
    allow(PublicThumbnailStore).to receive(:delete) { |key| deleted << key }
  end

  def save(uuid: 'Scene.a1B2c3D4e5F6g7H8', name: 'Mountain Pass', version: '1-abc', image: thumbnail, world: 'greyhawk')
    described_class.save_from_world!(user, { id: world, title: 'Greyhawk' },
                                     { uuid: uuid, name: name, version: version, thumbnail: image })
  end

  describe 'validations' do
    it 'is valid from the factory' do
      expect(build(:foundry_scene)).to be_valid
    end

    it 'needs a world scene uuid' do
      expect(build(:foundry_scene, foundry_uuid: 'Actor.a1B2c3D4e5F6g7H8')).not_to be_valid
      expect(build(:foundry_scene, foundry_uuid: 'Compendium.world.maps.Scene.a1B2c3D4e5F6g7H8')).not_to be_valid
    end

    it 'needs a world id' do
      expect(build(:foundry_scene, world_id: 'bad world!')).not_to be_valid
    end

    it 'is unique per world' do
      scene = create(:foundry_scene, user: user)

      expect(build(:foundry_scene, user: user, foundry_uuid: scene.foundry_uuid)).not_to be_valid
      expect(build(:foundry_scene, user: user, foundry_uuid: scene.foundry_uuid, world_id: 'other')).to be_valid
    end
  end

  describe '.save_from_world!' do
    it 'uploads the thumbnail and saves the scene' do
      scene = save

      expect(uploaded.sole).to match(%r{\Ascenes/#{user.id}/[\w-]+\.webp\z})
      expect(scene).to be_persisted
      expect(scene).to have_attributes(
        foundry_uuid: 'Scene.a1B2c3D4e5F6g7H8', name: 'Mountain Pass', version: '1-abc', world_title: 'Greyhawk',
        thumbnail_s3_key: "thumbnails/#{uploaded.sole}",
        thumbnail_url: "https://test-bucket.s3.us-east-1.amazonaws.com/thumbnails/#{uploaded.sole}"
      )
    end

    it 'keeps the thumbnail when the version is the same' do
      save
      scene = save(name: 'The Pass', image: 'not even an image')

      expect(uploaded.size).to eq(1)
      expect(scene.reload.name).to eq('The Pass')
    end

    it 'replaces the thumbnail when the version changes, and deletes the old one' do
      old_key = save.thumbnail_s3_key
      scene = save(version: '1-def')

      expect(uploaded.size).to eq(2)
      expect(scene.thumbnail_s3_key).to eq("thumbnails/#{uploaded.last}")
      expect(deleted).to eq([old_key])
      expect(user.foundry_scenes.count).to eq(1)
    end

    it 'accepts JPEG and PNG thumbnails' do
      jpeg = "data:image/jpeg;base64,#{Base64.strict_encode64("\xFF\xD8\xFF\xE0rest".b)}"
      png = "data:image/png;base64,#{Base64.strict_encode64("\x89PNG\r\n\x1A\nrest".b)}"

      expect(save(image: jpeg).thumbnail_s3_key).to end_with('.jpg')
      expect(save(uuid: 'Scene.b1B2c3D4e5F6g7H8', image: png).thumbnail_s3_key).to end_with('.png')
    end

    it 'rejects a thumbnail that is not an image data URL' do
      expect { save(image: 'https://example.com/map.webp') }.to raise_error(described_class::InvalidThumbnail, /data URL/)
      expect { save(image: "data:image/svg+xml;base64,#{Base64.strict_encode64('<svg/>')}") }
        .to raise_error(described_class::InvalidThumbnail, /data URL/)
      expect(uploaded).to be_empty
    end

    it 'rejects a thumbnail whose bytes are not the image type it claims' do
      html = "data:image/webp;base64,#{Base64.strict_encode64('<script>alert(1)</script>')}"

      expect { save(image: html) }.to raise_error(described_class::InvalidThumbnail, /isn't a image\/webp image/)
      expect(uploaded).to be_empty
    end

    it 'rejects a thumbnail that is too large' do
      stub_const("#{described_class}::MAX_THUMBNAIL_BYTES", 10)

      expect { save }.to raise_error(described_class::InvalidThumbnail, /too large/)
    end

    it 'checks the scene before uploading' do
      expect { save(uuid: 'Scene.bad') }.to raise_error(ActiveRecord::RecordInvalid, /Foundry uuid/)
      expect { save(name: '') }.to raise_error(ActiveRecord::RecordInvalid, /Name/)
      expect(uploaded).to be_empty
    end

    it 'limits how many scenes a world has' do
      stub_const("#{described_class}::MAX_PER_WORLD", 1)
      save

      expect { save(uuid: 'Scene.b1B2c3D4e5F6g7H8') }.to raise_error(described_class::InvalidThumbnail, /up to 1/)
      expect(save(uuid: 'Scene.b1B2c3D4e5F6g7H8', world: 'other')).to be_persisted
    end
  end

  describe '.thumbnail_urls' do
    it "maps the user's scenes to their thumbnails" do
      pass = create(:foundry_scene, user: user)
      create(:foundry_scene, foundry_uuid: pass.foundry_uuid)
      other = create(:foundry_scene, user: user)

      expect(described_class.thumbnail_urls(user, [pass.foundry_uuid, 'Scene.zzzzzzzzzzzzzzzz']))
        .to eq(pass.foundry_uuid => pass.thumbnail_url)
      expect(described_class.thumbnail_urls(user, [])).to eq({})
      expect(described_class.thumbnail_urls(user, [other.foundry_uuid]).keys).to eq([other.foundry_uuid])
    end

    it 'shows the latest thumbnail of a scene that is in two worlds' do
      old = create(:foundry_scene, user: user, updated_at: 2.days.ago)
      latest = create(:foundry_scene, user: user, foundry_uuid: old.foundry_uuid, world_id: 'copy')

      expect(described_class.thumbnail_urls(user, [old.foundry_uuid])).to eq(old.foundry_uuid => latest.thumbnail_url)
    end
  end

  it 'lists for picking maps with its world' do
    scene = create(:foundry_scene, user: user, name: 'Mountain Pass')

    expect(scene.as_summary_json_for_api).to eq(uuid: scene.foundry_uuid, name: 'Mountain Pass', thumbnailUrl: scene.thumbnail_url,
                                                worldId: 'greyhawk', worldTitle: 'Greyhawk')
  end

  it 'deletes its thumbnail when destroyed' do
    scene = create(:foundry_scene, user: user)

    scene.destroy!

    expect(deleted).to eq([scene.thumbnail_s3_key])
  end
end

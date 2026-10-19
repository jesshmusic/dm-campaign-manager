# Request examples for the CRUD endpoints under /v1/campaigns/:campaign_id
# (CampaignChildResource). The including group defines `user` and `campaign`
# (owned by `user`) and passes the URL segment, the request param root key and
# the record's factory. Inside the block it defines:
#   valid_attributes   - params that create a record
#   created_json       - a subset of the JSON returned for valid_attributes
#   invalid_attributes - params that fail validation
#   invalid_message    - one of the resulting error messages
#   update_attributes  - params that change a record
#   updated_json       - a subset of the JSON returned after the update
RSpec.shared_examples 'a campaign child resource' do |path:, root:, factory:|
  let(:json) { response.parsed_body }
  let(:model) { build(factory).class }
  let(:collection_path) { "/v1/campaigns/#{campaign.slug}/#{path}" }
  let(:record) { create(factory, campaign: campaign) }
  let(:record_path) { "#{collection_path}/#{record.id}" }

  context 'when signed in as the campaign owner' do
    before { stub_authentication(user) }

    describe "GET /v1/campaigns/:campaign_id/#{path}" do
      it "lists this campaign's records only" do
        record
        create(factory, campaign: create(:campaign, user: user))

        get collection_path

        expect(response).to have_http_status(:success)
        expect(json.pluck('id')).to eq([record.id.to_s])
      end
    end

    describe "GET /v1/campaigns/:campaign_id/#{path}/:id" do
      it 'shows the record' do
        get record_path

        expect(response).to have_http_status(:success)
        expect(json).to include('id' => record.id.to_s, 'uuid' => record.uuid)
      end

      it "returns 404 for a record from the user's other campaign" do
        elsewhere = create(factory, campaign: create(:campaign, user: user))

        get "#{collection_path}/#{elsewhere.id}"

        expect(response).to have_http_status(:not_found)
        expect(json['errors']).to eq(['Not found'])
      end
    end

    describe "POST /v1/campaigns/:campaign_id/#{path}" do
      it 'creates a record in the campaign' do
        expect do
          post collection_path, params: { root => valid_attributes }, as: :json
        end.to change { model.where(campaign: campaign).count }.by(1)

        expect(response).to have_http_status(:created)
        expect(json).to include(created_json)
        created = model.find(json['id'])
        expect(created.uuid).to eq(json['uuid'])
        expect(created.sync_version).to eq(campaign.reload.sync_counter)
      end

      it 'returns validation errors' do
        expect do
          post collection_path, params: { root => invalid_attributes }, as: :json
        end.not_to change(model, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to include(invalid_message)
      end

      it 'cannot move the record into another campaign' do
        elsewhere = create(:campaign, user: user)

        post collection_path, params: { root => valid_attributes.merge(campaign_id: elsewhere.id) }, as: :json

        expect(model.find(json['id']).campaign).to eq(campaign)
      end
    end

    describe "PATCH /v1/campaigns/:campaign_id/#{path}/:id" do
      it 'updates the record and bumps its sync version' do
        version = record.sync_version

        patch record_path, params: { root => update_attributes }, as: :json

        expect(response).to have_http_status(:success)
        expect(json).to include(updated_json)
        expect(record.reload.sync_version).to be > version
      end

      it 'returns validation errors' do
        patch record_path, params: { root => invalid_attributes }, as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to include(invalid_message)
      end

      it "returns 404 for a record from the user's other campaign" do
        elsewhere = create(factory, campaign: create(:campaign, user: user))

        expect do
          patch "#{collection_path}/#{elsewhere.id}", params: { root => update_attributes }, as: :json
        end.not_to(change { elsewhere.reload.attributes })

        expect(response).to have_http_status(:not_found)
      end
    end

    describe "DELETE /v1/campaigns/:campaign_id/#{path}/:id" do
      it 'deletes the record and leaves a tombstone for sync' do
        record

        expect { delete record_path }.to change(CampaignTombstone, :count).by(1)

        expect(response).to have_http_status(:no_content)
        expect(model.exists?(record.id)).to be false
        expect(CampaignTombstone.last).to have_attributes(campaign_id: campaign.id, record_type: model.name,
                                                          record_uuid: record.uuid)
      end

      it "returns 404 for a record from the user's other campaign" do
        elsewhere = create(factory, campaign: create(:campaign, user: user))

        delete "#{collection_path}/#{elsewhere.id}"

        expect(response).to have_http_status(:not_found)
        expect(model.exists?(elsewhere.id)).to be true
      end
    end
  end

  context "with another user's campaign" do
    let(:intruder) { create(:dungeon_master_user) }

    before do
      record
      stub_authentication(intruder)
    end

    it 'responds 404 to every action and changes nothing' do
      get collection_path
      expect(response).to have_http_status(:not_found)

      get record_path
      expect(response).to have_http_status(:not_found)

      expect do
        post collection_path, params: { root => valid_attributes }, as: :json
      end.not_to change(model, :count)
      expect(response).to have_http_status(:not_found)

      expect do
        patch record_path, params: { root => update_attributes }, as: :json
      end.not_to(change { record.reload.attributes })
      expect(response).to have_http_status(:not_found)

      delete record_path
      expect(response).to have_http_status(:not_found)
      expect(model.exists?(record.id)).to be true
    end

    it "does not find the campaign through the intruder's own campaign with the same slug" do
      mine = create(:campaign, user: intruder, name: campaign.name)
      expect(mine.slug).to eq(campaign.slug)

      get record_path

      expect(response).to have_http_status(:not_found)
    end
  end

  context 'when not authenticated' do
    before do
      record
      stub_no_auth
    end

    it 'responds 401 to every action and changes nothing' do
      get collection_path
      expect(response).to have_http_status(:unauthorized)

      get record_path
      expect(response).to have_http_status(:unauthorized)

      post collection_path, params: { root => valid_attributes }, as: :json
      expect(response).to have_http_status(:unauthorized)

      patch record_path, params: { root => update_attributes }, as: :json
      expect(response).to have_http_status(:unauthorized)

      delete record_path
      expect(response).to have_http_status(:unauthorized)

      expect(model.count).to eq(1)
    end
  end
end

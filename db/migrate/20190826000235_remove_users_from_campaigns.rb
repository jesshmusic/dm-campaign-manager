class RemoveUsersFromCampaigns < ActiveRecord::Migration[5.2]
  def change
    drop_table :campaign_users
  end
end

class ChangeCharactersToHasOneOfCampaigns < ActiveRecord::Migration[5.2]
  def change
    remove_reference :characters, :user
    add_reference :characters, :campaign, foreign_key: true
    drop_table :campaign_characters
  end
end

class CreateCampaignUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :campaign_users do |t|
      t.belongs_to :campaign, foreign_key: true
      t.belongs_to :user, foreign_key: true
      t.boolean :confirmed

      t.timestamps
    end
  end
end

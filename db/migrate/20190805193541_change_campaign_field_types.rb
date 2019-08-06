class ChangeCampaignFieldTypes < ActiveRecord::Migration[5.2]
  def change
    change_column :campaigns, :name, :string
    change_column :campaigns, :world, :string
  end
end

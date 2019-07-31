class CreateCampaigns < ActiveRecord::Migration[5.2]
  def change
    create_table :campaigns do |t|
      t.belongs_to :user, index: true
      t.text :name
      t.text :description
      t.text :world

      t.timestamps
    end
  end
end

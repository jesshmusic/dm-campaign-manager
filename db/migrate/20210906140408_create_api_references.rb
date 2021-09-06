class CreateApiReferences < ActiveRecord::Migration[6.1]
  def change
    create_table :api_references do |t|
      t.string :name
      t.string :slug
      t.string :api_url

      t.timestamps
    end
  end
end

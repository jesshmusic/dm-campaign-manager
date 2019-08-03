class ChangeMonsterCrToString < ActiveRecord::Migration[5.2]
  def change
    change_column :monsters, :challenge_rating, :string
  end
end

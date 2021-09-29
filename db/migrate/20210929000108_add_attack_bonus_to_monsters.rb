class AddAttackBonusToMonsters < ActiveRecord::Migration[6.1]
  def change
    add_column :monsters, :attack_bonus, :integer
    add_column :monsters, :xp, :integer
  end
end

class AddAttackBonusAndDamageBonusToItems < ActiveRecord::Migration[5.2]
  def change
    add_column :items, :weapon_attack_bonus, :integer
    add_column :items, :weapon_damage_bonus, :integer
  end
end

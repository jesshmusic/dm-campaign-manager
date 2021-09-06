class RemovePrimaryAndSavingThrowAbilities < ActiveRecord::Migration[6.1]
  def change
    remove_column :dnd_classes, :saving_throw_abilities
    remove_column :dnd_classes, :primary_abilities
  end
end

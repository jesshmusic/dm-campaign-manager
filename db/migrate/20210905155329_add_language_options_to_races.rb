class AddLanguageOptionsToRaces < ActiveRecord::Migration[6.1]
  def change
    add_column :races, :starting_languages, :integer
    add_column :races, :language_choices, :string, array: true, default: []
    add_column :races, :ability_bonus_options, :integer
    add_column :races, :ability_bonus_option_choices, :string, array: true, default: []
  end
end

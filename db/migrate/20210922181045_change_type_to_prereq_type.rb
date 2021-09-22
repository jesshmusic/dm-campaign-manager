class ChangeTypeToPrereqType < ActiveRecord::Migration[6.1]
  def change
    rename_column :multi_classing_prereq_options, :type, :prereq_type
  end
end

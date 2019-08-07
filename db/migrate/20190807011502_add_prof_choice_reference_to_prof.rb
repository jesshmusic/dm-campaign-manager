class AddProfChoiceReferenceToProf < ActiveRecord::Migration[5.2]
  def change
    add_reference :profs, :prof_choice, index: true
  end
end

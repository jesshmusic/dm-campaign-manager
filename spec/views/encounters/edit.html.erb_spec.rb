require 'rails_helper'

RSpec.describe "encounters/edit", type: :view do
  before(:each) do
    @encounter = assign(:encounter, Encounter.create!())
  end

  it "renders the edit encounter form" do
    render

    assert_select "form[action=?][method=?]", encounter_path(@encounter), "post" do
    end
  end
end

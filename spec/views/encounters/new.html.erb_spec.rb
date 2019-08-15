require 'rails_helper'

RSpec.describe "encounters/new", type: :view do
  before(:each) do
    assign(:encounter, Encounter.new())
  end

  it "renders new encounter form" do
    render

    assert_select "form[action=?][method=?]", encounters_path, "post" do
    end
  end
end

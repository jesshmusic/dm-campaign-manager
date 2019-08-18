require 'rails_helper'

RSpec.describe "encounters/index", type: :view do
  before(:each) do
    assign(:encounters, [
      Encounter.create!(),
      Encounter.create!()
    ])
  end

  it "renders a list of encounters" do
    render
  end
end

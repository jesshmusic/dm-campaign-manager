require 'rails_helper'

RSpec.describe "encounters/show", type: :view do
  before(:each) do
    @encounter = assign(:encounter, Encounter.create!())
  end

  it "renders attributes in <p>" do
    render
  end
end

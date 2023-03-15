require 'rails_helper'

RSpec.describe "rules/show", type: :view do
  before(:each) do
    @rule = assign(:rule, Rule.create!(
      name: "Name",
      description: "Description",
      slug: "Slug",
      string: "String"
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/Name/)
    expect(rendered).to match(/Description/)
    expect(rendered).to match(/Slug/)
    expect(rendered).to match(/String/)
  end
end

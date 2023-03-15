require 'rails_helper'

RSpec.describe "rules/index", type: :view do
  before(:each) do
    assign(:rules, [
      Rule.create!(
        name: "Name",
        description: "Description",
        slug: "Slug",
        string: "String"
      ),
      Rule.create!(
        name: "Name",
        description: "Description",
        slug: "Slug",
        string: "String"
      )
    ])
  end

  it "renders a list of rules" do
    render
    assert_select "tr>td", text: "Name".to_s, count: 2
    assert_select "tr>td", text: "Description".to_s, count: 2
    assert_select "tr>td", text: "Slug".to_s, count: 2
    assert_select "tr>td", text: "String".to_s, count: 2
  end
end

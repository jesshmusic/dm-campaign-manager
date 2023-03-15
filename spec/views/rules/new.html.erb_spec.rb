require 'rails_helper'

RSpec.describe "rules/new", type: :view do
  before(:each) do
    assign(:rule, Rule.new(
      name: "MyString",
      description: "MyString",
      slug: "MyString",
      string: "MyString"
    ))
  end

  it "renders new rule form" do
    render

    assert_select "form[action=?][method=?]", rules_path, "post" do

      assert_select "input[name=?]", "rule[name]"

      assert_select "input[name=?]", "rule[description]"

      assert_select "input[name=?]", "rule[slug]"

      assert_select "input[name=?]", "rule[string]"
    end
  end
end

require 'rails_helper'

RSpec.describe "rules/edit", type: :view do
  before(:each) do
    @rule = assign(:rule, Rule.create!(
      name: "MyString",
      description: "MyString",
      slug: "MyString",
      string: "MyString"
    ))
  end

  it "renders the edit rule form" do
    render

    assert_select "form[action=?][method=?]", rule_path(@rule), "post" do

      assert_select "input[name=?]", "rule[name]"

      assert_select "input[name=?]", "rule[description]"

      assert_select "input[name=?]", "rule[slug]"

      assert_select "input[name=?]", "rule[string]"
    end
  end
end

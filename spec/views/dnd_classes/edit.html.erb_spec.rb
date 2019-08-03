require 'rails_helper'

RSpec.describe "dnd_classes/edit", type: :view do
  before(:each) do
    @dnd_class = assign(:dnd_class, DndClass.create!(
      :name => "MyString",
      :hit_die => 1,
      :api_url => "MyString",
      :proficiencies => "MyString",
      :saving_throws => "MyString",
      :proficiency_choices => ""
    ))
  end

  it "renders the edit dnd_class form" do
    render

    assert_select "form[action=?][method=?]", dnd_class_path(@dnd_class), "post" do

      assert_select "input[name=?]", "dnd_class[name]"

      assert_select "input[name=?]", "dnd_class[hit_die]"

      assert_select "input[name=?]", "dnd_class[api_url]"

      assert_select "input[name=?]", "dnd_class[proficiencies]"

      assert_select "input[name=?]", "dnd_class[saving_throws]"

      assert_select "input[name=?]", "dnd_class[proficiency_choices]"
    end
  end
end

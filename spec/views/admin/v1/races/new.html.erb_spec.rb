require 'rails_helper'

RSpec.describe "admin/v1/races/new", type: :view do
  before(:each) do
    assign(:race, Race.new(
      :name => "MyString",
      :speed => "MyString",
      :strength_modifier => 1,
      :dexterity_modifier => 1,
      :constitution_modifier => 1,
      :intelligence_modifier => 1,
      :wisdom_modifier => 1,
      :charisma_modifier => 1
    ))
  end

  it "renders new race form" do
    render

    assert_select "form[action=?][method=?]", races_path, "post" do

      assert_select "input[name=?]", "race[name]"

      assert_select "input[name=?]", "race[speed]"

      assert_select "input[name=?]", "race[strength_modifier]"

      assert_select "input[name=?]", "race[dexterity_modifier]"

      assert_select "input[name=?]", "race[constitution_modifier]"

      assert_select "input[name=?]", "race[intelligence_modifier]"

      assert_select "input[name=?]", "race[wisdom_modifier]"

      assert_select "input[name=?]", "race[charisma_modifier]"
    end
  end
end

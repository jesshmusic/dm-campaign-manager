require 'rails_helper'

RSpec.describe "spells/new", type: :view do
  before(:each) do
    assign(:spell, Spell.new(
      :name => "MyText",
      :description => "MyText",
      :higher_level => "MyText",
      :page => "MyText",
      :range => "MyText",
      :components => "MyText",
      :material => "MyText",
      :ritual => false,
      :duration => "MyText",
      :concentration => false,
      :casting_time => "MyString",
      :level => 1
    ))
  end

  it "renders new spell form" do
    render

    assert_select "form[action=?][method=?]", v1_spells_path, "post" do

      assert_select "textarea[name=?]", "spell[name]"

      assert_select "textarea[name=?]", "spell[description]"

      assert_select "textarea[name=?]", "spell[higher_level]"

      assert_select "textarea[name=?]", "spell[page]"

      assert_select "textarea[name=?]", "spell[range]"

      assert_select "textarea[name=?]", "spell[components]"

      assert_select "textarea[name=?]", "spell[material]"

      assert_select "input[name=?]", "spell[ritual]"

      assert_select "textarea[name=?]", "spell[duration]"

      assert_select "input[name=?]", "spell[concentration]"

      assert_select "input[name=?]", "spell[casting_time]"

      assert_select "input[name=?]", "spell[level]"
    end
  end
end

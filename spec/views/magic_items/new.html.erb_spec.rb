require 'rails_helper'

RSpec.describe "magic_items/new", type: :view do
  before(:each) do
    assign(:magic_item, MagicItem.new(
      :name => "MyString",
      :type => "",
      :description => "MyText",
      :rarity => "MyString",
      :requires_attunement => false
    ))
  end

  it "renders new magic_item form" do
    render

    assert_select "form[action=?][method=?]", magic_items_path, "post" do

      assert_select "input[name=?]", "magic_item[name]"

      assert_select "input[name=?]", "magic_item[type]"

      assert_select "textarea[name=?]", "magic_item[description]"

      assert_select "input[name=?]", "magic_item[rarity]"

      assert_select "input[name=?]", "magic_item[requires_attunement]"
    end
  end
end

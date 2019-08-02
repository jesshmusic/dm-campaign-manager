require 'rails_helper'

RSpec.describe "magic_items/edit", type: :view do
  before(:each) do
    @magic_item = assign(:magic_item, MagicItem.create!(
      :name => "MyString",
      :type => "",
      :description => "MyText",
      :rarity => "MyString",
      :requires_attunement => false
    ))
  end

  it "renders the edit magic_item form" do
    render

    assert_select "form[action=?][method=?]", magic_item_path(@magic_item), "post" do

      assert_select "input[name=?]", "magic_item[name]"

      assert_select "input[name=?]", "magic_item[type]"

      assert_select "textarea[name=?]", "magic_item[description]"

      assert_select "input[name=?]", "magic_item[rarity]"

      assert_select "input[name=?]", "magic_item[requires_attunement]"
    end
  end
end

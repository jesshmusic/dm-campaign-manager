require 'rails_helper'

RSpec.describe "items/edit", type: :view do
  before(:each) do
    @item = assign(:item, Item.create!(
      :api_url => "MyString",
      :armor_class => 1,
      :armor_dex_bonus => false,
      :armor_max_bonus => 1,
      :armor_stealth_disadvantage => false,
      :armor_str_minimum => 1,
      :category => "MyString",
      :category_range => "MyString",
      :cost_unit => "MyString",
      :cost_value => 1,
      :description => "MyText",
      :name => "MyString",
      :quantity => 1,
      :sub_category => "MyString",
      :vehicle_capacity => "MyString",
      :vehicle_speed => 1,
      :vehicle_speed_unit => "MyString",
      :weapon_2h_damage_dice_count => 1,
      :weapon_2h_damage_dice_value => 1,
      :weapon_2h_damage_type => "MyString",
      :weapon_damage_dice_count => 1,
      :weapon_damage_dice_value => 1,
      :weapon_damage_type => "MyString",
      :weapon_properties => "MyString",
      :weapon_range => "MyString",
      :weapon_range_long => 1,
      :weapon_range_normal => 1,
      :weapon_thrown_range_long => 1,
      :weapon_thrown_range_normal => 1,
      :weight => 1
    ))
  end

  it "renders the edit item form" do
    render

    assert_select "form[action=?][method=?]", item_path(@item), "post" do

      assert_select "input[name=?]", "item[api_url]"

      assert_select "input[name=?]", "item[armor_class]"

      assert_select "input[name=?]", "item[armor_dex_bonus]"

      assert_select "input[name=?]", "item[armor_max_bonus]"

      assert_select "input[name=?]", "item[armor_stealth_disadvantage]"

      assert_select "input[name=?]", "item[armor_str_minimum]"

      assert_select "input[name=?]", "item[category]"

      assert_select "input[name=?]", "item[category_range]"

      assert_select "input[name=?]", "item[cost_unit]"

      assert_select "input[name=?]", "item[cost_value]"

      assert_select "textarea[name=?]", "item[description]"

      assert_select "input[name=?]", "item[name]"

      assert_select "input[name=?]", "item[quantity]"

      assert_select "input[name=?]", "item[sub_category]"

      assert_select "input[name=?]", "item[vehicle_capacity]"

      assert_select "input[name=?]", "item[vehicle_speed]"

      assert_select "input[name=?]", "item[vehicle_speed_unit]"

      assert_select "input[name=?]", "item[weapon_2h_damage_dice_count]"

      assert_select "input[name=?]", "item[weapon_2h_damage_dice_value]"

      assert_select "input[name=?]", "item[weapon_2h_damage_type]"

      assert_select "input[name=?]", "item[weapon_damage_dice_count]"

      assert_select "input[name=?]", "item[weapon_damage_dice_value]"

      assert_select "input[name=?]", "item[weapon_damage_type]"

      assert_select "input[name=?]", "item[weapon_properties]"

      assert_select "input[name=?]", "item[weapon_range]"

      assert_select "input[name=?]", "item[weapon_range_long]"

      assert_select "input[name=?]", "item[weapon_range_normal]"

      assert_select "input[name=?]", "item[weapon_thrown_range_long]"

      assert_select "input[name=?]", "item[weapon_thrown_range_normal]"

      assert_select "input[name=?]", "item[weight]"
    end
  end
end

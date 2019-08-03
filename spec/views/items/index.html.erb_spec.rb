require 'rails_helper'

RSpec.describe "items/index", type: :view do
  before(:each) do
    assign(:items, [
      Item.create!(
        :api_url => "Api Url",
        :armor_class => 2,
        :armor_dex_bonus => false,
        :armor_max_bonus => 3,
        :armor_stealth_disadvantage => false,
        :armor_str_minimum => 4,
        :category => "Category",
        :category_range => "Category Range",
        :cost_unit => "Cost Unit",
        :cost_value => 5,
        :description => "MyText",
        :name => "Name",
        :quantity => 6,
        :sub_category => "Sub Category",
        :vehicle_capacity => "Vehicle Capacity",
        :vehicle_speed => 7,
        :vehicle_speed_unit => "Vehicle Speed Unit",
        :weapon_2h_damage_dice_count => 8,
        :weapon_2h_damage_dice_value => 9,
        :weapon_2h_damage_type => "Weapon 2h Damage Type",
        :weapon_damage_dice_count => 10,
        :weapon_damage_dice_value => 11,
        :weapon_damage_type => "Weapon Damage Type",
        :weapon_properties => "Weapon Properties",
        :weapon_range => "Weapon Range",
        :weapon_range_long => 12,
        :weapon_range_normal => 13,
        :weapon_thrown_range_long => 14,
        :weapon_thrown_range_normal => 15,
        :weight => 16
      ),
      Item.create!(
        :api_url => "Api Url",
        :armor_class => 2,
        :armor_dex_bonus => false,
        :armor_max_bonus => 3,
        :armor_stealth_disadvantage => false,
        :armor_str_minimum => 4,
        :category => "Category",
        :category_range => "Category Range",
        :cost_unit => "Cost Unit",
        :cost_value => 5,
        :description => "MyText",
        :name => "Name",
        :quantity => 6,
        :sub_category => "Sub Category",
        :vehicle_capacity => "Vehicle Capacity",
        :vehicle_speed => 7,
        :vehicle_speed_unit => "Vehicle Speed Unit",
        :weapon_2h_damage_dice_count => 8,
        :weapon_2h_damage_dice_value => 9,
        :weapon_2h_damage_type => "Weapon 2h Damage Type",
        :weapon_damage_dice_count => 10,
        :weapon_damage_dice_value => 11,
        :weapon_damage_type => "Weapon Damage Type",
        :weapon_properties => "Weapon Properties",
        :weapon_range => "Weapon Range",
        :weapon_range_long => 12,
        :weapon_range_normal => 13,
        :weapon_thrown_range_long => 14,
        :weapon_thrown_range_normal => 15,
        :weight => 16
      )
    ])
  end

  it "renders a list of items" do
    render
    assert_select "tr>td", :text => "Api Url".to_s, :count => 2
    assert_select "tr>td", :text => 2.to_s, :count => 2
    assert_select "tr>td", :text => false.to_s, :count => 2
    assert_select "tr>td", :text => 3.to_s, :count => 2
    assert_select "tr>td", :text => false.to_s, :count => 2
    assert_select "tr>td", :text => 4.to_s, :count => 2
    assert_select "tr>td", :text => "Category".to_s, :count => 2
    assert_select "tr>td", :text => "Category Range".to_s, :count => 2
    assert_select "tr>td", :text => "Cost Unit".to_s, :count => 2
    assert_select "tr>td", :text => 5.to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => "Name".to_s, :count => 2
    assert_select "tr>td", :text => 6.to_s, :count => 2
    assert_select "tr>td", :text => "Sub Category".to_s, :count => 2
    assert_select "tr>td", :text => "Vehicle Capacity".to_s, :count => 2
    assert_select "tr>td", :text => 7.to_s, :count => 2
    assert_select "tr>td", :text => "Vehicle Speed Unit".to_s, :count => 2
    assert_select "tr>td", :text => 8.to_s, :count => 2
    assert_select "tr>td", :text => 9.to_s, :count => 2
    assert_select "tr>td", :text => "Weapon 2h Damage Type".to_s, :count => 2
    assert_select "tr>td", :text => 10.to_s, :count => 2
    assert_select "tr>td", :text => 11.to_s, :count => 2
    assert_select "tr>td", :text => "Weapon Damage Type".to_s, :count => 2
    assert_select "tr>td", :text => "Weapon Properties".to_s, :count => 2
    assert_select "tr>td", :text => "Weapon Range".to_s, :count => 2
    assert_select "tr>td", :text => 12.to_s, :count => 2
    assert_select "tr>td", :text => 13.to_s, :count => 2
    assert_select "tr>td", :text => 14.to_s, :count => 2
    assert_select "tr>td", :text => 15.to_s, :count => 2
    assert_select "tr>td", :text => 16.to_s, :count => 2
  end
end

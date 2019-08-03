require 'rails_helper'

RSpec.describe "items/show", type: :view do
  before(:each) do
    @item = assign(:item, Item.create!(
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
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/Api Url/)
    expect(rendered).to match(/2/)
    expect(rendered).to match(/false/)
    expect(rendered).to match(/3/)
    expect(rendered).to match(/false/)
    expect(rendered).to match(/4/)
    expect(rendered).to match(/Category/)
    expect(rendered).to match(/Category Range/)
    expect(rendered).to match(/Cost Unit/)
    expect(rendered).to match(/5/)
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/Name/)
    expect(rendered).to match(/6/)
    expect(rendered).to match(/Sub Category/)
    expect(rendered).to match(/Vehicle Capacity/)
    expect(rendered).to match(/7/)
    expect(rendered).to match(/Vehicle Speed Unit/)
    expect(rendered).to match(/8/)
    expect(rendered).to match(/9/)
    expect(rendered).to match(/Weapon 2h Damage Type/)
    expect(rendered).to match(/10/)
    expect(rendered).to match(/11/)
    expect(rendered).to match(/Weapon Damage Type/)
    expect(rendered).to match(/Weapon Properties/)
    expect(rendered).to match(/Weapon Range/)
    expect(rendered).to match(/12/)
    expect(rendered).to match(/13/)
    expect(rendered).to match(/14/)
    expect(rendered).to match(/15/)
    expect(rendered).to match(/16/)
  end
end

require 'rails_helper'

RSpec.describe "monsters/new", type: :view do
  before(:each) do
    assign(:monster, Monster.new(
      :name => "MyString",
      :size => "MyString",
      :type => "",
      :subtype => "MyString",
      :alignment => "MyString",
      :armor_class => 1,
      :hit_points => 1,
      :hit_dice => "MyString",
      :speed => "MyString",
      :strength => 1,
      :dexterity => 1,
      :constitution => 1,
      :intelligence => 1,
      :wisdom => 1,
      :charisma => 1,
      :damage_vulnerabilities => "MyString",
      :damage_resistances => "MyString",
      :damage_immunities => "MyString",
      :condition_immunities => "MyString",
      :senses => "MyString",
      :languages => "MyString",
      :challenge_rating => 1,
      :api_url => "MyString"
    ))
  end

  it "renders new monster form" do
    render

    assert_select "form[action=?][method=?]", monsters_path, "post" do

      assert_select "input[name=?]", "monster[name]"

      assert_select "input[name=?]", "monster[size]"

      assert_select "input[name=?]", "monster[type]"

      assert_select "input[name=?]", "monster[subtype]"

      assert_select "input[name=?]", "monster[alignment]"

      assert_select "input[name=?]", "monster[armor_class]"

      assert_select "input[name=?]", "monster[hit_points]"

      assert_select "input[name=?]", "monster[hit_dice]"

      assert_select "input[name=?]", "monster[speed]"

      assert_select "input[name=?]", "monster[strength]"

      assert_select "input[name=?]", "monster[dexterity]"

      assert_select "input[name=?]", "monster[constitution]"

      assert_select "input[name=?]", "monster[intelligence]"

      assert_select "input[name=?]", "monster[wisdom]"

      assert_select "input[name=?]", "monster[charisma]"

      assert_select "input[name=?]", "monster[damage_vulnerabilities]"

      assert_select "input[name=?]", "monster[damage_resistances]"

      assert_select "input[name=?]", "monster[damage_immunities]"

      assert_select "input[name=?]", "monster[condition_immunities]"

      assert_select "input[name=?]", "monster[senses]"

      assert_select "input[name=?]", "monster[languages]"

      assert_select "input[name=?]", "monster[challenge_rating]"

      assert_select "input[name=?]", "monster[api_url]"
    end
  end
end

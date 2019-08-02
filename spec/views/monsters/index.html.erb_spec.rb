require 'rails_helper'

RSpec.describe "monsters/index", type: :view do
  before(:each) do
    assign(:monsters, [
      Monster.create!(
        :name => "Name",
        :size => "Size",
        :type => "Type",
        :subtype => "Subtype",
        :alignment => "Alignment",
        :armor_class => 2,
        :hit_points => 3,
        :hit_dice => "Hit Dice",
        :speed => "Speed",
        :strength => 4,
        :dexterity => 5,
        :constitution => 6,
        :intelligence => 7,
        :wisdom => 8,
        :charisma => 9,
        :damage_vulnerabilities => "Damage Vulnerabilities",
        :damage_resistances => "Damage Resistances",
        :damage_immunities => "Damage Immunities",
        :condition_immunities => "Condition Immunities",
        :senses => "Senses",
        :languages => "Languages",
        :challenge_rating => 10,
        :api_url => "Api Url"
      ),
      Monster.create!(
        :name => "Name",
        :size => "Size",
        :type => "Type",
        :subtype => "Subtype",
        :alignment => "Alignment",
        :armor_class => 2,
        :hit_points => 3,
        :hit_dice => "Hit Dice",
        :speed => "Speed",
        :strength => 4,
        :dexterity => 5,
        :constitution => 6,
        :intelligence => 7,
        :wisdom => 8,
        :charisma => 9,
        :damage_vulnerabilities => "Damage Vulnerabilities",
        :damage_resistances => "Damage Resistances",
        :damage_immunities => "Damage Immunities",
        :condition_immunities => "Condition Immunities",
        :senses => "Senses",
        :languages => "Languages",
        :challenge_rating => 10,
        :api_url => "Api Url"
      )
    ])
  end

  it "renders a list of monsters" do
    render
    assert_select "tr>td", :text => "Name".to_s, :count => 2
    assert_select "tr>td", :text => "Size".to_s, :count => 2
    assert_select "tr>td", :text => "Type".to_s, :count => 2
    assert_select "tr>td", :text => "Subtype".to_s, :count => 2
    assert_select "tr>td", :text => "Alignment".to_s, :count => 2
    assert_select "tr>td", :text => 2.to_s, :count => 2
    assert_select "tr>td", :text => 3.to_s, :count => 2
    assert_select "tr>td", :text => "Hit Dice".to_s, :count => 2
    assert_select "tr>td", :text => "Speed".to_s, :count => 2
    assert_select "tr>td", :text => 4.to_s, :count => 2
    assert_select "tr>td", :text => 5.to_s, :count => 2
    assert_select "tr>td", :text => 6.to_s, :count => 2
    assert_select "tr>td", :text => 7.to_s, :count => 2
    assert_select "tr>td", :text => 8.to_s, :count => 2
    assert_select "tr>td", :text => 9.to_s, :count => 2
    assert_select "tr>td", :text => "Damage Vulnerabilities".to_s, :count => 2
    assert_select "tr>td", :text => "Damage Resistances".to_s, :count => 2
    assert_select "tr>td", :text => "Damage Immunities".to_s, :count => 2
    assert_select "tr>td", :text => "Condition Immunities".to_s, :count => 2
    assert_select "tr>td", :text => "Senses".to_s, :count => 2
    assert_select "tr>td", :text => "Languages".to_s, :count => 2
    assert_select "tr>td", :text => 10.to_s, :count => 2
    assert_select "tr>td", :text => "Api Url".to_s, :count => 2
  end
end

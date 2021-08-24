require 'rails_helper'

RSpec.describe "admin/v1/monsters/show", type: :view do
  before(:each) do
    @monster = assign(:monster, Monster.create!(
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
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/Name/)
    expect(rendered).to match(/Size/)
    expect(rendered).to match(/Type/)
    expect(rendered).to match(/Subtype/)
    expect(rendered).to match(/Alignment/)
    expect(rendered).to match(/2/)
    expect(rendered).to match(/3/)
    expect(rendered).to match(/Hit Dice/)
    expect(rendered).to match(/Speed/)
    expect(rendered).to match(/4/)
    expect(rendered).to match(/5/)
    expect(rendered).to match(/6/)
    expect(rendered).to match(/7/)
    expect(rendered).to match(/8/)
    expect(rendered).to match(/9/)
    expect(rendered).to match(/Damage Vulnerabilities/)
    expect(rendered).to match(/Damage Resistances/)
    expect(rendered).to match(/Damage Immunities/)
    expect(rendered).to match(/Condition Immunities/)
    expect(rendered).to match(/Senses/)
    expect(rendered).to match(/Languages/)
    expect(rendered).to match(/10/)
    expect(rendered).to match(/Api Url/)
  end
end

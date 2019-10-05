require 'rails_helper'

RSpec.describe "races/index", type: :view do
  before(:each) do
    assign(:races, [
      Race.create!(
        :name => "Name",
        :speed => "Speed",
        :strength_modifier => 2,
        :dexterity_modifier => 3,
        :constitution_modifier => 4,
        :intelligence_modifier => 5,
        :wisdom_modifier => 6,
        :charisma_modifier => 7
      ),
      Race.create!(
        :name => "Name",
        :speed => "Speed",
        :strength_modifier => 2,
        :dexterity_modifier => 3,
        :constitution_modifier => 4,
        :intelligence_modifier => 5,
        :wisdom_modifier => 6,
        :charisma_modifier => 7
      )
    ])
  end

  it "renders a list of races" do
    render
    assert_select "tr>td", :text => "Name".to_s, :count => 2
    assert_select "tr>td", :text => "Speed".to_s, :count => 2
    assert_select "tr>td", :text => 2.to_s, :count => 2
    assert_select "tr>td", :text => 3.to_s, :count => 2
    assert_select "tr>td", :text => 4.to_s, :count => 2
    assert_select "tr>td", :text => 5.to_s, :count => 2
    assert_select "tr>td", :text => 6.to_s, :count => 2
    assert_select "tr>td", :text => 7.to_s, :count => 2
  end
end

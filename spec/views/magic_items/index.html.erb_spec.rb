require 'rails_helper'

RSpec.describe "magic_items/index", type: :view do
  before(:each) do
    assign(:magic_items, [
      MagicItem.create!(
        :name => "Name",
        :type => "Type",
        :description => "MyText",
        :rarity => "Rarity",
        :requires_attunement => false
      ),
      MagicItem.create!(
        :name => "Name",
        :type => "Type",
        :description => "MyText",
        :rarity => "Rarity",
        :requires_attunement => false
      )
    ])
  end

  it "renders a list of magic_items" do
    render
    assert_select "tr>td", :text => "Name".to_s, :count => 2
    assert_select "tr>td", :text => "Type".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => "Rarity".to_s, :count => 2
    assert_select "tr>td", :text => false.to_s, :count => 2
  end
end

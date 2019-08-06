require 'rails_helper'

RSpec.describe "treasures/index", type: :view do
  before(:each) do
    assign(:treasures, [
      Treasure.create!(
        :name => "Name",
        :copper_pieces => 2,
        :silver_pieces => 3,
        :gold_pieces => 4,
        :platinum_pieces => 5,
        :slug => "Slug"
      ),
      Treasure.create!(
        :name => "Name",
        :copper_pieces => 2,
        :silver_pieces => 3,
        :gold_pieces => 4,
        :platinum_pieces => 5,
        :slug => "Slug"
      )
    ])
  end

  it "renders a list of treasures" do
    render
    assert_select "tr>td", :text => "Name".to_s, :count => 2
    assert_select "tr>td", :text => 2.to_s, :count => 2
    assert_select "tr>td", :text => 3.to_s, :count => 2
    assert_select "tr>td", :text => 4.to_s, :count => 2
    assert_select "tr>td", :text => 5.to_s, :count => 2
    assert_select "tr>td", :text => "Slug".to_s, :count => 2
  end
end

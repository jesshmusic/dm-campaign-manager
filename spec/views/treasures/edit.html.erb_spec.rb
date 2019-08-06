require 'rails_helper'

RSpec.describe "treasures/edit", type: :view do
  before(:each) do
    @treasure = assign(:treasure, Treasure.create!(
      :name => "MyString",
      :copper_pieces => 1,
      :silver_pieces => 1,
      :gold_pieces => 1,
      :platinum_pieces => 1,
      :slug => "MyString"
    ))
  end

  it "renders the edit treasure form" do
    render

    assert_select "form[action=?][method=?]", treasure_path(@treasure), "post" do

      assert_select "input[name=?]", "treasure[name]"

      assert_select "input[name=?]", "treasure[copper_pieces]"

      assert_select "input[name=?]", "treasure[silver_pieces]"

      assert_select "input[name=?]", "treasure[gold_pieces]"

      assert_select "input[name=?]", "treasure[platinum_pieces]"

      assert_select "input[name=?]", "treasure[slug]"
    end
  end
end

require 'rails_helper'

RSpec.describe "treasures/new", type: :view do
  before(:each) do
    assign(:treasure, Treasure.new(
      :name => "MyString",
      :copper_pieces => 1,
      :silver_pieces => 1,
      :gold_pieces => 1,
      :platinum_pieces => 1,
      :slug => "MyString"
    ))
  end

  it "renders new treasure form" do
    render

    assert_select "form[action=?][method=?]", treasures_path, "post" do

      assert_select "input[name=?]", "treasure[name]"

      assert_select "input[name=?]", "treasure[copper_pieces]"

      assert_select "input[name=?]", "treasure[silver_pieces]"

      assert_select "input[name=?]", "treasure[gold_pieces]"

      assert_select "input[name=?]", "treasure[platinum_pieces]"

      assert_select "input[name=?]", "treasure[slug]"
    end
  end
end

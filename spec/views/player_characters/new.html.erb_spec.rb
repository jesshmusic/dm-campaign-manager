require 'rails_helper'

RSpec.describe "player_characters/new", type: :view do
  before(:each) do
    assign(:player_character, PlayerCharacter.new(
      :name => "MyString",
      :description => "MyText",
      :slug => "MyString"
    ))
  end

  it "renders new player_character form" do
    render

    assert_select "form[action=?][method=?]", player_characters_path, "post" do

      assert_select "input[name=?]", "player_character[name]"

      assert_select "textarea[name=?]", "player_character[description]"

      assert_select "input[name=?]", "player_character[slug]"
    end
  end
end

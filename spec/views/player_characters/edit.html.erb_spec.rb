require 'rails_helper'

RSpec.describe "player_characters/edit", type: :view do
  before(:each) do
    @player_character = assign(:player_character, PlayerCharacter.create!(
      :name => "MyString",
      :description => "MyText",
      :slug => "MyString"
    ))
  end

  it "renders the edit player_character form" do
    render

    assert_select "form[action=?][method=?]", player_character_path(@player_character), "post" do

      assert_select "input[name=?]", "player_character[name]"

      assert_select "textarea[name=?]", "player_character[description]"

      assert_select "input[name=?]", "player_character[slug]"
    end
  end
end

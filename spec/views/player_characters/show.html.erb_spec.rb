require 'rails_helper'

RSpec.describe "player_characters/show", type: :view do
  before(:each) do
    @player_character = assign(:player_character, PlayerCharacter.create!(
      :name => "Name",
      :description => "MyText",
      :slug => "Slug"
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/Name/)
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/Slug/)
  end
end

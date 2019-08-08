require 'rails_helper'

RSpec.describe "player_characters/index", type: :view do
  before(:each) do
    assign(:player_characters, [
      PlayerCharacter.create!(
        :name => "Name",
        :description => "MyText",
        :slug => "Slug"
      ),
      PlayerCharacter.create!(
        :name => "Name",
        :description => "MyText",
        :slug => "Slug"
      )
    ])
  end

  it "renders a list of player_characters" do
    render
    assert_select "tr>td", :text => "Name".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => "Slug".to_s, :count => 2
  end
end

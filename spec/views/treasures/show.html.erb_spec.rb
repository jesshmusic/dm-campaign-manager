require 'rails_helper'

RSpec.describe "treasures/show", type: :view do
  before(:each) do
    @treasure = assign(:treasure, Treasure.create!(
      :name => "Name",
      :copper_pieces => 2,
      :silver_pieces => 3,
      :gold_pieces => 4,
      :platinum_pieces => 5,
      :slug => "Slug"
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/Name/)
    expect(rendered).to match(/2/)
    expect(rendered).to match(/3/)
    expect(rendered).to match(/4/)
    expect(rendered).to match(/5/)
    expect(rendered).to match(/Slug/)
  end
end

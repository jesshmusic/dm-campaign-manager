require 'rails_helper'

RSpec.describe "magic_items/show", type: :view do
  before(:each) do
    @magic_item = assign(:magic_item, MagicItem.create!(
      :name => "Name",
      :type => "Type",
      :description => "MyText",
      :rarity => "Rarity",
      :requires_attunement => false
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/Name/)
    expect(rendered).to match(/Type/)
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/Rarity/)
    expect(rendered).to match(/false/)
  end
end

require 'rails_helper'

RSpec.describe "races/show", type: :view do
  before(:each) do
    @race = assign(:race, Race.create!(
      :name => "Name",
      :speed => "Speed",
      :strength_modifier => 2,
      :dexterity_modifier => 3,
      :constitution_modifier => 4,
      :intelligence_modifier => 5,
      :wisdom_modifier => 6,
      :charisma_modifier => 7
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/Name/)
    expect(rendered).to match(/Speed/)
    expect(rendered).to match(/2/)
    expect(rendered).to match(/3/)
    expect(rendered).to match(/4/)
    expect(rendered).to match(/5/)
    expect(rendered).to match(/6/)
    expect(rendered).to match(/7/)
  end
end

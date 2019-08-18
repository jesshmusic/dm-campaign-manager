require 'rails_helper'

RSpec.describe "spells/show", type: :view do
  before(:each) do
    @spell = assign(:spell, Spell.create!(
      :name => "MyText",
      :description => "MyText",
      :higher_level => "MyText",
      :page => "MyText",
      :range => "MyText",
      :components => "MyText",
      :material => "MyText",
      :ritual => false,
      :duration => "MyText",
      :concentration => false,
      :casting_time => "Casting Time",
      :level => 2
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/false/)
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/false/)
    expect(rendered).to match(/Casting Time/)
    expect(rendered).to match(/2/)
  end
end

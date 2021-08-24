require 'rails_helper'

RSpec.describe "admin/v1/dnd_classes/show", type: :view do
  before(:each) do
    @dnd_class = assign(:dnd_class, DndClass.create!(
      :name => "Name",
      :hit_die => 2,
      :api_url => "Api Url",
      :slug => "name-12",
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/Name/)
    expect(rendered).to match(/2/)
    expect(rendered).to match(/Api Url/)
    expect(rendered).to match(/Proficiencies/)
    expect(rendered).to match(/Saving Throws/)
    expect(rendered).to match(//)
  end
end

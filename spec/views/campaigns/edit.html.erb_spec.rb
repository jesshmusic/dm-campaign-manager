require 'rails_helper'

RSpec.describe "campaigns/edit", type: :view do
  before(:each) do
    @campaign = assign(:campaign, Campaign.create!(
      :name => "MyText",
      :description => "MyText",
      :world => "MyText"
    ))
  end

  it "renders the edit campaign form" do
    render

    assert_select "form[action=?][method=?]", campaign_path(@campaign), "post" do

      assert_select "textarea[name=?]", "campaign[name]"

      assert_select "textarea[name=?]", "campaign[description]"

      assert_select "textarea[name=?]", "campaign[world]"
    end
  end
end

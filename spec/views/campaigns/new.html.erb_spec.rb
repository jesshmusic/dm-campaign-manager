require 'rails_helper'

RSpec.describe "campaigns/new", type: :view do
  before(:each) do
    assign(:campaign, Campaign.new(
      :name => "MyText",
      :description => "MyText",
      :world => "MyText"
    ))
  end

  it "renders new campaign form" do
    render

    assert_select "form[action=?][method=?]", campaigns_path, "post" do

      assert_select "textarea[name=?]", "campaign[name]"

      assert_select "textarea[name=?]", "campaign[description]"

      assert_select "textarea[name=?]", "campaign[world]"
    end
  end
end

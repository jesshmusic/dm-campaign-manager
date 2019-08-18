require 'rails_helper'

RSpec.describe "adventures/edit", type: :view do
  before(:each) do
    @adventure = assign(:adventure, Adventure.create!(
      :name => "MyString",
      :description => "MyText",
      :campaign => nil
    ))
  end

  it "renders the edit adventure form" do
    render

    assert_select "form[action=?][method=?]", adventure_path(@adventure), "post" do

      assert_select "input[name=?]", "adventure[name]"

      assert_select "textarea[name=?]", "adventure[description]"

      assert_select "input[name=?]", "adventure[campaign_id]"
    end
  end
end

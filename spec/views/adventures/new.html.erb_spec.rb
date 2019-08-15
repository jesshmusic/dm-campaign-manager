require 'rails_helper'

RSpec.describe "adventures/new", type: :view do
  before(:each) do
    assign(:adventure, Adventure.new(
      :name => "MyString",
      :description => "MyText",
      :campaign => nil
    ))
  end

  it "renders new adventure form" do
    render

    assert_select "form[action=?][method=?]", adventures_path, "post" do

      assert_select "input[name=?]", "adventure[name]"

      assert_select "textarea[name=?]", "adventure[description]"

      assert_select "input[name=?]", "adventure[campaign_id]"
    end
  end
end

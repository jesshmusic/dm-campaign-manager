require 'rails_helper'

RSpec.describe "guilds/new", type: :view do
  before(:each) do
    assign(:guild, Guild.new(
      :name => "MyString",
      :description => "MyText",
      :campaign => nil
    ))
  end

  it "renders new guild form" do
    render

    assert_select "form[action=?][method=?]", guilds_path, "post" do

      assert_select "input[name=?]", "guild[name]"

      assert_select "textarea[name=?]", "guild[description]"

      assert_select "input[name=?]", "guild[campaign_id]"
    end
  end
end

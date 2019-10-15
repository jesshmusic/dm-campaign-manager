require 'rails_helper'

RSpec.describe "guilds/edit", type: :view do
  before(:each) do
    @guild = assign(:guild, Guild.create!(
      :name => "MyString",
      :description => "MyText",
      :campaign => nil
    ))
  end

  it "renders the edit guild form" do
    render

    assert_select "form[action=?][method=?]", guild_path(@guild), "post" do

      assert_select "input[name=?]", "guild[name]"

      assert_select "textarea[name=?]", "guild[description]"

      assert_select "input[name=?]", "guild[campaign_id]"
    end
  end
end

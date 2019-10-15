require 'rails_helper'

RSpec.describe "guilds/index", type: :view do
  before(:each) do
    assign(:guilds, [
      Guild.create!(
        :name => "Name",
        :description => "MyText",
        :campaign => nil
      ),
      Guild.create!(
        :name => "Name",
        :description => "MyText",
        :campaign => nil
      )
    ])
  end

  it "renders a list of guilds" do
    render
    assert_select "tr>td", :text => "Name".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => nil.to_s, :count => 2
  end
end

require 'rails_helper'

RSpec.describe "adventures/index", type: :view do
  before(:each) do
    assign(:adventures, [
      Adventure.create!(
        :name => "Name",
        :description => "MyText",
        :campaign => nil
      ),
      Adventure.create!(
        :name => "Name",
        :description => "MyText",
        :campaign => nil
      )
    ])
  end

  it "renders a list of adventures" do
    render
    assert_select "tr>td", :text => "Name".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => nil.to_s, :count => 2
  end
end

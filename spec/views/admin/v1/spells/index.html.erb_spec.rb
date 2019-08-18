require 'rails_helper'

RSpec.describe "spells/index", type: :view do
  before(:each) do
    assign(:spells, [
      Spell.create!(
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
      ),
      Spell.create!(
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
      )
    ])
  end

  it "renders a list of spells" do
    render
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => false.to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => false.to_s, :count => 2
    assert_select "tr>td", :text => "Casting Time".to_s, :count => 2
    assert_select "tr>td", :text => 2.to_s, :count => 2
  end
end

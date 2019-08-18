require 'rails_helper'

RSpec.describe "dnd_classes/index", type: :view do
  before(:each) do
    assign(:dnd_classes, [
      DndClass.create!(
        :name => "Name",
        :hit_die => 2,
        :api_url => "Api Url",
        :proficiencies => "Proficiencies",
        :saving_throws => "Saving Throws",
        :proficiency_choices => ""
      ),
      DndClass.create!(
        :name => "Name",
        :hit_die => 2,
        :api_url => "Api Url",
        :proficiencies => "Proficiencies",
        :saving_throws => "Saving Throws",
        :proficiency_choices => ""
      )
    ])
  end

  it "renders a list of dnd_classes" do
    render
    assert_select "tr>td", :text => "Name".to_s, :count => 2
    assert_select "tr>td", :text => 2.to_s, :count => 2
    assert_select "tr>td", :text => "Api Url".to_s, :count => 2
    assert_select "tr>td", :text => "Proficiencies".to_s, :count => 2
    assert_select "tr>td", :text => "Saving Throws".to_s, :count => 2
    assert_select "tr>td", :text => "".to_s, :count => 2
  end
end

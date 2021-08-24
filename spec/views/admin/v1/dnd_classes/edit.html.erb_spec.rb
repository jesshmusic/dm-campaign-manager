require 'rails_helper'

RSpec.describe "admin/v1/dnd_classes/edit", type: :view do
  before(:each) do
    @dnd_class = assign(:dnd_class, DndClass.create!(
      :name => "MyString",
      :hit_die => 1,
      :api_url => "MyString",
      :slug => "my-string",
    ))
  end

  it "renders the edit dnd_class form" do
    render

    expect(rendered).to be_truthy
    assert_select "form[action=?][method=?]", v1_dnd_class_path(@dnd_class), "post" do

      assert_select "input[name=?]", "dnd_class[name]"
      assert_select "input[name=?]", "dnd_class[hit_die]"
      assert_select "input[name=?]", "dnd_class[prof_ids][]"
      assert_select "select[name=?]", "dnd_class[prof_ids][]"
      assert_select "select[name=?]", "dnd_class[spell_ids][]"
      assert_select "select[name=?]", "dnd_class[spell_ids][]"
    end
  end
end

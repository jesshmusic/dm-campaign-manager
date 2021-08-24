require 'rails_helper'

RSpec.describe "admin/v1/dnd_classes/new", type: :view do
  before(:each) do
    assign(:dnd_class, DndClass.new(
      :name => "MyString",
      :hit_die => 1,
      :api_url => "MyString",
      :slug => "my-string",
    ))
  end

  it "renders new dnd_class form" do
    render

    assert_select "form[action=?][method=?]", v1_dnd_classes_path, "post" do

      assert_select "input[name=?]", "dnd_class[name]"

      assert_select "input[name=?]", "dnd_class[hit_die]"
    end
  end
end

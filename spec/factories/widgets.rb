# == Schema Information
#
# Table name: widgets
#
#  id         :bigint           not null, primary key
#  content    :text
#  icon       :text
#  subtitle   :text
#  title      :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint
#
# Indexes
#
#  index_widgets_on_user_id  (user_id)
#
FactoryBot.define do
  factory :widget do
    title { "MyText" }
    subtitle { "MyText" }
    content { "MyText" }
    icon { "MyText" }
  end
end

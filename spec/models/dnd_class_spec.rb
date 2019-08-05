# == Schema Information
#
# Table name: dnd_classes
#
#  id         :bigint           not null, primary key
#  api_url    :string
#  hit_die    :integer
#  name       :string
#  slug       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint
#
# Indexes
#
#  index_dnd_classes_on_slug     (slug) UNIQUE
#  index_dnd_classes_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

require 'rails_helper'

RSpec.describe DndClass, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

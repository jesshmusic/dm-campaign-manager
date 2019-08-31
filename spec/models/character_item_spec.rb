# == Schema Information
#
# Table name: character_items
#
#  id           :bigint           not null, primary key
#  carrying     :boolean          default(TRUE), not null
#  equipped     :boolean          default(FALSE), not null
#  quantity     :integer          default(1), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  character_id :bigint
#  item_id      :bigint
#
# Indexes
#
#  index_character_items_on_character_id  (character_id)
#  index_character_items_on_item_id       (item_id)
#
# Foreign Keys
#
#  fk_rails_...  (character_id => characters.id)
#  fk_rails_...  (item_id => items.id)
#

require 'rails_helper'

RSpec.describe CharacterItem, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

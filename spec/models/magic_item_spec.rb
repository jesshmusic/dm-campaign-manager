# == Schema Information
#
# Table name: magic_items
#
#  id                  :bigint           not null, primary key
#  description         :text
#  magic_item_type     :string
#  name                :string
#  rarity              :string
#  requires_attunement :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

require 'rails_helper'

RSpec.describe MagicItem, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

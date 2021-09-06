# == Schema Information
#
# Table name: spell_casting_infos
#
#  id               :bigint           not null, primary key
#  desc             :string           default([]), is an Array
#  name             :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  spell_casting_id :bigint           not null
#
# Indexes
#
#  index_spell_casting_infos_on_spell_casting_id  (spell_casting_id)
#
# Foreign Keys
#
#  fk_rails_...  (spell_casting_id => spell_castings.id)
#
require 'rails_helper'

RSpec.describe SpellCastingInfo, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

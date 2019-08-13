# == Schema Information
#
# Table name: monsters
#
#  id                     :bigint           not null, primary key
#  alignment              :string
#  api_url                :string
#  challenge_rating       :string
#  charisma_save          :integer
#  condition_immunities   :string
#  constitution_save      :integer
#  damage_immunities      :string
#  damage_resistances     :string
#  damage_vulnerabilities :string
#  dexterity_save         :integer
#  intelligence_save      :integer
#  languages              :string
#  legendary_description  :text
#  monster_subtype        :string
#  monster_type           :string
#  name                   :string
#  reactions              :text
#  senses                 :string
#  size                   :string
#  slug                   :string
#  strength_save          :integer
#  wisdom_save            :integer
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  user_id                :bigint
#
# Indexes
#
#  index_monsters_on_slug     (slug) UNIQUE
#  index_monsters_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

require 'rails_helper'

RSpec.describe Monster, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

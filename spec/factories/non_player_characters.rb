# == Schema Information
#
# Table name: characters
#
#  id              :bigint           not null, primary key
#  alignment       :string           default("neutral")
#  background      :string           default("Acolyte")
#  copper_pieces   :integer          default(0)
#  description     :text             default("Enter this character's backstory, history, or notes here.")
#  electrum_pieces :integer          default(0)
#  gold_pieces     :integer          default(0)
#  languages       :string           default("Common")
#  name            :string           not null
#  platinum_pieces :integer          default(0)
#  race            :string           default("Human"), not null
#  role            :string           default("Player Character")
#  silver_pieces   :integer          default(0), not null
#  slug            :string           not null
#  type            :string
#  xp              :integer          default(0), not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  user_id         :bigint
#
# Indexes
#
#  index_characters_on_slug     (slug)
#  index_characters_on_user_id  (user_id)
#

FactoryBot.define do
  factory :non_player_character do
    
  end
end

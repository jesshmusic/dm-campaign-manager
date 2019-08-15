# == Schema Information
#
# Table name: adventures
#
#  id          :bigint           not null, primary key
#  description :text
#  name        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  campaign_id :bigint
#
# Indexes
#
#  index_adventures_on_campaign_id  (campaign_id)
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#

class Adventure < ApplicationRecord
  belongs_to :campaign

  has_many :player_character_adventures, dependent: :destroy
  has_many :player_characters, through: :player_character_adventures, class_name: 'PlayerCharacter', source: 'Character'

  has_many :non_player_character_adventures, dependent: :destroy
  has_many :non_player_characters, through: :non_player_character_adventures, class_name: 'NonPlayerCharacter', source: 'Character'
end

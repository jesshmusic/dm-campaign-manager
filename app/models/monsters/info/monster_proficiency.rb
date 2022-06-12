# frozen_string_literal: true

# == Schema Information
#
# Table name: monster_proficiencies
#
#  widgetId         :bigint           not null, primary key
#  value      :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  monster_id :bigint
#  prof_id    :bigint
#
# Indexes
#
#  index_monster_proficiencies_on_monster_id  (monster_id)
#  index_monster_proficiencies_on_prof_id     (prof_id)
#

class MonsterProficiency < ApplicationRecord
  belongs_to :prof
  belongs_to :monster
end

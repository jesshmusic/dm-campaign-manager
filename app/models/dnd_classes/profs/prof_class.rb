# frozen_string_literal: true

# == Schema Information
#
# Table name: prof_classes
#
#  id           :bigint           not null, primary key
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  dnd_class_id :bigint
#  prof_id      :bigint
#
# Indexes
#
#  index_prof_classes_on_dnd_class_id  (dnd_class_id)
#  index_prof_classes_on_prof_id       (prof_id)
#

class ProfClass < ApplicationRecord
  belongs_to :prof
  belongs_to :dnd_class
end

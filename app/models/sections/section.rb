# == Schema Information
#
# Table name: sections
#
#  id          :bigint           not null, primary key
#  description :string
#  edition     :string           default("2014"), not null
#  name        :string
#  slug        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_sections_on_edition           (edition)
#  index_sections_on_slug_and_edition  (slug,edition) UNIQUE
#
class Section < ApplicationRecord
  include Editionable
  extend FriendlyId

  friendly_id :name, use: :slugged

  def normalize_friendly_id(string)
    super(string.gsub('\'', ''))
  end
end

# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  confirmation_sent_at   :datetime
#  confirmation_token     :string
#  confirmed_at           :datetime
#  current_sign_in_at     :datetime
#  current_sign_in_ip     :inet
#  deleted_at             :datetime
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  info                   :text
#  last_sign_in_at        :datetime
#  last_sign_in_ip        :inet
#  location               :string
#  name                   :string
#  preferred_edition      :string           default("2024")
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  role                   :integer
#  sign_in_count          :integer          default(0), not null
#  unconfirmed_email      :string
#  username               :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  auth_id                :string           default(""), not null
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_username              (username) UNIQUE
#

class User < ApplicationRecord
  validates :email, presence: true
  validates :email, uniqueness: true
  validates :auth_id, presence: true
  validates :auth_id, uniqueness: true

  enum :role, { dungeon_master: 0, admin: 1, user: 2 }
  after_initialize :set_default_role, if: :new_record?

  # UserProps Associations
  has_many :dnd_classes, dependent: :destroy
  has_many :items, dependent: :destroy
  has_many :monsters, dependent: :destroy
  has_many :races, dependent: :destroy
  has_many :spells, dependent: :destroy

  def set_default_role
    self.role ||= :user
  end

  # instead of deleting, indicate the user requested a delete & timestamp it
  def soft_delete
    update_attribute(:deleted_at, Time.current)
  end

  # ensure user account is active
  def active_for_authentication?
    super && !deleted_at
  end

  # provide a custom message for a deleted account
  def inactive_message
    return :active if active_for_authentication?

    deleted_at ? :deleted_account : super
  end

  # PgSearch
  include PgSearch::Model

  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    username: 'D',
                    email: 'C',
                    role: 'B'
                  },
                  using: {
                    tsearch: {
                      prefix: true
                    }
                  }
end

# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :inet
#  last_sign_in_ip        :inet
#  confirmation_token     :string
#  confirmed_at           :datetime
#  confirmation_sent_at   :datetime
#  unconfirmed_email      :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  role                   :integer
#  name                   :text
#  username               :text
#

class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable, :omniauthable
  include PgSearch
  enum role: %I[player dungeon_master admin]
  after_initialize :set_default_role, if: :new_record?

  # User Favorites
  has_many :campaigns, dependent: :delete_all

  def set_default_role
    self.role ||= :player
  end

  # instead of deleting, indicate the user requested a delete & timestamp it
  # def soft_delete
  #   update_attribute(:deleted_at, Time.current)
  # end

  # ensure user account is active
  # def active_for_authentication?
  #   super && !deleted_at
  # end

  # provide a custom message for a deleted account
  # def inactive_message
  #   !deleted_at ? super : :deleted_account
  # end

  # PgSearch
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

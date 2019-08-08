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
#  last_sign_in_at        :datetime
#  last_sign_in_ip        :inet
#  name                   :string
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  role                   :integer
#  sign_in_count          :integer          default(0), not null
#  slug                   :string
#  unconfirmed_email      :string
#  username               :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_slug                  (slug) UNIQUE
#  index_users_on_username              (username) UNIQUE
#

class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable, :omniauthable
  validates :username, uniqueness: true

  enum role: %I[player dungeon_master admin]
  after_initialize :set_default_role, if: :new_record?
  after_validation(on: :create) do
    self.slug = generate_slug
  end

  # User Associations
  has_many :campaigns, dependent: :delete_all
  has_many :dnd_classes, dependent: :delete_all
  has_many :items, dependent: :delete_all
  has_many :magic_items, dependent: :delete_all
  has_many :monsters, dependent: :delete_all
  has_many :spells, dependent: :delete_all

  def set_default_role
    puts "SETTING DEFAULT ROLE, self.role = #{self.role}"
    if self.role == :dungeon_master
      self.role ||= :dungeon_master
    else
      self.role ||= :player
    end
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
    !deleted_at ? super : :deleted_account
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

  def to_param
    slug ? slug : username
  end
  
  private

  def generate_slug
    self.username.parameterize.truncate(80, omission: '')
  end
end

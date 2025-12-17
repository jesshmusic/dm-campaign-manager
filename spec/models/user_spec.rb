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
require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    it 'requires email' do
      user = build(:user, email: nil)
      expect(user).not_to be_valid
      expect(user.errors[:email]).to include("can't be blank")
    end

    it 'requires unique email' do
      create(:user, email: 'test@example.com')
      user = build(:user, email: 'test@example.com')
      expect(user).not_to be_valid
    end

    it 'requires auth_id' do
      user = build(:user, auth_id: nil)
      expect(user).not_to be_valid
    end

    it 'requires unique auth_id' do
      create(:user, auth_id: 'auth0|123')
      user = build(:user, auth_id: 'auth0|123')
      expect(user).not_to be_valid
    end
  end

  describe 'associations' do
    it 'has many dnd_classes' do
      user = create(:user)
      expect(user).to respond_to(:dnd_classes)
    end

    it 'has many items' do
      user = create(:user)
      expect(user).to respond_to(:items)
    end

    it 'has many monsters' do
      user = create(:user)
      expect(user).to respond_to(:monsters)
    end

    it 'has many races' do
      user = create(:user)
      expect(user).to respond_to(:races)
    end

    it 'has many spells' do
      user = create(:user)
      expect(user).to respond_to(:spells)
    end
  end

  describe 'enum role' do
    it 'has dungeon_master role' do
      user = create(:dungeon_master_user)
      expect(user.dungeon_master?).to be true
    end

    it 'has admin role' do
      user = create(:admin_user)
      expect(user.admin?).to be true
    end

    it 'has user role' do
      user = create(:user)
      expect(user.user?).to be true
    end

    it 'defaults to user role' do
      user = User.new(email: 'test@example.com', auth_id: 'auth0|test')
      user.save
      expect(user.role).to eq('user')
    end
  end

  describe '#soft_delete' do
    it 'sets deleted_at' do
      user = create(:user)
      user.soft_delete
      expect(user.deleted_at).not_to be_nil
    end

    it 'does not destroy the record' do
      user = create(:user)
      expect { user.soft_delete }.not_to change(User, :count)
    end
  end

  describe 'search' do
    it 'searches by name' do
      user = create(:user, name: 'John Doe')
      results = User.search_for('John')
      expect(results).to include(user)
    end

    it 'searches by email' do
      user = create(:user, email: 'john@example.com')
      results = User.search_for('john@')
      expect(results).to include(user)
    end

    it 'searches by username' do
      user = create(:user, username: 'johndoe')
      results = User.search_for('johndoe')
      expect(results).to include(user)
    end
  end

  describe 'user attributes' do
    it 'has email attribute' do
      user = create(:user, email: 'test@example.com')
      expect(user.email).to eq('test@example.com')
    end

    it 'has auth_id attribute' do
      user = create(:user, auth_id: 'auth0|123456')
      expect(user.auth_id).to eq('auth0|123456')
    end

    it 'has name attribute' do
      user = create(:user, name: 'Test User')
      expect(user.name).to eq('Test User')
    end

    it 'has username attribute' do
      user = create(:user, username: 'testuser')
      expect(user.username).to eq('testuser')
    end


    it 'has deleted_at attribute' do
      user = create(:user)
      expect(user.deleted_at).to be_nil
    end

    it 'has role attribute' do
      user = create(:user)
      expect(user.role).not_to be_nil
    end
  end

  describe 'user creation' do
    it 'creates a valid user' do
      user = build(:user)
      expect(user).to be_valid
    end

    it 'saves user to database' do
      user = create(:user, email: 'save@example.com')
      found = User.find(user.id)
      expect(found.email).to eq('save@example.com')
    end
  end

  describe 'user relationships' do
    it 'user can have multiple dnd_classes' do
      user = create(:user)
      class1 = create(:dnd_class, user_id: user.id)
      class2 = create(:dnd_class, user_id: user.id)

      expect(user.dnd_classes.count).to eq(2)
      expect(user.dnd_classes).to include(class1, class2)
    end

    it 'user can have multiple items' do
      user = create(:user)
      item1 = create(:item, user_id: user.id)
      item2 = create(:item, user_id: user.id)

      expect(user.items.count).to eq(2)
      expect(user.items).to include(item1, item2)
    end

    it 'user can have multiple monsters' do
      user = create(:user)
      monster1 = create(:monster, user_id: user.id)
      monster2 = create(:monster, user_id: user.id)

      expect(user.monsters.count).to eq(2)
      expect(user.monsters).to include(monster1, monster2)
    end

    it 'user can have multiple races' do
      user = create(:user)
      race1 = create(:race, user_id: user.id)
      race2 = create(:race, user_id: user.id)

      expect(user.races.count).to eq(2)
      expect(user.races).to include(race1, race2)
    end

    it 'user can have multiple spells' do
      user = create(:user)
      spell1 = create(:spell, user_id: user.id)
      spell2 = create(:spell, user_id: user.id)

      expect(user.spells.count).to eq(2)
      expect(user.spells).to include(spell1, spell2)
    end
  end

  describe 'role checking' do
    it 'can check if user is dungeon_master' do
      dm_user = create(:dungeon_master_user)
      regular_user = create(:user)

      expect(dm_user.dungeon_master?).to be true
      expect(regular_user.dungeon_master?).to be false
    end

    it 'can check if user is admin' do
      admin = create(:admin_user)
      regular_user = create(:user)

      expect(admin.admin?).to be true
      expect(regular_user.admin?).to be false
    end

    it 'can check if user is user role' do
      user = create(:user)
      expect(user.user?).to be true
    end
  end

  describe 'soft delete functionality' do
    it 'soft delete does not remove from database' do
      user = create(:user)
      count_before = User.count
      user.soft_delete
      count_after = User.count

      expect(count_before).to eq(count_after)
    end

    it 'soft deleted user has deleted_at set' do
      user = create(:user)
      user.soft_delete

      expect(user.deleted_at).not_to be_nil
    end

    it 'can check if user is deleted' do
      user = create(:user)
      expect(user.deleted_at).to be_nil
      user.soft_delete
      expect(user.deleted_at).not_to be_nil
    end

    it 'reloading soft deleted user keeps deletion timestamp' do
      user = create(:user)
      user.soft_delete
      deleted_at = user.deleted_at

      reloaded = User.find(user.id)
      expect(reloaded.deleted_at).to be_within(1.second).of(deleted_at)
    end
  end

  describe 'user data persistence' do
    it 'user data is correctly saved and retrieved' do
      user = create(:user,
                   name: 'Test User',
                   email: 'unique_test@example.com',
                   username: 'uniquetestuser')

      reloaded = User.find(user.id)
      expect(reloaded.name).to eq('Test User')
      expect(reloaded.email).to eq('unique_test@example.com')
      expect(reloaded.username).to eq('uniquetestuser')
    end
  end
end

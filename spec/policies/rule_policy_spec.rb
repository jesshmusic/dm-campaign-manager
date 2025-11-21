require 'rails_helper'

RSpec.describe RulePolicy do
  subject { described_class.new(current_user, rule) }

  let(:admin) { create(:admin_user) }
  let(:dungeon_master) { create(:dungeon_master_user) }
  let(:regular_user) { create(:user, email: 'regular1@example.com', username: 'regular1', role: :user) }
  let(:owner) { create(:user, email: 'owner1@example.com', username: 'owner1', role: :user) }
  let(:rule) { create(:rule) }

  # Add user attribute dynamically to rule since the model doesn't have it in the schema
  before do
    rule.define_singleton_method(:user) { @user }
    rule.define_singleton_method(:user=) { |val| @user = val }
  end

  describe '#index?' do
    let(:current_user) { regular_user }

    it 'always grants access' do
      expect(subject.index?).to be true
    end

    context 'when user is nil' do
      let(:current_user) { nil }

      it 'grants access' do
        expect(subject.index?).to be true
      end
    end
  end

  describe '#show?' do
    context 'when user is an admin' do
      let(:current_user) { admin }

      before { rule.user = owner }

      it 'grants access' do
        expect(subject.show?).to be true
      end
    end

    context 'when user is the owner' do
      let(:current_user) { owner }

      before { rule.user = owner }

      it 'grants access' do
        expect(subject.show?).to be true
      end
    end

    context 'when rule has no owner' do
      let(:current_user) { regular_user }

      before { rule.user = nil }

      it 'grants access' do
        expect(subject.show?).to be true
      end
    end

    context 'when user is not the owner' do
      let(:current_user) { regular_user }
      let(:other_owner) { create(:other_user) }

      before { rule.user = other_owner }

      it 'denies access' do
        expect(subject.show?).to be false
      end
    end

    context 'when user is nil and rule has owner' do
      let(:current_user) { nil }

      before { rule.user = owner }

      it 'denies access' do
        expect(subject.show?).to be false
      end
    end

    context 'when user is nil and rule has no owner' do
      let(:current_user) { nil }

      before { rule.user = nil }

      it 'grants access' do
        expect(subject.show?).to be true
      end
    end
  end

  describe '#update?' do
    context 'when user is an admin' do
      let(:current_user) { admin }

      before { rule.user = owner }

      it 'grants access' do
        expect(subject.update?).to be true
      end
    end

    context 'when user is the owner' do
      let(:current_user) { owner }

      before { rule.user = owner }

      it 'grants access' do
        expect(subject.update?).to be true
      end
    end

    context 'when user is not the owner' do
      let(:current_user) { regular_user }
      let(:other_owner) { create(:other_user) }

      before { rule.user = other_owner }

      it 'denies access' do
        expect(subject.update?).to be false
      end
    end

    context 'when user is nil' do
      let(:current_user) { nil }

      before { rule.user = owner }

      it 'denies access' do
        expect(subject.update?).to be_falsey
      end
    end
  end

  describe '#create?' do
    context 'when user is an admin' do
      let(:current_user) { admin }

      it 'grants access' do
        expect(subject.create?).to be true
      end
    end

    context 'when user is a dungeon master' do
      let(:current_user) { dungeon_master }

      it 'grants access' do
        expect(subject.create?).to be true
      end
    end

    context 'when user is a regular user' do
      let(:current_user) { regular_user }

      it 'denies access' do
        expect(subject.create?).to be false
      end
    end

    context 'when user is nil' do
      let(:current_user) { nil }

      it 'denies access' do
        expect(subject.create?).to be_falsey
      end
    end
  end

  describe '#destroy?' do
    context 'when user is an admin' do
      let(:current_user) { admin }

      before { rule.user = owner }

      it 'grants access' do
        expect(subject.destroy?).to be true
      end
    end

    context 'when user is the owner' do
      let(:current_user) { owner }

      before { rule.user = owner }

      it 'grants access' do
        expect(subject.destroy?).to be true
      end
    end

    context 'when user is not the owner' do
      let(:current_user) { regular_user }
      let(:other_owner) { create(:other_user) }

      before { rule.user = other_owner }

      it 'denies access' do
        expect(subject.destroy?).to be false
      end
    end

    context 'when user is nil' do
      let(:current_user) { nil }

      before { rule.user = owner }

      it 'denies access' do
        expect(subject.destroy?).to be_falsey
      end
    end
  end
end

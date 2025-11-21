require 'rails_helper'

RSpec.describe WidgetPolicy do
  subject { described_class.new(current_user, widget) }

  let(:admin) { create(:admin_user) }
  let(:dungeon_master) { create(:dungeon_master_user) }
  let(:regular_user) { create(:user, email: 'regular3@example.com', username: 'regular3', role: :user) }
  let(:owner) { create(:user, email: 'owner3@example.com', username: 'owner3', role: :user) }
  let(:widget) { create(:widget) }

  # Add user attribute dynamically to widget since the model doesn't have the association defined
  before do
    widget.define_singleton_method(:user) { @user }
    widget.define_singleton_method(:user=) { |val| @user = val }
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

      before { widget.user = owner }

      it 'grants access' do
        expect(subject.show?).to be true
      end
    end

    context 'when user is the owner' do
      let(:current_user) { owner }

      before { widget.user = owner }

      it 'grants access' do
        expect(subject.show?).to be true
      end
    end

    context 'when widget has no owner' do
      let(:current_user) { regular_user }

      before { widget.user = nil }

      it 'grants access' do
        expect(subject.show?).to be true
      end
    end

    context 'when user is not the owner' do
      let(:current_user) { regular_user }
      let(:other_owner) { create(:other_user) }

      before { widget.user = other_owner }

      it 'denies access' do
        expect(subject.show?).to be false
      end
    end

    context 'when user is nil and widget has owner' do
      let(:current_user) { nil }

      before { widget.user = owner }

      it 'denies access' do
        expect(subject.show?).to be false
      end
    end

    context 'when user is nil and widget has no owner' do
      let(:current_user) { nil }

      before { widget.user = nil }

      it 'grants access' do
        expect(subject.show?).to be true
      end
    end
  end

  describe '#update?' do
    context 'when user is an admin' do
      let(:current_user) { admin }

      before { widget.user = owner }

      it 'grants access' do
        expect(subject.update?).to be true
      end
    end

    context 'when user is the owner' do
      let(:current_user) { owner }

      before { widget.user = owner }

      it 'grants access' do
        expect(subject.update?).to be true
      end
    end

    context 'when user is not the owner' do
      let(:current_user) { regular_user }
      let(:other_owner) { create(:other_user) }

      before { widget.user = other_owner }

      it 'denies access' do
        expect(subject.update?).to be false
      end
    end

    context 'when user is nil' do
      let(:current_user) { nil }

      before { widget.user = owner }

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

      before { widget.user = owner }

      it 'grants access' do
        expect(subject.destroy?).to be true
      end
    end

    context 'when user is the owner' do
      let(:current_user) { owner }

      before { widget.user = owner }

      it 'grants access' do
        expect(subject.destroy?).to be true
      end
    end

    context 'when user is not the owner' do
      let(:current_user) { regular_user }
      let(:other_owner) { create(:other_user) }

      before { widget.user = other_owner }

      it 'denies access' do
        expect(subject.destroy?).to be false
      end
    end

    context 'when user is nil' do
      let(:current_user) { nil }

      before { widget.user = owner }

      it 'denies access' do
        expect(subject.destroy?).to be_falsey
      end
    end
  end
end

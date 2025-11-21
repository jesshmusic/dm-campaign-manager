require 'rails_helper'

RSpec.describe ActionPolicy do
  subject { described_class.new(current_user, action_record) }

  let(:admin) { create(:admin_user) }
  let(:regular_user) { create(:user) }
  let(:action_record) { create(:action) }

  describe '#update?' do
    context 'when user is an admin' do
      let(:current_user) { admin }

      it 'grants access' do
        expect(subject.update?).to be true
      end
    end

    context 'when user is not an admin' do
      let(:current_user) { regular_user }

      it 'denies access' do
        expect(subject.update?).to be false
      end
    end

    context 'when user is nil' do
      let(:current_user) { nil }

      it 'denies access' do
        expect(subject.update?).to be_nil
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

    context 'when user is not an admin' do
      let(:current_user) { regular_user }

      it 'denies access' do
        expect(subject.create?).to be false
      end
    end

    context 'when user is nil' do
      let(:current_user) { nil }

      it 'denies access' do
        expect(subject.create?).to be_nil
      end
    end
  end

  describe '#show?' do
    context 'when user is an admin' do
      let(:current_user) { admin }

      it 'grants access' do
        expect(subject.show?).to be true
      end
    end

    context 'when user is not an admin' do
      let(:current_user) { regular_user }

      it 'denies access' do
        expect(subject.show?).to be false
      end
    end

    context 'when user is nil' do
      let(:current_user) { nil }

      it 'denies access' do
        expect(subject.show?).to be_nil
      end
    end
  end

  describe '#destroy?' do
    context 'when user is an admin' do
      let(:current_user) { admin }

      it 'grants access' do
        expect(subject.destroy?).to be true
      end
    end

    context 'when user is not an admin' do
      let(:current_user) { regular_user }

      it 'denies access' do
        expect(subject.destroy?).to be false
      end
    end

    context 'when user is nil' do
      let(:current_user) { nil }

      it 'denies access' do
        expect(subject.destroy?).to be_nil
      end
    end
  end
end

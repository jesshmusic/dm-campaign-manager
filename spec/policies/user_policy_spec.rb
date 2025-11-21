require 'rails_helper'

RSpec.describe UserPolicy do
  subject { described_class.new(current_user, user) }

  let(:admin) { create(:admin_user) }
  let(:regular_user) { create(:user) }
  let(:other_user) { create(:other_user) }

  describe '#index?' do
    context 'when user is an admin' do
      let(:current_user) { admin }
      let(:user) { User }

      it 'grants access' do
        expect(subject.index?).to be true
      end
    end

    context 'when user is not an admin' do
      let(:current_user) { regular_user }
      let(:user) { User }

      it 'denies access' do
        expect(subject.index?).to be false
      end
    end

    context 'when user is nil' do
      let(:current_user) { nil }
      let(:user) { User }

      it 'raises an error' do
        expect { subject.index? }.to raise_error(NoMethodError)
      end
    end
  end

  describe '#set_auth_user?' do
    let(:current_user) { regular_user }
    let(:user) { regular_user }

    it 'always grants access' do
      expect(subject.set_auth_user?).to be true
    end

    context 'when user is nil' do
      let(:current_user) { nil }

      it 'grants access' do
        expect(subject.set_auth_user?).to be true
      end
    end
  end

  describe '#logout_user?' do
    let(:current_user) { regular_user }
    let(:user) { regular_user }

    it 'always grants access' do
      expect(subject.logout_user?).to be true
    end

    context 'when user is nil' do
      let(:current_user) { nil }

      it 'grants access' do
        expect(subject.logout_user?).to be true
      end
    end
  end

  describe '#create_action?' do
    context 'when user is an admin' do
      let(:current_user) { admin }
      let(:user) { User }

      it 'grants access' do
        expect(subject.create_action?).to be true
      end
    end

    context 'when user is not an admin' do
      let(:current_user) { regular_user }
      let(:user) { User }

      it 'denies access' do
        expect(subject.create_action?).to be false
      end
    end

    context 'when user is nil' do
      let(:current_user) { nil }
      let(:user) { User }

      it 'raises an error' do
        expect { subject.create_action? }.to raise_error(NoMethodError)
      end
    end
  end

  describe '#update_action?' do
    context 'when user is an admin' do
      let(:current_user) { admin }
      let(:user) { User }

      it 'grants access' do
        expect(subject.update_action?).to be true
      end
    end

    context 'when user is not an admin' do
      let(:current_user) { regular_user }
      let(:user) { User }

      it 'denies access' do
        expect(subject.update_action?).to be false
      end
    end

    context 'when user is nil' do
      let(:current_user) { nil }
      let(:user) { User }

      it 'raises an error' do
        expect { subject.update_action? }.to raise_error(NoMethodError)
      end
    end
  end

  describe '#show?' do
    context 'when user is an admin' do
      let(:current_user) { admin }
      let(:user) { regular_user }

      it 'grants access' do
        expect(subject.show?).to be true
      end
    end

    context 'when user views their own record' do
      let(:current_user) { regular_user }
      let(:user) { regular_user }

      it 'grants access' do
        expect(subject.show?).to be true
      end
    end

    context 'when user views another user record' do
      let(:current_user) { regular_user }
      let(:user) { other_user }

      it 'denies access' do
        expect(subject.show?).to be false
      end
    end

    context 'when user is nil' do
      let(:current_user) { nil }
      let(:user) { regular_user }

      it 'raises an error' do
        expect { subject.show? }.to raise_error(NoMethodError)
      end
    end
  end

  describe '#create?' do
    let(:current_user) { regular_user }
    let(:user) { User }

    it 'always grants access' do
      expect(subject.create?).to be true
    end

    context 'when user is nil' do
      let(:current_user) { nil }

      it 'grants access' do
        expect(subject.create?).to be true
      end
    end
  end

  describe '#edit?' do
    context 'when user is an admin' do
      let(:current_user) { admin }
      let(:user) { regular_user }

      it 'grants access' do
        expect(subject.edit?).to be true
      end
    end

    context 'when user edits their own record' do
      let(:current_user) { regular_user }
      let(:user) { regular_user }

      it 'grants access' do
        expect(subject.edit?).to be true
      end
    end

    context 'when user edits another user record' do
      let(:current_user) { regular_user }
      let(:user) { other_user }

      it 'denies access' do
        expect(subject.edit?).to be false
      end
    end

    context 'when user is nil' do
      let(:current_user) { nil }
      let(:user) { regular_user }

      it 'raises an error' do
        expect { subject.edit? }.to raise_error(NoMethodError)
      end
    end
  end

  describe '#update?' do
    context 'when user is an admin' do
      let(:current_user) { admin }
      let(:user) { regular_user }

      it 'grants access' do
        expect(subject.update?).to be true
      end
    end

    context 'when user updates their own record' do
      let(:current_user) { regular_user }
      let(:user) { regular_user }

      it 'grants access' do
        expect(subject.update?).to be true
      end
    end

    context 'when user updates another user record' do
      let(:current_user) { regular_user }
      let(:user) { other_user }

      it 'denies access' do
        expect(subject.update?).to be false
      end
    end

    context 'when user is nil' do
      let(:current_user) { nil }
      let(:user) { regular_user }

      it 'raises an error' do
        expect { subject.update? }.to raise_error(NoMethodError)
      end
    end
  end

  describe '#destroy?' do
    context 'when user is an admin' do
      let(:current_user) { admin }
      let(:user) { regular_user }

      it 'grants access' do
        expect(subject.destroy?).to be true
      end
    end

    context 'when user deletes their own record' do
      let(:current_user) { regular_user }
      let(:user) { regular_user }

      it 'grants access' do
        expect(subject.destroy?).to be true
      end
    end

    context 'when user deletes another user record' do
      let(:current_user) { regular_user }
      let(:user) { other_user }

      it 'denies access' do
        expect(subject.destroy?).to be false
      end
    end

    context 'when user is nil' do
      let(:current_user) { nil }
      let(:user) { regular_user }

      it 'raises an error' do
        expect { subject.destroy? }.to raise_error(NoMethodError)
      end
    end
  end

  describe '#change_role?' do
    context 'when user is an admin' do
      let(:current_user) { admin }
      let(:user) { regular_user }

      it 'grants access' do
        expect(subject.change_role?).to be true
      end
    end

    context 'when user is not an admin' do
      let(:current_user) { regular_user }
      let(:user) { regular_user }

      it 'denies access' do
        expect(subject.change_role?).to be false
      end
    end

    context 'when user is nil' do
      let(:current_user) { nil }
      let(:user) { regular_user }

      it 'raises an error' do
        expect { subject.change_role? }.to raise_error(NoMethodError)
      end
    end
  end
end

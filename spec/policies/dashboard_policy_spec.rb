require 'rails_helper'

RSpec.describe DashboardPolicy do
  subject { described_class.new(current_user, :dashboard) }

  let(:admin) { create(:admin_user) }
  let(:regular_user) { create(:user) }

  describe '#initialize' do
    context 'when user is nil' do
      let(:current_user) { nil }

      it 'raises Pundit::NotAuthorizedError' do
        expect { subject }.to raise_error(Pundit::NotAuthorizedError, 'must be logged in')
      end
    end

    context 'when user is present' do
      let(:current_user) { regular_user }

      it 'does not raise an error' do
        expect { subject }.not_to raise_error
      end
    end
  end

  describe '#index?' do
    context 'when user is an admin' do
      let(:current_user) { admin }

      it 'grants access' do
        expect(subject.index?).to be true
      end
    end

    context 'when user is not an admin' do
      let(:current_user) { regular_user }

      it 'denies access' do
        expect(subject.index?).to be false
      end
    end
  end

  describe '#update_from_srd?' do
    context 'when user is an admin' do
      let(:current_user) { admin }

      it 'grants access' do
        expect(subject.update_from_srd?).to be true
      end
    end

    context 'when user is not an admin' do
      let(:current_user) { regular_user }

      it 'denies access' do
        expect(subject.update_from_srd?).to be false
      end
    end
  end
end

require 'rails_helper'

RSpec.describe HomePolicy do
  subject { described_class.new(current_user, :home) }

  let(:admin) { create(:admin_user) }
  let(:regular_user) { create(:user) }

  describe '#index?' do
    context 'when user is an admin' do
      let(:current_user) { admin }

      it 'grants access' do
        expect(subject.index?).to be true
      end
    end

    context 'when user is a regular user' do
      let(:current_user) { regular_user }

      it 'grants access' do
        expect(subject.index?).to be true
      end
    end

    context 'when user is nil' do
      let(:current_user) { nil }

      it 'grants access' do
        expect(subject.index?).to be true
      end
    end
  end
end

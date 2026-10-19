require 'rails_helper'
require 'rake'

RSpec.describe 'patreon:refresh_memberships' do
  let(:task) { Rake::Task['patreon:refresh_memberships'] }

  before(:all) do
    Rake.application.rake_require('tasks/patreon', [Rails.root.join('lib').to_s])
    Rake::Task.define_task(:environment) unless Rake::Task.task_defined?(:environment)
  end

  before { task.reenable }

  def run_task
    expect { task.invoke }.to output(/patreon:refresh_memberships/).to_stdout
  end

  describe 'which accounts it picks' do
    let!(:expiring_soon) { create(:patreon_user, :wizard, expires_at: 3.days.from_now) }
    let!(:expiring_in_a_week) { create(:patreon_user, :wizard, expires_at: 7.days.from_now - 1.minute) }
    let!(:recently_lapsed) { create(:patreon_user, :wizard, expires_at: 5.days.ago) }
    let!(:lapsed_a_month_ago) { create(:patreon_user, :wizard, expires_at: 30.days.ago + 1.minute) }
    let(:refreshed) { [] }

    before do
      # Not due yet, lapsed too long ago, nothing to refresh with, never finished linking
      create(:patreon_user, :wizard, expires_at: 8.days.from_now)
      create(:patreon_user, :wizard, expires_at: 31.days.ago)
      create(:patreon_user, :wizard, expires_at: 2.days.from_now, refresh_token: nil)
      create(:patreon_user, :unauthenticated)
      allow(PatreonMembership).to receive(:refresh) do |account|
        refreshed << account.id
        :refreshed
      end
    end

    it 'refreshes tokens expiring within 7 days or lapsed within the last 30' do
      run_task

      expect(refreshed).to contain_exactly(expiring_soon.id, expiring_in_a_week.id, recently_lapsed.id, lapsed_a_month_ago.id)
    end

    it 'includes both Foundry logins and web-linked accounts' do
      linked = create(:patreon_user, :wizard, user_id: nil, linked_user: create(:dungeon_master_user), expires_at: 1.day.from_now)

      run_task

      expect(refreshed).to include(linked.id)
    end
  end

  describe 'reporting' do
    before do
      create_list(:patreon_user, 2, :wizard, expires_at: 1.day.from_now)
      create(:patreon_user, :wizard, expires_at: 1.day.ago)
    end

    it 'logs the counts and survives a failing account' do
      outcomes = %i[refreshed revoked]
      allow(PatreonMembership).to receive(:refresh) do
        outcome = outcomes.shift
        raise 'Patreon exploded' unless outcome

        outcome
      end
      allow(Rails.logger).to receive(:info)
      allow(Rails.logger).to receive(:error)

      expect { task.invoke }.to output("patreon:refresh_memberships due=3 refreshed=1 revoked=1 failed=1 skipped=0\n").to_stdout

      expect(Rails.logger).to have_received(:info).with('patreon:refresh_memberships due=3 refreshed=1 revoked=1 failed=1 skipped=0')
      expect(Rails.logger).to have_received(:error).with(/Patreon exploded/)
    end
  end
end

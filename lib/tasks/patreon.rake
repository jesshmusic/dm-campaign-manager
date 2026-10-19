# frozen_string_literal: true

namespace :patreon do
  desc 'Refresh Patreon tokens and memberships expiring within 7 days or lapsed in the last 30 (Heroku Scheduler, daily)'
  task refresh_memberships: :environment do
    due = PatreonUser.due_for_refresh
    total = due.count
    counts = PatreonMembership.refresh_due(due)

    message = "patreon:refresh_memberships due=#{total} " + counts.map { |outcome, count| "#{outcome}=#{count}" }.join(' ')
    Rails.logger.info(message)
    puts message
  end
end

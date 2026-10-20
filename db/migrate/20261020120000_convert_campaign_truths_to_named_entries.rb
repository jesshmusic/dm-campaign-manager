# A campaign's truths of the setting become a list of { name, description }
# instead of strings. Each string is split after its first sentence, as
# Campaign.normalize_truths does for strings older clients still send:
# "Greyhawk runs on gold. The Directing Oligarchy governs." is the name
# "Greyhawk runs on gold." and the description "The Directing Oligarchy
# governs."; with no sentence end, the whole string is the name. Blank strings
# are dropped. Down joins each name and description back into one string.
#
# A converted campaign gets a new sync version, so a Foundry world's next pull
# picks up its truths in the new shape.
class ConvertCampaignTruthsToNamedEntries < ActiveRecord::Migration[7.1]
  # A lightweight model, so this migration doesn't depend on the app's
  class Campaign < ActiveRecord::Base
    self.table_name = 'campaigns'
  end

  # A sentence end: ".", "!" or "?" followed by whitespace
  SENTENCE_END = /[.!?]\s/

  def up
    convert { |truths| truths.filter_map { |truth| truth.is_a?(String) ? entry_from(truth) : truth } }
  end

  def down
    convert do |truths|
      truths.map { |truth| truth.is_a?(Hash) ? "#{truth['name']} #{truth['description']}".strip : truth }
    end
  end

  private

  # Saves each campaign's truths as the block returns them, when that changes them
  def convert
    Campaign.find_each do |campaign|
      truths = campaign.truths
      next unless truths.is_a?(Array)

      converted = yield truths
      next if converted == truths

      assignments = ['truths = ?, sync_counter = sync_counter + 1, sync_version = sync_counter + 1', converted.to_json]
      Campaign.where(id: campaign.id).update_all(assignments)
    end
  end

  def entry_from(text)
    text = text.strip
    return if text.empty?

    split = text =~ SENTENCE_END
    return { 'name' => text, 'description' => '' } unless split

    { 'name' => text[..split], 'description' => text[(split + 1)..].strip }
  end
end

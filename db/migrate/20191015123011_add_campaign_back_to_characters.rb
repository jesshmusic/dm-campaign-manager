class AddCampaignBackToCharacters < ActiveRecord::Migration[5.2]
  def change
    add_reference :characters, :campaign, foreign_key: true

    Guild.all.each do |guild|
      guild.characters.each do |character|
        character.campaign = guild.campaign
        character.save!
      end
    end
  end
end

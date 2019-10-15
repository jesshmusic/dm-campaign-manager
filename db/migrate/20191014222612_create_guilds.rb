class CreateGuilds < ActiveRecord::Migration[5.2]
  def change
    create_table :guilds do |t|
      t.string :name
      t.text :description
      t.string :slug
      t.references :campaign, foreign_key: true

      t.timestamps
    end

    add_reference :characters, :guild, foreign_key: true

    Character.all.each do |character|
      campaign_guild = Guild.find_or_create_by(campaign_id: character.campaign.id) do |guild|
        guild.name = 'Default'
        guild.description = 'Characters with no affiliation'
        character.campaign.guilds << guild
      end

      character.guild = campaign_guild
      character.generate_slug
      character.save!
    end

    remove_reference :characters, :campaign
  end
end

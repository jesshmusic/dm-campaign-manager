# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

def create_user(name, username, email, role)
  puts name
  if !User.exists?(email: email)
    puts "Creating user #{name} with email #{email}"
    user = User.new(
      name: name,
      username: username,
      email: email,
      password: "Flashy7151",
      password_confirmation: "Flashy7151",
      reset_password_token: nil,
      reset_password_sent_at: nil,
      remember_created_at: nil,
      sign_in_count: 1,
      current_sign_in_at: "2015-02-06 14:02:10",
      last_sign_in_at: "2015-02-06 14:02:10",
      current_sign_in_ip: "127.0.0.1",
      last_sign_in_ip: "127.0.0.1",
      role: role
    )
    user.skip_confirmation!
    user.save!
    return user
  else
    return User.find_by(email: email)
  end
end

create_user('Jess Player', 'jesshplayer', 'jesshmusic+player72@gmail.com', 0)
create_user('Jess Hendricks', 'jesshmusic', 'jesshmusic72@gmail.com', 2)
dm_user = create_user('Jess DM', 'jesshdm', 'jesshmusic72+dm@gmail.com', 1)

Campaign.find_or_create_by(name: 'Greyhawk', user_id: dm_user.id) do |campaign|
  campaign.name = 'Greyhawk'
  campaign.world = 'Oerth - Continent of Oerik, the Flaeness'
  campaign.description = 'Greyhawk, also known as the World of Greyhawk, is a fictional world designed as a campaign setting for the Dungeons & Dragons fantasy roleplaying game.'
  dm_user.campaigns << campaign
end

Campaign.find_or_create_by(name: 'Dragonlance', user_id: dm_user.id) do |campaign|
  campaign.name = 'Dragonlance'
  campaign.world = 'Krynn'
  campaign.description = 'Dragonlance is a shared universe created by Laura and Tracy Hickman, and expanded by Tracy Hickman and Margaret Weis under the direction of TSR, Inc. into a series of fantasy novels. The Hickmans conceived Dragonlance while driving in their car on the way to TSR for a job interview.'
  dm_user.campaigns << campaign
end

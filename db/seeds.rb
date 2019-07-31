# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
admin_user = User.new(
  name: 'Jess Hendricks',
  username: 'jesshmusic',
  email: 'jesshmusic72@gmail.com',
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
  role: 2
)
admin_user.skip_confirmation!
admin_user.save!

player_user = User.new(
  name: 'Jess Player',
  username: 'jesshplayer',
  email: 'jesshmusic72+player@gmail.com',
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
  role: 0
)
player_user.skip_confirmation!
player_user.save!

dm_user = User.new(
  name: 'Jess DM',
  username: 'jesshdm',
  email: 'jesshmusic72+dm@gmail.com',
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
  role: 1
)
dm_user.skip_confirmation!
dm_user.save!

dm_user.campaigns.create(
  name: 'Greyhawk',
  world: 'Oerth - Continent of Oerik, the Flaeness',
  description: 'Greyhawk, also known as the World of Greyhawk, is a fictional world designed as a campaign setting for the Dungeons & Dragons fantasy roleplaying game.',
)

dm_user.campaigns.create(
  name: 'Dragonlance',
  world: 'Krynn',
  description: 'Dragonlance is a shared universe created by Laura and Tracy Hickman, and expanded by Tracy Hickman and Margaret Weis under the direction of TSR, Inc. into a series of fantasy novels. The Hickmans conceived Dragonlance while driving in their car on the way to TSR for a job interview.',
)

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
User.create!([
  {
    name: 'Jess Hendricks',
    username: 'jesshmusic',
    email: 'jesshmusic72@gmail.com',
    description: 'This is the initial account for the master of the website, the boss, the Doctor.',
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
  }
])

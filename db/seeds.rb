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

create_user('Jess Hendricks', 'jesshmusic', 'jesshmusic72@gmail.com', :admin)
dm_user = create_user('Jess DM', 'jesshdm', 'jesshmusic72+dm@gmail.com', :dungeon_master)

# SrdUtilities.import_all_empty(nil)
# SrdUtilities.clean_database
# SrdUtilities.import_all
# SrdUtilities.update_monsters


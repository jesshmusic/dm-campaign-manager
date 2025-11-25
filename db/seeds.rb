# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

def create_user(name, username, email, role, auth_id)
  puts name
  if !User.exists?(email: email)
    puts "Creating user #{name} with email #{email}"
    user = User.new(
      auth_id: auth_id,
      name: name,
      username: username,
      email: email,
      sign_in_count: 1,
      current_sign_in_at: '2015-02-06 14:02:10',
      last_sign_in_at: '2015-02-06 14:02:10',
      current_sign_in_ip: '127.0.0.1',
      last_sign_in_ip: '127.0.0.1',
      role: role
    )
    user.save!
    user
  else
    User.find_by(email: email)
  end
end

User.destroy_all
create_user('Jess Hendricks', 'jesshmusic', 'jesshmusic72@gmail.com', :admin, 'google-oauth2|105145870035323364566')
create_user('Jess DM', 'jesshdm', 'jesshmusic72+dm@gmail.com', :dungeon_master, 'auth0|616dd90606721e00690fd06b')
# create_user('Jess User', 'jesshuser', 'jesshmusic72+user@gmail.com', :dungeon_master)

# Load comprehensive SRD data for test environment
if Rails.env.test?
  load Rails.root.join('db', 'seeds', 'test_srd_full.rb')
end

# ImportSrdUtilities.import_all_empty(nil)
# ImportSrdUtilities.clean_database
# ImportSrdUtilities.import_all
# ImportSrdUtilities.update_monsters


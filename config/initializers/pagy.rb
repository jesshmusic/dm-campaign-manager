# load the compact UI extra
require 'pagy/extras/bootstrap'

Rails.application.config.assets.paths << Pagy.root.join('javascripts')

# set the default items per page
Pagy::VARS[:items] = 20

web: rails s -p $PORT
client: sh -c 'rm app/assets/webpack/* || true && cd client && bundle exec rake react_on_rails:locale && yarn run build:production'
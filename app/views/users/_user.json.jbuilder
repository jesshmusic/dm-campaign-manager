# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! user, :id, :name, :username, :role, :location, :info, :sign_in_count, :created_at, :last_sign_in_at

json.dnd_classes user.dnd_classes do |dnd_class|
  json.partial! 'admin/v1/dnd_classes/dnd_class', dnd_class: dnd_class
end

json.items user.items do |item|
  json.partial! 'admin/v1/items/item', item: item
end

json.monsters user.monsters do |monster|
  json.partial! 'admin/v1/monsters/monster', monster: monster
end

json.spells user.spells do |spell|
  json.partial! 'admin/v1/spells/spell', spell: spell
end

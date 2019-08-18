# frozen_string_literal: true

json.extract! monster, :id, :name, :size, :type, :subtype, :alignment, :armor_class, :hit_points, :hit_dice, :speed, :strength, :dexterity, :constitution, :intelligence, :wisdom, :charisma, :damage_vulnerabilities, :damage_resistances, :damage_immunities, :condition_immunities, :senses, :languages, :challenge_rating, :api_url, :created_at, :updated_at
json.url monster_url(monster, format: :json)

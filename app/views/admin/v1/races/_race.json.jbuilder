# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! race, :id, :name, :speed, :strength_modifier, :dexterity_modifier,
              :constitution_modifier, :intelligence_modifier, :wisdom_modifier,
              :charisma_modifier, :user_id, :slug

# frozen_string_literal: true

json.array! @monsters, partial: 'admin/v1/monsters/monster', as: :monster

# frozen_string_literal: true

class HomeController < ApplicationController
  layout 'home'

  def index
    @user = current_user&.as_json
    @home_props = {
      dndClasses: {
        dndClasses: [],
        count: DndClass.count
      },
      items: {
        items: [],
        count: Item.count
      },
      monsters: {
        monsters: [],
        count: Monster.count
      },
      races: {
        races: [],
        count: Race.count
      },
      spells: {
        spells: [],
        count: Spell.count
      },
      users: {
        users: [],
        count: User.count,
        user: @user
      }
    }
  end
end

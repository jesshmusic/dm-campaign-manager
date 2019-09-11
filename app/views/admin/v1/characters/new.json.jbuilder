# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! @character, :name, :alignment, :background,
              :copper_pieces, :description, :electrum_pieces, :gold_pieces, :languages,
              :platinum_pieces, :role, :silver_pieces, :type, :xp, :armor_class, :strength,
              :dexterity, :constitution, :intelligence, :wisdom, :charisma, :hit_points

json.character_classes @character.character_classes

# frozen_string_literal: true

json.partial! 'admin/v1/monsters/monster', monster: @monster
json.fgu_xml @monster.export

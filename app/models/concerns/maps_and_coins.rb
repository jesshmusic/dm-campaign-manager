# frozen_string_literal: true

# jsonb columns shared by sessions and quests:
# - a list of Foundry scenes used as maps, [{ "uuid": "Scene.xxxx", "name": "Mountain Pass" }]
# - a set of coins (treasure or a reward), { "gp": 50, "sp": 12 }
module MapsAndCoins
  extend ActiveSupport::Concern

  MAX_FOUNDRY_SCENES = 20
  MAX_SCENE_NAME = 120
  COINS = %w[pp gp ep sp cp].freeze
  MAX_COINS = 1_000_000

  class_methods do
    # Scenes arrive (from Foundry or the website) as [{ uuid:, name: }]; keep
    # only those keys. Anything else is left for validation to reject.
    def foundry_scene_list(attribute)
      define_method(:"#{attribute}=") do |value|
        value = [] if value.nil?
        value = value.map { |scene| scene.respond_to?(:to_unsafe_h) ? scene.to_unsafe_h : scene } if value.is_a?(Array)
        value = value.map { |scene| scene.is_a?(Hash) ? scene.stringify_keys.slice('uuid', 'name') : scene } if value.is_a?(Array)
        super(value)
      end

      validate { validate_foundry_scenes(attribute) }
    end

    # Coins arrive as { gp: 50, sp: 12 }. Whole numbers sent as text (from a
    # form) become numbers; anything else is left for validation to reject.
    def coin_purse(attribute)
      define_method(:"#{attribute}=") do |value|
        value = {} if value.nil?
        value = value.to_unsafe_h if value.respond_to?(:to_unsafe_h)
        if value.is_a?(Hash)
          value = value.each_with_object({}) do |(coin, count), coins|
            coins[coin.to_s] = count.is_a?(String) && count.match?(/\A\d+\z/) ? count.to_i : count
          end
        end
        super(value)
      end

      validate { validate_coins(attribute) }
    end
  end

  # The scene UUIDs in a list of Foundry scenes, skipping anything malformed
  def self.scene_uuids(scenes)
    Array(scenes).filter_map { |scene| scene['uuid'] if scene.is_a?(Hash) }
  end

  private

  def validate_foundry_scenes(attribute)
    scenes = public_send(attribute)
    return if scenes.is_a?(Array) && scenes.size <= MAX_FOUNDRY_SCENES && scenes.all? { |scene| foundry_scene?(scene) }

    errors.add(attribute, "must be up to #{MAX_FOUNDRY_SCENES} Foundry scenes, each with a scene UUID and a name " \
                          "of up to #{MAX_SCENE_NAME} characters")
  end

  def foundry_scene?(scene)
    scene.is_a?(Hash) && scene['uuid'].is_a?(String) && scene['uuid'].match?(CampaignLocation::FOUNDRY_SCENE_UUID) &&
      scene['name'].is_a?(String) && scene['name'].present? && scene['name'].length <= MAX_SCENE_NAME
  end

  def validate_coins(attribute)
    coins = public_send(attribute)
    valid = coins.is_a?(Hash) && coins.all? do |coin, count|
      COINS.include?(coin) && count.is_a?(Integer) && count.between?(0, MAX_COINS)
    end
    return if valid

    errors.add(attribute, "must be whole numbers of #{COINS.to_sentence(last_word_connector: ' and ')}, " \
                          "up to #{MAX_COINS.to_fs(:delimited)} each")
  end
end

# The words of the new-campaign setup guide, shown on Dungeon Master Guru and
# in the Foundry module, and edited by an admin. The steps and templates are
# fixed: admins change their words, never which ones there are or their order.
#
# The current words are inserted here so the guide isn't empty when this goes
# live. The books and review steps are worded for both the website and Foundry.
class CreateSetupGuide < ActiveRecord::Migration[7.1]
  # Lightweight models, so this migration doesn't depend on the app's
  class SetupGuideStep < ActiveRecord::Base
    self.table_name = 'setup_guide_steps'
  end

  class SetupGuideTemplate < ActiveRecord::Base
    self.table_name = 'setup_guide_templates'
  end

  STEPS = [
    {
      key: 'kind',
      label: 'Kind',
      title: 'What kind of game?',
      intro: 'Choose the shape of your campaign. It decides what we set up for you, and you can change any of it later.',
      why: 'It gives your campaign the right structure from the start: a story arc gets its sessions, acts and main ' \
           'threat, a sandbox gets a questline and a villain, and a one-shot gets a five-room dungeon. Not sure? ' \
           'Pick a story arc.',
      example: nil
    },
    {
      key: 'pitch',
      label: 'Pitch',
      title: 'The pitch',
      intro: 'Give your campaign a name, and say what it is about in a sentence or two.',
      why: 'A good premise is a situation, not a plot: who is in trouble, what is at stake, and why the characters ' \
           'would care. Prep the situation and let the players decide what happens next.',
      example: 'The dead are rising in Hommlet, and the temple that should stop them is hiding something. ' \
               'Tone: survival horror.'
    },
    {
      key: 'table',
      label: 'Table',
      title: 'The table',
      intro: 'Who is playing, at what level, and for how long.',
      why: 'This sets the scale of the campaign: how dangerous the threats should be, how quickly the characters ' \
           'level up, and how many sessions to plan for.',
      example: 'Four players, levels 3 to 8, six sessions, played weekly.'
    },
    {
      key: 'world',
      label: 'World',
      title: 'The world',
      intro: 'Where the campaign happens, and what everyone at the table knows about it.',
      why: 'Truths are short facts every player knows before the first session. Six of them set the mood better ' \
           'than pages of history, and give the players something to build their characters around.',
      example: "The dead do not rest easy in the Flanaess.\n" \
               "The Church of Pelor has closed its doors to the poor.\n" \
               "Hommlet’s walls were built for bandits, not armies."
    },
    {
      key: 'books',
      label: 'Books',
      title: 'Your books',
      intro: 'Choose the compendiums this campaign uses for monsters, spells, items and tables.',
      why: 'On Dungeon Master Guru, monster and treasure searches use these, and each pick becomes a link in your ' \
           'session journals: click it to open the stat block, or drag it onto a scene to place a token. In a ' \
           'Foundry world, drag entries from these compendiums straight into your journals.',
      example: nil
    },
    {
      key: 'review',
      label: 'Review',
      title: 'Review and create',
      intro: 'Check your brief. You can change any of it later.',
      why: nil,
      example: nil
    }
  ].freeze

  TEMPLATES = [
    {
      key: 'three_act',
      title: 'Story arc',
      description: 'A set number of sessions, like a six-week campaign. Creates every session with levels rising ' \
                   'toward your target, three acts, and a main threat with a clock.',
      example: 'Six weekly sessions to stop a zombie plague in Greyhawk.'
    },
    {
      key: 'sandbox',
      title: 'Sandbox',
      description: 'An open-ended campaign driven by quests and villains. Creates a main questline and a villain ' \
                   'front; add sessions as you go.',
      example: 'The party roams the Wild Coast, taking jobs from a quest board while two villains scheme.'
    },
    {
      key: 'five_room',
      title: 'One-shot',
      description: 'A single adventure built on the five-room dungeon: guardian, puzzle, setback, climax, reward.',
      example: 'One stormy night in a haunted lighthouse.'
    },
    {
      key: 'blank',
      title: 'Blank',
      description: 'Start from scratch and build it your way.',
      example: 'For when you already know exactly what you want.'
    }
  ].freeze

  def up
    create_table :setup_guide_steps do |t|
      t.string :key, null: false
      t.integer :position, null: false
      t.string :label, null: false
      t.string :title, null: false
      t.text :intro, null: false
      t.text :why
      t.text :example
      t.timestamps
    end
    add_index :setup_guide_steps, :key, unique: true

    create_table :setup_guide_templates do |t|
      t.string :key, null: false
      t.integer :position, null: false
      t.string :title, null: false
      t.text :description, null: false
      t.text :example, null: false, default: ''
      t.timestamps
    end
    add_index :setup_guide_templates, :key, unique: true

    seed_words
  end

  def down
    drop_table :setup_guide_templates
    drop_table :setup_guide_steps
  end

  # The guide's words as they were when the tables were made
  def seed_words
    SetupGuideStep.reset_column_information
    SetupGuideTemplate.reset_column_information
    STEPS.each_with_index { |step, index| SetupGuideStep.create!(step.merge(position: index)) }
    TEMPLATES.each_with_index { |template, index| SetupGuideTemplate.create!(template.merge(position: index)) }
  end
end

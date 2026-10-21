require 'rails_helper'

RSpec.describe MonsterFoundryActor do
  let(:monster) do
    create(:monster, user: nil, name: 'Ghast', edition: '2024', size: 'Medium', monster_type: 'Undead', monster_subtype: '',
                     alignment: 'chaotic evil', challenge_rating: '2', armor_class: 13, hit_points: 36, hit_dice: '8d8',
                     strength: 16, dexterity: 17, constitution: 10, intelligence: 11, wisdom: 10, charisma: 8,
                     languages: 'Common, Deep Speech, Klingon', damage_immunities: ['poison', 'nonmagical attacks'],
                     damage_resistances: ['Necrotic'], damage_vulnerabilities: [], condition_immunities: %w[charmed poisoned],
                     description: 'A <b>hungry</b> corpse')
  end
  let(:actor) { described_class.new(monster.reload).to_h }

  before do
    # Only what each example gives it
    [monster.speeds, monster.senses, monster.monster_actions, monster.special_abilities, monster.reactions,
     monster.legendary_actions].each(&:destroy_all)
    monster.speeds.create!(name: 'Walk', value: 30)
    monster.speeds.create!(name: 'Fly', value: 0)
    monster.speeds.create!(name: 'Hover', value: 0)
    monster.senses.create!(name: 'Darkvision', value: '60 ft.')
    monster.senses.create!(name: 'Passive Perception', value: '10')
    monster.monster_actions.create!(name: 'Claw', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft. Hit: 10 (2d6 + 3) slashing damage.')
    monster.special_abilities.create!(name: 'Stench', desc: 'Creatures nearby are poisoned.')
  end

  it 'is a dnd5e NPC with its artwork and a prototype token sized for it' do
    expect(actor).to include(name: 'Ghast', type: 'npc', img: described_class::IMG)
    expect(actor[:prototypeToken]).to eq(name: 'Ghast', actorLink: false, disposition: -1, width: 1, height: 1,
                                         texture: { src: described_class::IMG })
  end

  it 'has its abilities, natural armor and hit points' do
    expect(actor[:system][:abilities]).to eq(str: { value: 16 }, dex: { value: 17 }, con: { value: 10 }, int: { value: 11 },
                                             wis: { value: 10 }, cha: { value: 8 })
    expect(actor[:system][:attributes]).to include(ac: { flat: 13, calcs: ['natural'] },
                                                   hp: { value: 36, max: 36, formula: '8d8' })
  end

  it "has dnd5e 6's speeds and senses" do
    expect(actor[:system][:attributes][:movement]).to eq(speeds: { 'walk' => '30' }, units: 'ft', hover: true)
    expect(actor[:system][:attributes][:senses]).to eq(ranges: { 'darkvision' => 60 }, units: 'ft', special: '')
  end

  it 'walks 30 feet when it has no speeds' do
    monster.speeds.destroy_all

    expect(actor[:system][:attributes][:movement]).to eq(speeds: { 'walk' => '30' }, units: 'ft', hover: false)
  end

  it 'has its CR, type, alignment, biography and source' do
    expect(actor[:system][:details]).to eq(cr: 2.0, alignment: 'chaotic evil',
                                           type: { value: 'undead', subtype: '', swarm: '', custom: '' },
                                           biography: { value: '<p>A hungry corpse</p>', public: '' })
    expect(actor[:system][:source]).to include(book: 'Dungeon Master Guru', rules: '2024')
  end

  it 'keeps a fractional CR and a swarm' do
    monster.update!(challenge_rating: '1/4', monster_type: 'swarm of Tiny beasts')

    expect(actor[:system][:details]).to include(cr: 0.25, type: include(value: 'beast', swarm: 'tiny', custom: ''))
  end

  it 'puts a type dnd5e has no key for in its custom text' do
    monster.update!(monster_type: 'Spirit')

    expect(actor[:system][:details][:type]).to include(value: 'custom', custom: 'Spirit')
  end

  it "keys the traits dnd5e knows, putting the rest in each trait's custom text" do
    expect(actor[:system][:traits]).to eq(
      size: 'med',
      languages: { value: %w[common deep], custom: 'Klingon' },
      di: { value: ['poison'], custom: 'nonmagical attacks', bypasses: [] },
      dr: { value: ['necrotic'], custom: '', bypasses: [] },
      dv: { value: [], custom: '', bypasses: [] },
      ci: { value: %w[charmed poisoned], custom: '' }
    )
  end

  it 'counts legendary actions as spent and recovered' do
    expect(actor[:system][:resources][:legact]).to eq(max: 0, spent: 0)

    monster.legendary_actions.create!(name: 'Bite', desc: 'It bites.')
    expect(described_class.new(monster.reload).to_h[:system][:resources][:legact]).to eq(max: 3, spent: 0)
  end

  it 'has its actions and traits as items, with melee weapon attacks dnd5e 4 and later understand' do
    claw, stench = actor[:items]

    expect(claw).to include(name: 'Claw', type: 'weapon')
    activity = claw[:system][:activities].values.sole
    expect(activity[:_id]).to match(/\A[A-Za-z0-9]{16}\z/)
    expect(claw[:system][:activities].keys).to eq([activity[:_id]])
    expect(activity[:attack]).to include(bonus: '5', flat: true, type: { value: 'melee', classification: 'weapon' })
    expect(claw[:system][:damage][:base]).to include(number: 2, denomination: 6, bonus: '3', types: ['slashing'])
    expect(stench).to include(name: 'Stench', type: 'feat')
  end

  it 'sizes the token for big monsters' do
    monster.update!(size: 'Gargantuan')

    expect(actor[:prototypeToken]).to include(width: 4, height: 4)
    expect(actor[:system][:traits][:size]).to eq('grg')
  end
end

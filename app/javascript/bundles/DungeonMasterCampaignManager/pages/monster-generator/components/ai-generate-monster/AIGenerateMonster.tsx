import { useState } from 'react';
import styled from 'styled-components';
import { useForm, Control, FieldValues } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Frame from '../../../../components/Frame/Frame';
import Button from '../../../../components/Button/Button';
import FormSelect from '../../../../components/forms/FormSelect';
import { Colors } from '../../../../utilities/enums';
import { GiMagicSwirl, GiLinkedRings, GiFire, GiBugNet } from 'react-icons/gi';
import { SelectOption } from '../../../../utilities/types';
import axios from 'axios';
import { getHeaders } from '../../../../api/api';
import ConceptApprovalModal from './ConceptApprovalModal';
import InstructionsPanel, {
  QuickNPCInstructions,
} from '../../../../components/InstructionsPanel/InstructionsPanel';
import { addFlashMessage, FlashMessageType } from '../../../../reducers/flashMessages';

import { GenForm, TwoCol, ThreeCol } from '../../MonsterGenerator.styles';

const MOCK_CONCEPT: NpcConcept = {
  name: 'Shadow Stalker',
  description:
    'A gaunt, spectral figure wreathed in wisps of darkness, its hollow eyes burning with an eerie violet light. It moves with unnatural grace, leaving trails of frost in its wake.',
  size: 'Medium',
  monster_type: 'undead',
  alignment: 'chaotic evil',
  armor_class: 14,
  armor_description: 'natural armor',
  hit_points: 45,
  hit_dice: '6d8+18',
  challenge_rating: '3',
  xp: 700,
  prof_bonus: 2,
  strength: 14,
  dexterity: 16,
  constitution: 16,
  intelligence: 10,
  wisdom: 12,
  charisma: 8,
  speeds: [
    { name: 'walk', value: 30 },
    { name: 'fly', value: 40 },
  ],
  senses: [
    { name: 'darkvision', value: 60 },
    { name: 'passive Perception', value: 11 },
  ],
  saving_throws: ['Dex +5', 'Con +5'],
  skills: ['Stealth +7', 'Perception +3'],
  damage_resistances: ['necrotic'],
  damage_immunities: ['poison'],
  damage_vulnerabilities: ['radiant'],
  condition_immunities: ['poisoned', 'exhaustion'],
  languages: 'Common, understands the languages it knew in life',
  actions: [
    {
      name: 'Multiattack',
      desc: 'The shadow stalker makes two claw attacks.',
    },
    {
      name: 'Claw',
      desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (2d4 + 3) slashing damage plus 7 (2d6) necrotic damage.',
    },
  ],
  special_abilities: [
    {
      name: 'Shadow Stealth',
      desc: 'While in dim light or darkness, the shadow stalker can take the Hide action as a bonus action.',
    },
  ],
  reactions: [
    {
      name: 'Shadow Step',
      desc: 'When a creature the shadow stalker can see within 30 feet of it is hit by an attack, it can use its reaction to teleport to an unoccupied space within 5 feet of that creature.',
    },
  ],
  legendary_actions: [],
};

const TextAreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const TextAreaLabel = styled.label`
  color: ${({ theme }) => theme.colors.gray600};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.base};
  margin-bottom: 0.25rem;
`;

const TextArea = styled.textarea`
  border: 1px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 0.25rem;
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.base};
  min-height: 100px;
  padding: 0.5rem;
  resize: vertical;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin: 0.25rem 0 0;

  svg {
    margin-right: 0.25rem;
  }
`;

const CharacterCounter = styled.span<{ $isOver: boolean; $isNearLimit: boolean }>`
  color: ${({ theme, $isOver, $isNearLimit }) =>
    $isOver
      ? theme.colors?.danger || '#dc3545'
      : $isNearLimit
        ? theme.colors?.warning || '#ffc107'
        : theme.colors?.gray500 || '#6c757d'};
  font-family: ${({ theme }) => theme.fonts?.sansSerif || 'sans-serif'};
  font-size: ${({ theme }) => theme.fontSizes?.sm || '0.875rem'};
  margin-left: auto;
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
`;

export type AIGenerateMonsterProps = {
  isLoading?: boolean;
  isAdmin?: boolean;
  onMonsterCreated: (monster: unknown) => void;
  token?: string;
};

type FormFields = {
  description: string;
  challengeRating: SelectOption;
  monsterType: SelectOption;
  alignment: SelectOption;
};

export type NpcConcept = {
  name: string;
  description?: string;
  size: string;
  monster_type: string;
  alignment: string;
  armor_class: number;
  armor_description: string;
  hit_points: number;
  hit_dice: string;
  challenge_rating: string;
  xp: number;
  prof_bonus: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  speeds: { name: string; value: number }[];
  senses: { name: string; value: number | string }[];
  saving_throws: string[];
  skills: string[];
  damage_resistances: string[];
  damage_immunities: string[];
  damage_vulnerabilities: string[];
  condition_immunities: string[];
  languages: string;
  actions: { name: string; desc: string }[];
  special_abilities: { name: string; desc: string }[];
  reactions: { name: string; desc: string }[];
  legendary_actions: { name: string; desc: string }[];
};

const challengeRatingOptions: SelectOption[] = [
  { label: '0', value: '0' },
  { label: '1/8', value: '1/8' },
  { label: '1/4', value: '1/4' },
  { label: '1/2', value: '1/2' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' },
  { label: '11', value: '11' },
  { label: '12', value: '12' },
  { label: '13', value: '13' },
  { label: '14', value: '14' },
  { label: '15', value: '15' },
  { label: '16', value: '16' },
  { label: '17', value: '17' },
  { label: '18', value: '18' },
  { label: '19', value: '19' },
  { label: '20', value: '20' },
];

const monsterTypeOptions: SelectOption[] = [
  { label: 'Aberration', value: 'aberration' },
  { label: 'Beast', value: 'beast' },
  { label: 'Celestial', value: 'celestial' },
  { label: 'Construct', value: 'construct' },
  { label: 'Dragon', value: 'dragon' },
  { label: 'Elemental', value: 'elemental' },
  { label: 'Fey', value: 'fey' },
  { label: 'Fiend', value: 'fiend' },
  { label: 'Giant', value: 'giant' },
  { label: 'Humanoid', value: 'humanoid' },
  { label: 'Monstrosity', value: 'monstrosity' },
  { label: 'Ooze', value: 'ooze' },
  { label: 'Plant', value: 'plant' },
  { label: 'Undead', value: 'undead' },
];

const alignmentOptions: SelectOption[] = [
  { label: 'Lawful Good', value: 'lawful good' },
  { label: 'Neutral Good', value: 'neutral good' },
  { label: 'Chaotic Good', value: 'chaotic good' },
  { label: 'Lawful Neutral', value: 'lawful neutral' },
  { label: 'True Neutral', value: 'neutral' },
  { label: 'Chaotic Neutral', value: 'chaotic neutral' },
  { label: 'Lawful Evil', value: 'lawful evil' },
  { label: 'Neutral Evil', value: 'neutral evil' },
  { label: 'Chaotic Evil', value: 'chaotic evil' },
  { label: 'Unaligned', value: 'unaligned' },
];

const AIGenerateMonster = ({
  isLoading,
  isAdmin,
  onMonsterCreated,
  token,
}: AIGenerateMonsterProps) => {
  const dispatch = useDispatch();
  const [isGenerating, setIsGenerating] = useState(false);
  const [concept, setConcept] = useState<NpcConcept | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [tokenUsage, setTokenUsage] = useState<{
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  } | null>(null);

  const showError = (message: string) => {
    dispatch(
      addFlashMessage({
        id: Date.now(),
        messageType: FlashMessageType.danger,
        heading: 'Error',
        text: message,
      }),
    );
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      description: '',
      challengeRating: { label: '1', value: '1' },
      monsterType: { label: 'Humanoid', value: 'humanoid' },
      alignment: { label: 'True Neutral', value: 'neutral' },
    },
  });

  const descriptionValue = watch('description');
  const descriptionLength = descriptionValue?.length || 0;
  const maxLength = 500;

  const onSubmit = async (data: FormFields) => {
    setIsGenerating(true);

    try {
      const headers = getHeaders();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.post(
        '/v1/generate_npc_concept.json',
        {
          description: data.description,
          challenge_rating: data.challengeRating.value,
          monster_type: data.monsterType.value,
          alignment: data.alignment.value,
        },
        { headers },
      );

      if (response.data.concept) {
        setConcept(response.data.concept);
        setTokenUsage(response.data.token_usage || null);
        setShowModal(true);
      } else if (response.data.error) {
        showError(response.data.error);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        showError(err.response.data.error);
      } else {
        showError('Failed to generate concept. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async (approvedConcept: NpcConcept) => {
    try {
      const headers = getHeaders();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.post(
        '/v1/create_from_concept.json',
        { concept: approvedConcept },
        { headers },
      );

      if (response.data) {
        onMonsterCreated(response.data);
        setShowModal(false);
        setConcept(null);
        setTokenUsage(null);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        showError(err.response.data.error);
      } else {
        showError('Failed to create monster. Please try again.');
      }
    }
  };

  const handleRegenerate = () => {
    setShowModal(false);
    setConcept(null);
    handleSubmit(onSubmit)();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setConcept(null);
    setTokenUsage(null);
  };

  return (
    <>
      <Frame
        title="Quick NPC"
        subtitle="Describe your creature and let AI generate a complete stat block. Perfect for unique NPCs and custom monsters."
        subtitleAction={
          <InstructionsPanel>
            <QuickNPCInstructions />
          </InstructionsPanel>
        }
        className="ai-generate-monster"
      >
        <GenForm onSubmit={handleSubmit(onSubmit)} noValidate>
          <ThreeCol>
            <FormSelect
              control={control as unknown as Control<FieldValues>}
              label="Challenge Rating"
              name="challengeRating"
              options={challengeRatingOptions}
            />
            <FormSelect
              control={control as unknown as Control<FieldValues>}
              label="Creature Type"
              name="monsterType"
              options={monsterTypeOptions}
            />
            <FormSelect
              control={control as unknown as Control<FieldValues>}
              label="Alignment"
              name="alignment"
              options={alignmentOptions}
            />
          </ThreeCol>

          <TextAreaWrapper>
            <LabelRow>
              <TextAreaLabel htmlFor="description">Creature Description</TextAreaLabel>
              <CharacterCounter
                $isOver={descriptionLength > maxLength}
                $isNearLimit={descriptionLength >= maxLength * 0.8}
              >
                {descriptionLength}/{maxLength}
              </CharacterCounter>
            </LabelRow>
            <TextArea
              id="description"
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters',
                },
                maxLength: {
                  value: maxLength,
                  message: `Description must be ${maxLength} characters or less`,
                },
              })}
              placeholder="Describe your creature in detail. Include personality, appearance, combat style, and any special abilities you want."
            />
            {errors.description && (
              <ErrorMessage>
                <GiFire /> {errors.description.message as string}
              </ErrorMessage>
            )}
          </TextAreaWrapper>

          <TwoCol>
            {isAdmin && (
              <Button
                color={Colors.warning}
                title="Debug Modal"
                type="button"
                onClick={() => {
                  setConcept(MOCK_CONCEPT);
                  setShowModal(true);
                }}
                icon={<GiBugNet size={24} />}
              />
            )}
            <Button
              color={Colors.success}
              disabled={isGenerating || isLoading}
              title={isGenerating ? 'Generating...' : 'Generate Creature'}
              type="submit"
              icon={
                isGenerating ? (
                  <GiLinkedRings size={24} className="spinner" />
                ) : (
                  <GiMagicSwirl size={24} />
                )
              }
            />
          </TwoCol>
        </GenForm>
      </Frame>

      {showModal && concept && (
        <ConceptApprovalModal
          concept={concept}
          onApprove={handleApprove}
          onRegenerate={handleRegenerate}
          onClose={handleCloseModal}
          isLoading={isLoading}
          isAdmin={isAdmin}
          tokenUsage={tokenUsage || undefined}
        />
      )}
    </>
  );
};

export default AIGenerateMonster;

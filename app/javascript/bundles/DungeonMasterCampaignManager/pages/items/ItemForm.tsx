import React from 'react';
import { useForm, Controller, Control, FieldValues } from 'react-hook-form';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ItemProps } from '../../utilities/types';
import { ControlledInput, ControlledSelect } from '../../components/forms/ControllerInput';
import { Checkbox, FormWrapper, FormLabel } from '../../components/forms/Forms.styles';

const FormGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidthField = styled.div`
  grid-column: 1 / -1;
`;

const TwoColumnField = styled.div`
  grid-column: span 2;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
  }
`;

const CheckboxWrapper = styled(FormWrapper)`
  align-items: center;
  flex-direction: row;
  gap: 0.5rem;

  label {
    margin-bottom: 0;
  }
`;

const QuillWrapper = styled.div`
  .quill {
    background-color: white;
    border-radius: 0.25rem;
  }

  .ql-container {
    min-height: 150px;
    font-family: ${({ theme }) => theme.fonts?.sansSerif || 'sans-serif'};
  }

  .ql-editor {
    min-height: 150px;
  }
`;

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link'],
    ['clean'],
  ],
};

export type ItemFormData = {
  name: string;
  description: string;
  category: string;
  cost_quantity: number;
  cost_unit: string;
  weight: string;
  armor_class: string;
  armor_type: string;
  stealth: string;
  strength: string;
  damage: string;
  properties: string;
  category_range: string;
  mastery: string;
  rarity: string;
  requires_attunement: string;
  magic_item_type: string;
  tool_category: string;
  gear_category: string;
  vehicle_category: string;
  speed: string;
  capacity: string;
  homebrew: boolean;
};

type ItemFormProps = {
  initialData?: ItemProps | null;
  onSubmit: (data: ItemFormData) => void;
  isSubmitting?: boolean;
};

const categoryOptions = [
  { value: 'Armor', label: 'Armor' },
  { value: 'Weapon', label: 'Weapon' },
  { value: 'Adventuring Gear', label: 'Adventuring Gear' },
  { value: 'Tools', label: 'Tools' },
  { value: 'Mounts and Vehicles', label: 'Mounts and Vehicles' },
  { value: 'Magic Item', label: 'Magic Item' },
  { value: 'Magic Armor Item', label: 'Magic Armor' },
  { value: 'Magic Weapon Item', label: 'Magic Weapon' },
];

const costUnitOptions = [
  { value: 'cp', label: 'Copper (cp)' },
  { value: 'sp', label: 'Silver (sp)' },
  { value: 'ep', label: 'Electrum (ep)' },
  { value: 'gp', label: 'Gold (gp)' },
  { value: 'pp', label: 'Platinum (pp)' },
];

const rarityOptions = [
  { value: '-', label: 'None' },
  { value: 'common', label: 'Common' },
  { value: 'uncommon', label: 'Uncommon' },
  { value: 'rare', label: 'Rare' },
  { value: 'very rare', label: 'Very Rare' },
  { value: 'legendary', label: 'Legendary' },
  { value: 'artifact', label: 'Artifact' },
];

const armorTypeOptions = [
  { value: 'Light', label: 'Light' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Heavy', label: 'Heavy' },
  { value: 'Shield', label: 'Shield' },
];

const weaponTypeOptions = [
  { value: 'Simple Melee', label: 'Simple Melee' },
  { value: 'Simple Ranged', label: 'Simple Ranged' },
  { value: 'Martial Melee', label: 'Martial Melee' },
  { value: 'Martial Ranged', label: 'Martial Ranged' },
];

const masteryOptions = [
  { value: '', label: 'None' },
  { value: 'Cleave', label: 'Cleave' },
  { value: 'Graze', label: 'Graze' },
  { value: 'Nick', label: 'Nick' },
  { value: 'Push', label: 'Push' },
  { value: 'Sap', label: 'Sap' },
  { value: 'Slow', label: 'Slow' },
  { value: 'Topple', label: 'Topple' },
  { value: 'Vex', label: 'Vex' },
];

const ItemForm: React.FC<ItemFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting: _isSubmitting = false,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ItemFormData>({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.desc?.join('\n\n') || '',
      category: initialData?.category || 'Adventuring Gear',
      cost_quantity: initialData?.cost?.quantity || 0,
      cost_unit: initialData?.cost?.unit || 'gp',
      weight: initialData?.weight || '',
      armor_class: initialData?.armorClass || '',
      armor_type: initialData?.armorType || '',
      stealth: initialData?.stealth || '',
      strength: initialData?.strength || '',
      damage: initialData?.damage || '',
      properties: initialData?.properties || '',
      category_range: initialData?.categoryRange || '',
      mastery: initialData?.mastery || '',
      rarity: initialData?.rarity || '-',
      requires_attunement: initialData?.requiresAttunement || '',
      magic_item_type: initialData?.magicItemType || '',
      tool_category: initialData?.toolCategory || '',
      gear_category: initialData?.gearCategory || '',
      vehicle_category: initialData?.vehicleCategory || '',
      speed: initialData?.speed || '',
      capacity: initialData?.capacity || '',
      homebrew: false,
    },
  });

  // Cast control to satisfy ControlledInput type expectations
  const typedControl = control as unknown as Control<FieldValues, object>;

  const selectedCategory = watch('category');

  const isArmor = ['Armor', 'Magic Armor Item'].includes(selectedCategory);
  const isWeapon = ['Weapon', 'Magic Weapon Item'].includes(selectedCategory);
  const isMagic = ['Magic Item', 'Magic Armor Item', 'Magic Weapon Item'].includes(
    selectedCategory,
  );
  const isVehicle = selectedCategory === 'Mounts and Vehicles';
  const isTool = selectedCategory === 'Tools';
  const isGear = selectedCategory === 'Adventuring Gear';

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e);
      }}
      id="item-form">
      <FormGrid>
        <TwoColumnField>
          <ControlledInput fieldName="name" control={typedControl} label="Name" errors={errors} />
        </TwoColumnField>

        <ControlledSelect
          fieldName="category"
          control={typedControl}
          label="Category"
          options={categoryOptions}
        />

        <ControlledInput
          fieldName="cost_quantity"
          control={typedControl}
          label="Cost (quantity)"
          errors={errors}
          type="number"
        />

        <ControlledSelect
          fieldName="cost_unit"
          control={typedControl}
          label="Cost (unit)"
          options={costUnitOptions}
        />

        <ControlledInput fieldName="weight" control={typedControl} label="Weight" errors={errors} />

        {isArmor && (
          <>
            <ControlledSelect
              fieldName="armor_type"
              control={typedControl}
              label="Armor Type"
              options={armorTypeOptions}
            />
            <ControlledInput
              fieldName="armor_class"
              control={typedControl}
              label="Armor Class"
              errors={errors}
            />
            <ControlledInput
              fieldName="stealth"
              control={typedControl}
              label="Stealth"
              errors={errors}
            />
            <ControlledInput
              fieldName="strength"
              control={typedControl}
              label="Strength Requirement"
              errors={errors}
            />
          </>
        )}

        {isWeapon && (
          <>
            <ControlledSelect
              fieldName="category_range"
              control={typedControl}
              label="Weapon Type"
              options={weaponTypeOptions}
            />
            <ControlledInput
              fieldName="damage"
              control={typedControl}
              label="Damage"
              errors={errors}
            />
            <ControlledSelect
              fieldName="mastery"
              control={typedControl}
              label="Mastery"
              options={masteryOptions}
            />
            <TwoColumnField>
              <ControlledInput
                fieldName="properties"
                control={typedControl}
                label="Properties"
                errors={errors}
              />
            </TwoColumnField>
          </>
        )}

        {isMagic && (
          <>
            <ControlledSelect
              fieldName="rarity"
              control={typedControl}
              label="Rarity"
              options={rarityOptions}
            />
            <ControlledInput
              fieldName="requires_attunement"
              control={typedControl}
              label="Attunement"
              errors={errors}
            />
            {selectedCategory === 'Magic Item' && (
              <ControlledInput
                fieldName="magic_item_type"
                control={typedControl}
                label="Magic Item Type"
                errors={errors}
              />
            )}
          </>
        )}

        {isVehicle && (
          <>
            <ControlledInput
              fieldName="vehicle_category"
              control={typedControl}
              label="Vehicle Category"
              errors={errors}
            />
            <ControlledInput
              fieldName="speed"
              control={typedControl}
              label="Speed"
              errors={errors}
            />
            <ControlledInput
              fieldName="capacity"
              control={typedControl}
              label="Capacity"
              errors={errors}
            />
          </>
        )}

        {isTool && (
          <ControlledInput
            fieldName="tool_category"
            control={typedControl}
            label="Tool Category"
            errors={errors}
          />
        )}

        {isGear && (
          <ControlledInput
            fieldName="gear_category"
            control={typedControl}
            label="Gear Category"
            errors={errors}
          />
        )}

        <FullWidthField>
          <FormWrapper>
            <FormLabel>Description</FormLabel>
            <QuillWrapper>
              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ReactQuill
                    theme="snow"
                    value={value || ''}
                    onChange={onChange}
                    modules={quillModules}
                  />
                )}
              />
            </QuillWrapper>
          </FormWrapper>
        </FullWidthField>

        <CheckboxWrapper>
          <Controller
            name="homebrew"
            control={control}
            render={({ field: { value, onChange, ...rest } }) => (
              <Checkbox
                type="checkbox"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                {...rest}
              />
            )}
          />
          <FormLabel htmlFor="homebrew">Homebrew</FormLabel>
        </CheckboxWrapper>
      </FormGrid>
    </form>
  );
};

export default ItemForm;

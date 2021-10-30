import React from 'react';
import { gsap } from 'gsap/gsap-core';
import { Control, FieldErrors, useWatch } from 'react-hook-form';
import { ControlledInput } from '../../../../components/forms/ControllerInput';
import Button from '../../../../components/Button/Button';
import { Colors } from '../../../../utilities/enums';
import { GiTrashCan } from 'react-icons/gi';
import AbilityForm from './AbilityForm';
import AttackForm from './AttackForm';
import { ActionTypes } from '../../../../utilities/types';
import SpellcastingForm from './SpellcastingForm';
import { BsChevronDown, BsChevronUp } from 'react-icons/all';

const styles = require('./action-form.module.scss');

const ActionForm = (props: {
  actionIndex: number;
  control: Control;
  errors: FieldErrors;
  remove: (index?: number | number[] | undefined) => void;
}) => {
  const { actionIndex, control, errors, remove } = props;
  const [isShowingContent, setIsShowingContent] = React.useState(true);
  const isFirstRender = React.useRef(true);

  const actionType = useWatch({
    control,
    name: `actions.${actionIndex}.actionType`,
    defaultValue: ActionTypes.attack,
  });

  const slots = useWatch({
    control,
    name: `actions.${actionIndex}.spellCasting.slots`,
  });

  const collapseActionContent = () => {
    setIsShowingContent(!isShowingContent);
  };

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      gsap.set(`#actionContent${actionIndex}`, {
        height: 'auto',
      });
    } else {
      if (!isShowingContent) {
        gsap.to(`#actionContent${actionIndex}`, {
          height: 0,
          duration: 0.75,
          ease: 'back.inOut',
        });
      } else {
        gsap.to(`#actionContent${actionIndex}`, {
          height: 'auto',
          duration: 0.75,
          ease: 'back.inOut',
        });
      }
    }
  }, [isShowingContent]);

  return (
    <div className={styles.actionContainer}>
      <div className={styles.actionWrapper}>
        <Button
          color={Colors.transparentLight}
          title="Collapse"
          hideTitle
          icon={
            isShowingContent ? (
              <BsChevronDown size={24} />
            ) : (
              <BsChevronUp size={24} />
            )
          }
          onClick={collapseActionContent}
        />
        <ControlledInput
          fieldName={`actions.${actionIndex}.name`}
          errors={errors}
          className={styles.actionCol}
          control={control}
          label="Name"
        />
        <Button
          type="button"
          onClick={() => remove(actionIndex)}
          color={Colors.danger}
          icon={<GiTrashCan size={30} />}
          hideTitle
          title="Remove Action"
        />
      </div>
      <div id={`actionContent${actionIndex}`} className={styles.actionContent}>
        <AbilityForm
          control={control}
          errors={errors}
          fieldName={`actions.${actionIndex}`}
          readOnly={actionType !== ActionTypes.ability}
        />
        {actionType === ActionTypes.attack && (
          <AttackForm
            control={control}
            errors={errors}
            fieldName={`actions.${actionIndex}`}
          />
        )}
        {actionType === ActionTypes.spellCasting && (
          <SpellcastingForm
            control={control}
            errors={errors}
            fieldName={`actions.${actionIndex}`}
          />
        )}
      </div>
    </div>
  );
};

export default ActionForm;

import React from 'react';
import { GiMailedFist } from 'react-icons/all';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { Colors } from '../../../../utilities/enums';
import Button from '../../../../components/Button/Button';

const styles = require('../../../../components/forms/input.module.scss');
const genStyles = require('../generator.module.scss');

type ChallengeRatingFieldProps = {
  onCalculateCr: () => void;
  register: UseFormRegister<FieldValues>;
};

const ChallengeRatingField = (props: ChallengeRatingFieldProps) => {
  const { onCalculateCr, register } = props;
  return (
    <div className={`${styles.wrapper} ${genStyles.challenge}`}>
      <label className={styles.label}>Challenge</label>
      <div className={styles.inputGroup}>
        <input
          className={styles.input}
          autoComplete={''}
          type={'text'}
          placeholder={'Challenge'}
          readOnly
          {...register('challengeRating')}
        />
        <Button
          color={Colors.primary}
          title="Calculate Challenge"
          hideTitle
          onClick={onCalculateCr}
          icon={<GiMailedFist size={22} />}
        />
      </div>
    </div>
  );
};

export default ChallengeRatingField;

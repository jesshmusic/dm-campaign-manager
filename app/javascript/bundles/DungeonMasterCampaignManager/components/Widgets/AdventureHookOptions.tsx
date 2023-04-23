import React, { useState } from 'react';
import Button from '../Button/Button';
import { Colors } from '../../utilities/enums';
import { GiLevelTwoAdvanced } from 'react-icons/all';

import '../forms/inputOverrides.scss';
const styles = require('./widgets.module.scss');

interface NameOptionsProps {
  onFormSubmit: (partySize: number, averageLevel: number) => void;
}

const AdventureHookOptions = ({ onFormSubmit }: NameOptionsProps) => {
  const [partySize, setPartySize] = useState(5);
  const [averageLevel, setAverageLevel] = useState(1);

  const handleSubmit = (event) => {
    event.preventDefault();
    onFormSubmit(partySize, averageLevel);
  };

  return (
    <div className={styles.nameOptions}>
      <div className={styles.submitButton}>
        <label htmlFor={'nameGeneratorGender'}>Submit</label>
        <Button
          id={'adventureHookGeneratorSubmit'}
          color={Colors.primary}
          icon={<GiLevelTwoAdvanced />}
          onClick={handleSubmit}
          title="Get Hook"
        />
      </div>
      <div className={styles.genderSelect}>
        <label className={styles.label} htmlFor="partySize">
          Number of Players
        </label>
        <input
          className={styles.input}
          type="number"
          name="partySize"
          value={partySize}
          onChange={(e) => setPartySize(parseInt(e.target.value, 10))}
        />
      </div>
      <div className={styles.raceSelect}>
        <label className={styles.label} htmlFor="partySize">
          Average Player Level
        </label>
        <input
          className={styles.input}
          type="number"
          name="averageLevel"
          value={averageLevel}
          onChange={(e) => setAverageLevel(parseInt(e.target.value, 10))}
        />
      </div>
    </div>
  );
};

export default AdventureHookOptions;

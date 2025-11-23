import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import FormSelectAsync from '../../../components/forms/FormSelectAsync';
import { filterOptionsWithData } from '../../../utilities/character-utilities';
import axios, { AxiosResponse } from 'axios';

import styles from './generator.module.scss';

const SavesSkillsSection = (props: { UseForm: UseFormReturn }) => {
  const { UseForm } = props;

  const getSavingThrows = (inputValue: string, callback: unknown) => {
    axios
      .get(`/v1/saving-throws.json?search=${inputValue}`)
      .then((response: AxiosResponse<unknown>) => {
        const options = filterOptionsWithData(response.data.results);
        callback(options);
      })
      .catch((_error) => {});
  };

  const getSkills = (inputValue: string, callback: unknown) => {
    axios
      .get(`/v1/prof-skills.json?search=${inputValue}`)
      .then((response: AxiosResponse<unknown>) => {
        const options = filterOptionsWithData(response.data.results);
        callback(options);
      })
      .catch((_error) => {});
  };

  return (
    <div className={styles.twoCol}>
      <FormSelectAsync
        label="Saving Throws"
        name="savingThrowOptions"
        control={UseForm.control}
        getOptions={getSavingThrows}
        isMulti
      />
      <FormSelectAsync
        label="Skills"
        name="skillOptions"
        control={UseForm.control}
        getOptions={getSkills}
        isMulti
      />
    </div>
  );
};

export default SavesSkillsSection;

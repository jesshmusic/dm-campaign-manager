import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import FormSelectAsync from '../../../../../components/forms/FormSelectAsync';
import FormSelect from '../../../../../components/forms/FormSelect';
import { damageTypes, filterOptionsWithData } from '../../../../../utilities/character-utilities';
import axios, { AxiosResponse } from 'axios';

const styles = require('../../generator.module.scss');

const ResistancesSection = (props: { UseForm: UseFormReturn }) => {
  const { UseForm } = props;

  const getConditions = (inputValue: string, callback: any) => {
    axios
      .get(`/v1/conditions.json?search=${inputValue}`)
      .then((response: AxiosResponse<any>) => {
        const options = filterOptionsWithData(response.data.results);
        callback(options);
      })
      .catch((error) => {});
  };

  return (
    <div className={styles.fourCol}>
      <FormSelectAsync
        label="Condition Immunities"
        name="conditionImmunitiesOptions"
        control={UseForm.control}
        getOptions={getConditions}
        isMulti
      />
      <FormSelect
        label="Damage Resistances"
        name="damageResistancesOptions"
        control={UseForm.control}
        isCreatable
        isMulti
        options={damageTypes}
      />
      <FormSelect
        label="Damage Immunities"
        name="damageImmunitiesOptions"
        control={UseForm.control}
        isCreatable
        isMulti
        options={damageTypes}
      />
      <FormSelect
        label="Damage Vulnerabilities"
        name="damageVulnerabilitiesOptions"
        control={UseForm.control}
        isCreatable
        isMulti
        options={damageTypes}
      />
    </div>
  );
};

export default ResistancesSection;

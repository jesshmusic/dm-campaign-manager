/**
 * Created by jesshendricks on 9/18/19
 */

import React from 'react';
import { WeaponState } from '../../../../utilities/character-utilities';
import Form from 'react-bootstrap/Form';
import FormField from '../../../../components/forms/FormField';

const WeaponRadios = () => {
  return (
    <Form.Row>
      <FormField
        label={WeaponState.SINGLE}
        name={'weaponState'}
        colWidth={'3'}
        type={'radio'}
        value={WeaponState.SINGLE}
        id={'weaponStateSingleRadio'}
      />
      <FormField
        label={WeaponState.TWOHAND}
        name={'weaponState'}
        colWidth={'3'}
        type={'radio'}
        value={WeaponState.TWOHAND}
        id={'weaponStateTwoHandRadio'}/>
      <FormField
        label={WeaponState.SHIELD}
        name={'weaponState'}
        colWidth={'3'}
        type={'radio'}
        value={WeaponState.SHIELD}
        id={'weaponStateShieldRadio'}/>
      <FormField
        label={WeaponState.DUAL}
        name={'weaponState'}
        colWidth={'3'}
        type={'radio'}
        value={WeaponState.DUAL}
        id={'weaponStateDualRadio'}/>
    </Form.Row>
  );
};

WeaponRadios.propTypes = {};

export default WeaponRadios;
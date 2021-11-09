import React from 'react';
import NameOptions from '../../front-page/components/NameOptions';
import Frame from '../../../components/Frame/Frame';
import { UserProps } from '../../../utilities/types';

const GenerateCommoner = (props: {
  onFormSubmit: () => void;
  token?: string;
}) => {
  return (
    <Frame
      title="Generate Commoner"
      subtitle="Quickly generate a random commoner"
    >
      <NameOptions
        onFormSubmit={props.onFormSubmit}
        title={'Commoner'}
        token={props.token}
      />
    </Frame>
  );
};

export default GenerateCommoner;

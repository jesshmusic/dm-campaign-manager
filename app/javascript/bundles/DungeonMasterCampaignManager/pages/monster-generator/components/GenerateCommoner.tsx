import React from 'react';
import NameOptions from '../../../components/Widgets/NameOptions';
import Frame from '../../../components/Frame/Frame';

const GenerateCommoner = (props: { onFormSubmit: () => void; token?: string }) => {
  return (
    <Frame title="Generate Commoner" subtitle="Quickly generate a random commoner">
      <NameOptions onFormSubmit={props.onFormSubmit} title={'Commoner'} token={props.token} />
    </Frame>
  );
};

export default GenerateCommoner;

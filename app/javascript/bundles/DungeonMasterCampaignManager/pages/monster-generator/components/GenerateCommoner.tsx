import React from 'react';
import NameOptions from '../../../components/forms/NameOptions';
import Frame from '../../../components/Frame/Frame';

const GenerateCommoner = (props: { onFormSubmit: () => void }) => {
  return (
    <Frame
      title="Generate Commoner"
      subtitle="Quickly generate a random commoner"
    >
      <NameOptions onFormSubmit={props.onFormSubmit} title={'Commoner'} />
    </Frame>
  );
};

// GenerateCommoner.propTypes = {
//   onFormSubmit: PropTypes.func
// };

export default GenerateCommoner;

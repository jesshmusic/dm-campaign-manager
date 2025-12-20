import { Colors } from '../../utilities/enums';
import { GiCrossMark } from 'react-icons/gi';
import Button from './Button';

import { CloseButtonWrapper } from './Button.styles';

const CloseButton = (props: { onClick: () => void }) => {
  const { onClick } = props;

  return (
    <CloseButtonWrapper>
      <Button
        color={Colors.transparent}
        icon={<GiCrossMark />}
        hideTitle
        title="X"
        onClick={onClick}
      />
    </CloseButtonWrapper>
  );
};

export default CloseButton;

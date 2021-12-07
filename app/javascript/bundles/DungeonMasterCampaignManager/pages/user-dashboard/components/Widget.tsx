import React from 'react';
import Frame from '../../../components/Frame/Frame';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import { GrClose } from 'react-icons/all';

type WidgetProps = {
  id: string;
  onRemoveItem: (id: string) => void;
  component: any;
  title: string;
  subtitle: string;
  hideFrame: boolean;
};

const Widget = ({ id, onRemoveItem, component: Item, title, subtitle, hideFrame }) => {
  return (
    <Frame
      style={{ width: '100%', height: '100%' }}
      title={title}
      subtitle={subtitle}
      actionButton={
        <Button
          color={Colors.primary}
          icon={<GrClose />}
          hideTitle
          title="X"
          onClick={() => onRemoveItem(id)}
        />
      }
    >
      <Item hideFrame={hideFrame} />
    </Frame>
  );
};

export default Widget;

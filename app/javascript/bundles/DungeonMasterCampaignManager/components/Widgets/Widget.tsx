import React from 'react';
import Frame from '../Frame/Frame';
import CloseButton from '../Button/CloseButton';

type WidgetProps = {
  id: string;
  onRemoveItem: (id: string) => void;
  component: any;
  title: string;
  subtitle: string;
  hideFrame: boolean;
};

const Widget = ({ id, onRemoveItem, component: Item, title, subtitle, hideFrame }: WidgetProps) => {
  return (
    <Frame
      style={{ width: '100%', height: '100%' }}
      title={title}
      subtitle={subtitle}
      actionButton={<CloseButton onClick={() => onRemoveItem(id)} />}
    >
      <Item hideFrame={hideFrame} />
    </Frame>
  );
};

export default Widget;

import React from 'react';
import Frame from '../Frame/Frame';
import CloseButton from '../Button/CloseButton';
import { SelectIconOption } from '../../utilities/types';

import { WidgetWrapper } from './Widgets.styles';

export type WidgetProps = {
  id?: number;
  title: string;
  subtitle: string;
  icon: string;
  content?: string;
};

export type CreateWidgetForm = {
  iconOption: SelectIconOption;
} & WidgetProps;

export type WidgetElementProps = {
  icon?: React.ReactNode;
  widgetId: string;
  content?: string;
  onRemoveItem: (id: string) => void;
  component: React.ComponentType<Record<string, unknown>>;
  title: string;
  subtitle: string;
  hideFrame: boolean;
  dataGrid?: {
    minW?: number;
    minH?: number;
    w?: number;
    h?: number;
    x?: number;
    y?: number;
  };
};

const Widget = ({
  icon,
  widgetId,
  onRemoveItem,
  component: Item,
  content,
  title,
  subtitle,
  hideFrame,
}: WidgetElementProps) => {
  return (
    <WidgetWrapper>
      <Frame
        icon={icon}
        style={{ width: '100%', height: '100%' }}
        title={title}
        subtitle={subtitle}
        actionButton={<CloseButton onClick={() => onRemoveItem(widgetId)} />}
      >
        <Item hideFrame={hideFrame} content={content} />
      </Frame>
    </WidgetWrapper>
  );
};

export default Widget;

import React from 'react';
import Frame from '../Frame/Frame';
import CloseButton from '../Button/CloseButton';

const styles = require('./widgets.module.scss');

export type WidgetProps = {
  id?: number;
  title: string;
  subtitle: string;
  icon: string;
  content?: string;
};

export type WidgetElementProps = {
  icon?: React.ReactNode;
  widgetId: string;
  content?: string;
  onRemoveItem: (id: string) => void;
  component: any;
  title: string;
  subtitle: string;
  hideFrame: boolean;
  dataGrid?: object;
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
    <Frame
      className={styles.widget}
      icon={icon}
      style={{ width: '100%', height: '100%' }}
      title={title}
      subtitle={subtitle}
      actionButton={<CloseButton onClick={() => onRemoveItem(widgetId)} />}
    >
      <Item hideFrame={hideFrame} content={content} />
    </Frame>
  );
};

export default Widget;

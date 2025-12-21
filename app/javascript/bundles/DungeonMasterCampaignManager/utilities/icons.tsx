import React from 'react';
import * as Icons from 'react-icons/gi';
import { GiBeerStein } from 'react-icons/gi';

export const allGiIcons = Object.entries(Icons).map((iconArray) => {
  const iconName = iconArray[0]
    .replace('Gi', '')
    .replace(/([A-Z])/g, ' $1')
    .trim();
  const icon = React.createElement(iconArray[1]);
  return {
    value: iconArray[0],
    label: ` ${iconName}`,
    icon,
  };
});

export const getIconFromName = (name: string) => {
  const icon = allGiIcons.find((icon) => icon.value === name);
  return icon?.icon ?? <GiBeerStein />;
};

export const parseIconName = (iconName: string) => {
  return iconName
    .replace('Gi', '')
    .replace(/([A-Z])/g, ' $1')
    .trim();
};

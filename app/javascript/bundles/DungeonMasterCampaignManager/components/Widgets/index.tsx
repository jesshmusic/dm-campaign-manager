import React from 'react';
import NameField from './NameField';
import TavernNameField from './TavernNameField';
import NPCGenButton from './NPCGenButton';
import {
  GiAcrobatic,
  GiBeerStein,
  GiBowman,
  GiLevelTwoAdvanced,
  GiOrcHead,
  GiRock,
  GiSwordman,
} from 'react-icons/gi';
import ActionsInCombat from './ActionsInCombat';
import TurnActions from './TurnActions';
import Cover from './Cover';
import AdventureHookWidget from './AdventureHookWidget';

export const dashboardComponents: {
  [key: string]: {
    component: (any) => JSX.Element;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    grid: object;
  };
} = {
  actionsInCombat: {
    component: ActionsInCombat,
    icon: <GiSwordman />,
    title: 'Actions In Combat',
    subtitle: 'One of the following constitutes an "action"',
    grid: { w: 4, h: 5, x: 0, y: Infinity, minW: 4, minH: 5 },
  },
  coverTable: {
    component: Cover,
    icon: <GiRock />,
    title: 'Cover',
    subtitle: '',
    grid: { w: 4, h: 5, x: 0, y: Infinity, minW: 4, minH: 5 },
  },
  randomName: {
    component: NameField,
    icon: <GiBowman />,
    title: 'Random Character Name',
    subtitle: 'Generate a random fantasy name based on gender and race',
    grid: { w: 4, h: 4, x: 0, y: Infinity, minW: 4, minH: 4 },
  },
  randomTavern: {
    component: TavernNameField,
    icon: <GiBeerStein />,
    title: 'Random Tavern Name',
    subtitle: 'Generate a random tavern name',
    grid: { w: 4, h: 4, x: 4, y: Infinity, minW: 3, minH: 4 },
  },
  adventureHook: {
    component: AdventureHookWidget,
    icon: <GiLevelTwoAdvanced />,
    title: 'Random Adventure Hook',
    subtitle: 'Generate a random adventure hook',
    grid: { w: 4, h: 5, x: 4, y: Infinity, minW: 3, minH: 5 },
  },
  npcGen: {
    component: NPCGenButton,
    icon: <GiOrcHead />,
    title: 'NPC Generator',
    subtitle: 'Quickly create custom NPCs of any challenge rating',
    grid: { w: 4, h: 3, x: 0, y: Infinity, minW: 3, minH: 3 },
  },
  // notesWidget: {
  //   component: NotesWidget,
  //   icon: <GiQuill />,
  //   title: 'Notes',
  //   subtitle: 'Jot down notes during your session',
  //   grid: { w: 4, h: 3, x: 0, y: Infinity, minW: 2, minH: 2 },
  // },
  turnActions: {
    component: TurnActions,
    icon: <GiAcrobatic />,
    title: 'Things You Can Do on Your Turn',
    subtitle: '',
    grid: { w: 4, h: 3, x: 0, y: Infinity, minW: 4, minH: 3 },
  },
};

export const dashboardItems = [
  'actionsInCombat',
  'coverTable',
  'npcGen',
  'adventureHook',
  'randomName',
  'randomTavern',
  'turnActions',
];

export const initialLayouts = {
  lg: [
    { w: 4, h: 5, x: 4, y: 5, i: 'actionsInCombat', minW: 4, minH: 5, moved: false, static: false },
    { w: 4, h: 5, x: 0, y: 4, i: 'coverTable', minW: 4, minH: 5, moved: false, static: false },
    { w: 4, h: 3, x: 8, y: 5, i: 'npcGen', minW: 3, minH: 3, moved: false, static: false },
    { w: 4, h: 5, x: 4, y: 0, i: 'adventureHook', minW: 3, minH: 5, moved: false, static: false },
    { w: 4, h: 4, x: 0, y: 0, i: 'randomName', minW: 4, minH: 4, moved: false, static: false },
    { w: 4, h: 4, x: 8, y: 0, i: 'randomTavern', minW: 3, minH: 4, moved: false, static: false },
    { w: 4, h: 3, x: 8, y: 8, i: 'turnActions', minW: 4, minH: 3, moved: false, static: false },
  ],
  md: [
    { w: 4, h: 4, x: 0, y: 0, i: 'randomName', minW: 4, minH: 4, moved: false, static: false },
    { w: 4, h: 4, x: 4, y: 0, i: 'randomTavern', minW: 3, minH: 4, moved: false, static: false },
    { w: 4, h: 5, x: 4, y: 4, i: 'adventureHook', minW: 3, minH: 5, moved: false, static: false },
    { w: 4, h: 3, x: 0, y: 4, i: 'npcGen', minW: 3, minH: 3, moved: false, static: false },
    { w: 4, h: 5, x: 0, y: 7, i: 'coverTable', minW: 4, minH: 5, moved: false, static: false },
    {
      w: 4,
      h: 5,
      x: 0,
      y: 12,
      i: 'actionsInCombat',
      minW: 4,
      minH: 5,
      moved: false,
      static: false,
    },
    { w: 4, h: 3, x: 0, y: 17, i: 'turnActions', minW: 4, minH: 3, moved: false, static: false },
  ],
  sm: [
    { w: 4, h: 4, x: 0, y: 0, i: 'randomName', minW: 4, minH: 4, moved: false, static: false },
    { w: 4, h: 4, x: 2, y: 4, i: 'randomTavern', minW: 3, minH: 4, moved: false, static: false },
    { w: 4, h: 5, x: 0, y: 8, i: 'adventureHook', minW: 3, minH: 5, moved: false, static: false },
    { w: 4, h: 3, x: 0, y: 13, i: 'npcGen', minW: 3, minH: 3, moved: false, static: false },
    { w: 4, h: 5, x: 0, y: 16, i: 'coverTable', minW: 4, minH: 5, moved: false, static: false },
    {
      w: 4,
      h: 5,
      x: 0,
      y: 21,
      i: 'actionsInCombat',
      minW: 4,
      minH: 5,
      moved: false,
      static: false,
    },
    { w: 4, h: 3, x: 0, y: 26, i: 'turnActions', minW: 4, minH: 3, moved: false, static: false },
  ],
  xs: [
    { w: 3, h: 4, x: 0, y: 0, i: 'randomName', minW: 3, minH: 4, moved: false, static: false },
    { w: 3, h: 4, x: 0, y: 4, i: 'randomTavern', minW: 3, minH: 4, moved: false, static: false },
    { w: 3, h: 5, x: 0, y: 8, i: 'adventureHook', minW: 3, minH: 5, moved: false, static: false },
    { w: 3, h: 3, x: 0, y: 13, i: 'npcGen', minW: 3, minH: 3, moved: false, static: false },
    { w: 3, h: 5, x: 0, y: 16, i: 'coverTable', minW: 3, minH: 5, moved: false, static: false },
    {
      w: 3,
      h: 5,
      x: 0,
      y: 21,
      i: 'actionsInCombat',
      minW: 3,
      minH: 5,
      moved: false,
      static: false,
    },
    { w: 3, h: 3, x: 0, y: 26, i: 'turnActions', minW: 3, minH: 3, moved: false, static: false },
  ],
  xxs: [
    { w: 1, h: 4, x: 0, y: 0, i: 'randomName', minW: 1, minH: 4, moved: false, static: false },
    { w: 1, h: 4, x: 0, y: 4, i: 'randomTavern', minW: 1, minH: 4, moved: false, static: false },
    { w: 1, h: 5, x: 0, y: 8, i: 'adventureHook', minW: 1, minH: 5, moved: false, static: false },
    { w: 1, h: 3, x: 0, y: 13, i: 'npcGen', minW: 1, minH: 3, moved: false, static: false },
    { w: 1, h: 5, x: 0, y: 16, i: 'coverTable', minW: 1, minH: 5, moved: false, static: false },
    {
      w: 1,
      h: 5,
      x: 0,
      y: 21,
      i: 'actionsInCombat',
      minW: 1,
      minH: 5,
      moved: false,
      static: false,
    },
    { w: 1, h: 3, x: 0, y: 26, i: 'turnActions', minW: 1, minH: 3, moved: false, static: false },
  ],
};

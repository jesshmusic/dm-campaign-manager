import React from 'react';
import NameField from './NameField';
import TavernNameField from './TavernNameField';
import NPCGenButton from './NPCGenButton';
import NotesWidget from './NotesWidget';
import { GiBeerStein, GiBowman, GiOrcHead, GiQuill } from 'react-icons/all';

export const dashboardComponents: {
  [key: string]: {
    component: React.ReactNode;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    grid: object;
  };
} = {
  randomName: {
    component: NameField,
    icon: <GiBowman />,
    title: 'Random Character Name',
    subtitle: 'Generate a random fantasy name based on gender and race',
    grid: { w: 4, h: 3, x: 0, y: Infinity, minW: 4, minH: 3 },
  },
  randomTavern: {
    component: TavernNameField,
    icon: <GiBeerStein />,
    title: 'Random Tavern Name',
    subtitle: 'Generate a random tavern name',
    grid: { w: 4, h: 3, x: 4, y: Infinity, minW: 3, minH: 3 },
  },
  npcGen: {
    component: NPCGenButton,
    icon: <GiOrcHead />,
    title: 'NPC Generator',
    subtitle: 'Quickly create custom NPCs of any challenge rating',
    grid: { w: 4, h: 2, x: 0, y: Infinity, minW: 3, minH: 2 },
  },
  notesWidget: {
    component: NotesWidget,
    icon: <GiQuill />,
    title: 'Notes',
    subtitle: 'Jot down notes during your session',
    grid: { w: 4, h: 3, x: 0, y: Infinity, minW: 2, minH: 2 },
  },
};

export const dashboardItems = ['randomName', 'randomTavern', 'npcGen', 'notesWidget'];

export const initialLayouts = {
  lg: [
    { i: 'randomName', x: 0, y: 0, w: 4, h: 3, minW: 4, minH: 3 },
    { i: 'randomTavern', x: 4, y: 0, w: 4, h: 3, minW: 3, minH: 3 },
    { i: 'npcGen', x: 8, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
  ],
};

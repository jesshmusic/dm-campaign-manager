import { MonsterSummary } from '../../../utilities/types';
import { ListGroup } from 'react-bootstrap';
import React from 'react';

type MonsterSummaryProps = {
  monster: MonsterSummary;
  index: number;
  goToPage: (slug: string) => void;
}
const MonsterListItem = ({ monster, goToPage, index }: MonsterSummaryProps) => {
  return (
    <ListGroup.Item action
                    onClick={() => goToPage(monster.slug)}
                    variant={index % 2 === 0 ? '' : 'primary'}>
      <div className={'grid'}>
        <span className={'g-col-4 fs-5 mr-eaves text-primary'}>{monster.name}</span>
        <span className={'g-col-2 fs-6 serif fst-italic'}>{monster.alignment}</span>
        <span className={'g-col-2 fs-6 sans-serif'}>{monster.challengeRating} {monster.xpString}</span>
        <span className={'g-col-2 fs-6 sans-serif'}>{monster.hitPoints} ( {monster.hitDice} )</span>
        <span className={'g-col-2 fs-6 sans-serif'}>{monster.monsterType}</span>
      </div>
    </ListGroup.Item>
  );

};

export default MonsterListItem;
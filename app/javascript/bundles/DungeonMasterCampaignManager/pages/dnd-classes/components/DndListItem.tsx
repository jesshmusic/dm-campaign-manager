import { DndClass } from '../../../utilities/types';
import { ListGroup } from 'react-bootstrap';
import React from 'react';

type DndListItemProps = {
  dndClass: DndClass;
  index: number;
  goToPage: (slug: string) => void;
}
const DndListItem = ({ dndClass, goToPage, index }: DndListItemProps) => {
  return (
    <ListGroup.Item action
                    onClick={() => goToPage(dndClass.slug)}
                    variant={index % 2 === 0 ? '' : 'primary'}>
      <h2 className='h6 mb-1 my-0 mr-eaves'>
        {dndClass.name}&nbsp;<small className={'text-primary'}><strong>Hit die: </strong>d{dndClass.hitDie}</small>
      </h2>
      <p className='mb-0 sans-serif'>
        <strong>Primary Abilities: </strong>
        {
          dndClass.abilityScores
            .map<React.ReactNode>((ability) => (<span>{ability.fullName}</span>))
            .reduce((prev, curr) => [prev, ', ', curr])
        }
      </p>
    </ListGroup.Item>
  );
};

export default DndListItem;
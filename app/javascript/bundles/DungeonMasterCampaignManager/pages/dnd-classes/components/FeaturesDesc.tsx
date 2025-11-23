import React from 'react';
import { DndClass } from '../../../utilities/types';

import styles from '../dnd-class.module.scss';

const FeaturesDesc = (props: { dndClass: DndClass }) => {
  const { dndClass } = props;
  const filteredFeatures = () => {
    const features: { name: string; desc: string[] }[] = [];
    const regex = / \(/i;
    dndClass.levels.forEach((level) => {
      level.features.forEach((feature) => {
        const featureNameSplit = feature.name.split(regex);
        if (featureNameSplit.length > 0) {
          const featureName = featureNameSplit[0];
          if (features.filter((feat) => feat.name === featureName).length === 0) {
            features.push({ name: featureName, desc: feature.desc });
          }
        }
      });
    });
    return features;
  };

  return (
    <div>
      <div className={styles.infoSection}>
        {filteredFeatures().map((feature, index) => (
          <div className={styles.sectionGroup} key={`feat-${index}`}>
            <h3 className={styles.featureHeading}>{feature.name}</h3>
            {feature.desc.map((desc, index) => (
              <p key={`desc-${index}`}>{desc}</p>
            ))}
          </div>
        ))}
      </div>
      {dndClass.spellCasting && (
        <div>
          <h2 className={styles.sectionHeading}>Spell Casting</h2>
          <div className={styles.infoSection}>
            {dndClass.spellCasting.info &&
              dndClass.spellCasting.info.map((spellCast, index) => (
                <div className={styles.sectionGroup} key={`spell-${index}`}>
                  <h3 className={styles.featureHeading}>{spellCast.name}</h3>
                  {spellCast.desc.map((desc, index) => (
                    <p key={`spell-desc-${index}`}>{desc}</p>
                  ))}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturesDesc;

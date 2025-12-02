import React from 'react';
import { DndClass } from '../../../utilities/types';

import { InfoSection, SectionGroup, SectionHeading, FeatureHeading } from '../DndClass.styles';

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
      <InfoSection>
        {filteredFeatures().map((feature, index) => (
          <SectionGroup key={`feat-${index}`}>
            <FeatureHeading>{feature.name}</FeatureHeading>
            {feature.desc.map((desc, index) => (
              <p key={`desc-${index}`}>{desc}</p>
            ))}
          </SectionGroup>
        ))}
      </InfoSection>
      {dndClass.spellCasting && (
        <div>
          <SectionHeading>Spell Casting</SectionHeading>
          <InfoSection>
            {dndClass.spellCasting.info &&
              dndClass.spellCasting.info.map((spellCast, index) => (
                <SectionGroup key={`spell-${index}`}>
                  <FeatureHeading>{spellCast.name}</FeatureHeading>
                  {spellCast.desc.map((desc, index) => (
                    <p key={`spell-desc-${index}`}>{desc}</p>
                  ))}
                </SectionGroup>
              ))}
          </InfoSection>
        </div>
      )}
    </div>
  );
};

export default FeaturesDesc;

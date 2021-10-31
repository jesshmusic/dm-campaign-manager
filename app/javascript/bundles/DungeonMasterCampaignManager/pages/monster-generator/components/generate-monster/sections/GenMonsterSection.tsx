import React from 'react';

const GenMonsterSection = (props: {
  children: React.ReactNode;
  heading: string;
}) => {
  const { children, heading } = props;
  return (
    <div>
      <h4>{heading}</h4>
      {children}
    </div>
  );
};

export default GenMonsterSection;

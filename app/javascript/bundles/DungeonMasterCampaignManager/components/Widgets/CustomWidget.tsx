import React from 'react';

const CustomWidget = (props: { content: string }) => {
  return <div dangerouslySetInnerHTML={{ __html: props.content }} />;
};

export default CustomWidget;

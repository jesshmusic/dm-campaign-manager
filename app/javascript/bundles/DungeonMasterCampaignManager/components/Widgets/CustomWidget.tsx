import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CustomWidget = (props: { content: string }) => {
  return <ReactQuill theme={'bubble'} value={props.content} readOnly={true} />;
};

export default CustomWidget;

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const styles = require('./widgets.module.scss');

const NotesWidget = () => {
  const [convertedText, setConvertedText] = React.useState(() => {
    const content = localStorage.getItem('dmWidgetNotes');
    if (content !== null) {
      return content;
    }
    return '';
  });

  React.useEffect(() => {
    localStorage.setItem('dmWidgetNotes', convertedText);
  }, [convertedText]);

  return (
    <ReactQuill
      theme="snow"
      value={convertedText}
      onChange={setConvertedText}
      style={{ minHeight: '300px' }}
    />
  );
};

export default NotesWidget;

/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import {Field} from 'react-final-form';
import Form from 'react-bootstrap/Form';
import { Editor } from '@tinymce/tinymce-react';

const handleEditorChange = (content, input) => {
  return input.onChange(content);
};

const FormRichTextArea = ({name, label, colWidth}) => (
  <Form.Group as={Col} md={colWidth} controlId="validationCustom02">
    <Field name={name}>
      {({ input, meta }) => (
        <div>
          <Form.Label>{label}</Form.Label>
          <Editor
                apiKey={'p7j8xfgttb661xyhyd0c2p0kn9hma0ivisrd48vn7zjzl0vh'}
                initialValue={input.value}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount',
                  ],
                  toolbar:
                    'undo redo | formatselect | bold italic forecolor backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help',
                }}
                onEditorChange={(content) => input.onChange(content)}
          />
          <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
        </div>
      )}
    </Field>
  </Form.Group>
);

FormRichTextArea.propTypes = {
  name: PropTypes.string.isRequired,
  colWidth: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default FormRichTextArea;
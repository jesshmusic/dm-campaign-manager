/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import {Field} from 'react-final-form';
import Form from 'react-bootstrap/Form';
import CKEditor from '@ckeditor/ckeditor5-react';

const FormRichTextArea = ({name, label, colWidth}) => (
  <Form.Group as={Col} md={colWidth} controlId="validationCustom02">
    <Field name={name}>
      {({ input, meta }) => (
        <div>
          <Form.Label>{label}</Form.Label>
          <CKEditor
              editor={ ClassicEditor }
              data={input.value}
              config={{
                toolbar: [
                  'heading',
                  '|',
                  'bold',
                  'italic',
                  'link',
                  '|',
                  'bulletedList',
                  'numberedList',
                  'blockQuote',
                  '|',
                  'insertTable',
                  'undo',
                  'redo',
                ],
                heading: {
                  options: [
                    { model: 'paragraph', title: 'Paragraph', class: '' },
                    { model: 'heading2', view: 'h2', title: 'Heading 2', class: '' },
                    { model: 'heading3', view: 'h3', title: 'Heading 3', class: '' },
                    { model: 'heading4', view: 'h4', title: 'Heading 4', class: '' },
                    { model: 'heading5', view: 'h5', title: 'Heading 5', class: '' },
                    { model: 'heading6', view: 'h6', title: 'Heading 6', class: '' },
                  ],
                },
              }}
              onChange={ ( event, editor ) => {
                input.onChange(editor.getData());
              } }
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
import React, { PropTypes } from 'react'
import _ from 'lodash'

import AceEditor from 'react-ace'
import 'brace/mode/json'
import 'brace/mode/java'
import 'brace/mode/javascript'
import 'brace/theme/github'
import 'brace/theme/monokai'

const FormGroup = ({ label, children }) => {
  return (
    <div className="form-group">
      { _.isUndefined(label) ? '' : (<label>{ label }</label>) }
      { children }
    </div>
  );
}

FormGroup.propTypes = {
  label: PropTypes.string,
}

const FieldFactory = {
  string({ field, onChange, stateValue }) {
    const { label, path } = field;
    return (
      <FormGroup label={label}>
        <input type="text" onChange={e => onChange(path, e.target.value)} className="form-control" value={stateValue} />
      </FormGroup>
    );
  },

  bool({ field, onChange, stateValue }) {
    const { label, path } = field;
    return (
      <FormGroup label={label}>
        <input type="checkbox" onChange={e => onChange(path, e.target.checked)} className="form-control" checked={stateValue} />
      </FormGroup>
    );
  },

  text({ field, onChange, stateValue }) {
    const { label, path } = field;
    return (
      <FormGroup label={label}>
        <textarea onChange={e => onChange(path, e.target.value)} className="form-control" rows="5" value={stateValue} />
      </FormGroup>
    );
  },

  select({ field, onChange, stateValue }) {
    const { label, path, options } = field;
    return (
      <FormGroup label={label}>
        <select className="form-control" onChange={e => onChange(path, e.target.value)} value={stateValue}>
          { options.map((op, i) => (
            <option value={op.value} key={i}>{op.text}</option>
          ))}
        </select>
      </FormGroup>
    )
  },

  code({ field, onChange, stateValue }) {
    const { label, path, mode } = field;
    return (
      <FormGroup label={label}>
        <AceEditor
          mode={mode}
          theme="github"
          width="100%"
          value={stateValue}
          onChange={newVal => onChange(path, newVal)}
          editorProps={{ $blockScrolling: Infinity }}
        />
      </FormGroup>
    )
  }
};

FieldFactory.get = (field, onChange, stateValue) => {
  let compFactory = FieldFactory[field.type];
  if (_.isUndefined(compFactory)) {
    compFactory = FieldFactory.string;
  }
  return compFactory({ field, onChange, stateValue })
}

export default FieldFactory

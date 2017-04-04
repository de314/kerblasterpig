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

  email({ field, onChange, stateValue }) {
    const { label, path } = field;
    return (
      <FormGroup label={label}>
        <input type="email" onChange={e => onChange(path, e.target.value)} className="form-control" value={stateValue} />
      </FormGroup>
    );
  },

  bool({ field, onChange, stateValue }) {
    const { label, path } = field;
    return (
      <div className="checkbox">
        <label>
          <input type="checkbox" onChange={e => onChange(path, e.target.checked)} checked={stateValue} />
          { label }
        </label>
      </div>
    );
  },

  radio({ field, onChange, stateValue }) {
    const { label, path, options } = field;
    return (
      <FormGroup label={label}>
        { options.map((op, i) => (
          <div className="radio" key={i}>
            <label>
              <input type="radio" name={path} value={op.value} checked={op.value === stateValue} onChange={e => onChange(path, e.target.value)} />
              { op.text }
            </label>
          </div>
        ))}
      </FormGroup>
    )
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
    const { label, path, options, multiple = false } = field;
    function handleSingleChange(e) {
      onChange(path, e.target.value)
    }
    function handleMultipleChange(e) {
      const vals = [...e.target.options]
        .filter(option => option.selected)
        .map(option => option.value);
      onChange(path, vals)
    }
    return (
      <FormGroup label={label}>
        <select
          className="form-control"
          onChange={multiple ? handleMultipleChange : handleSingleChange}
          value={stateValue}
          multiple={multiple}
        >
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

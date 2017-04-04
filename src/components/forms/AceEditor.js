import React, { PropTypes } from 'react'
import _ from 'lodash'
import { defaultProps, withState, compose } from 'recompose'

import AceEditor from 'react-ace'

import 'brace/mode/json'
import 'brace/mode/java'
import 'brace/mode/javascript'
import 'brace/theme/github'
import 'brace/theme/monokai'

const ControlledAceEditor = ({ mode, theme, value, setValue, onChange }) => {
  return (
    <div className="ControlledAceEditor">
      <AceEditor
        mode={mode}
        theme={theme}
        width="100%"
        value={value}
        onChange={newVal => {
          setValue(newVal);
          if (_.isFunction(onChange)) {
            onChange(newVal)
          }
        }}
        editorProps={{ $blockScrolling: Infinity }}
      />
    </div>
  );
}

ControlledAceEditor.propTypes = {
  mode: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  // supplied
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
}

ControlledAceEditor.JSON = "json"
ControlledAceEditor.JAVA = "java"
ControlledAceEditor.JAVASCRIPT = "javascript"

export default compose(
  defaultProps({
    defaultValue: '',
    theme: 'github',
    onChange: () => {},
  }),
  withState('value', 'setValue', props => props.defaultValue)
)(ControlledAceEditor)

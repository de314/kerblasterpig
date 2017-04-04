import React from 'react'
import { withState, withHandlers, compose } from 'recompose'

import Form from '../containers/forms/Form'

const fields = [
  { type: 'string', label: 'Name', path: '$.name' },
  { type: 'email', label: 'Email', path: '$.email', defaultValue: '@bettercloud.com' },
  { type: 'select', label: 'Employer', path: '$.profile.employer', options: [
      { value: 'bettercloud', text: 'BetterCloud' },
      { value: 'google', text: 'Google' },
      { value: 'twitter', text: 'Twitter' },
    ]},
  { type: 'select', label: 'Roles', path: '$.perms.roles', multiple: true, options: [
      { value: 'superuser', text: 'Super User' },
      { value: 'employee', text: 'Employee' },
      { value: 'developer', text: 'Developer' },
      { value: 'tester', text: 'Tester' },
    ]},
  { type: "text", label: 'Bio', path: '$.profile.bio' },
  { type: 'bool', label: 'Suspended', path: '$.profile.suspended', defaultValue: false },
  { type: 'bool', label: 'Admin', path: '$.perms.admin', defaultValue: false },
  { type: 'radio', label: 'Favorite Color', path: "$.profile.favs.color", options: [
      { value: '#0000ff', text: "Blue" },
      { value: '#ff0000', text: "Red" },
      { value: '#00ff00', text: "Green" }
    ]}
];

const formDef = { fields }

const model = {
  name: "Mr. David",
  company: "Bettercloud",
  profile: {
    url: "https://github.com/de44",
  },
  perms: {
    admin: true,
    roles: [ 'employee', 'developer' ]
  }
}

const Demo = ({ output, onSubmit, definition, setDefinition, model, setModel }) => {
  return (
    <div className="Demo">
      <div className="row">
        <div className="col-xs-6">
          <h3>Form Definition:</h3>
          <hr />
          <Form
            model={{ text: JSON.stringify(definition, null, 2) }}
            definition={{ fields: [ { type: 'code', mode: 'json', path: '$.text' } ] }}
            onSubmit={ newState => setDefinition(JSON.parse(newState.text)) }
          />
        </div>
        <div className="col-xs-6">
          <h3>Model:</h3>
          <hr />
          <Form
            model={{ text: JSON.stringify(model, null, 2) }}
            definition={{ fields: [ { type: 'code', mode: 'json', path: '$.text' } ] }}
            onSubmit={ newState => setModel(JSON.parse(newState.text)) }
          />
        </div>
      </div>
      <div className="row">
        <div className="col-xs-6">
          <h3>Dynamic Form:</h3>
          <hr />
          <Form model={model} definition={definition} onSubmit={onSubmit} />
        </div>
        <div className="col-xs-6">
          <h3>Output:</h3>
          <hr />
          <pre style={{ backgroundColor: "#ccc", minHeight: "5em", padding: "1em" }}>{ output }</pre>
        </div>
      </div>
    </div>
  );
}

export default compose(
  withState('output', 'setOutput', ''),
  withState('definition', 'setDefinition', formDef),
  withState('model', 'setModel', model),
  withHandlers({
    onSubmit: props => formState => {
      props.setOutput(JSON.stringify(formState, null, 2));
    }
  })
)(Demo)

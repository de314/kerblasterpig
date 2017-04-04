import React from 'react'
import { withState, withHandlers, compose } from 'recompose'
import uuid from '../utils/uuid'

import Form from '../containers/forms/Form'

const personSummaryFields = [
  { type: 'string', label: 'Name', path: '$.name', defaultValue: 'Single' },
  { type: 'string', label: 'Phone Number', path: '$.phone' },
];

const personSummaryFormDef = { fields: personSummaryFields };

const profileFields = [
  { label: 'Id', path: '$.id', defaultValue: uuid },
  { label: 'Name', path: '$.name' },
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
  { type: 'text', label: 'Bio', path: '$.profile.bio' },
  { type: 'embedded', label: 'Spouse', path: '$.profile.spouse', definition: personSummaryFormDef },
  { type: 'bool', label: 'Suspended', path: '$.profile.suspended', defaultValue: false },
  { type: 'bool', label: 'Admin', path: '$.perms.admin', defaultValue: false },
  { type: 'radio', label: 'Favorite Color', path: "$.profile.favs.color", options: [
      { value: '#0000ff', text: "Blue" },
      { value: '#ff0000', text: "Red" },
      { value: '#00ff00', text: "Green" }
    ]},
  { type: 'code', label: 'JS Hacks', path: '$.hacks.js', mode: 'javascript', theme: 'monokai',
      defaultValue: 'var worldMessage = "Hello, World!"\n\nfunction helloWorld(message) {\n\tconsole.log(message)\n}\n\nhelloWorld(worldMessage)'
    },
  { type: 'code', label: 'Java Hacks', path: '$.hacks.java', mode: 'java', theme: 'monokai',
      defaultValue: '\npublic class HelloWorldPrinter {\n\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello, World!");\n\t}\n}'
    }
];

const profileFormDef = { fields: profileFields }

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
  withState('definition', 'setDefinition', profileFormDef),
  withState('model', 'setModel', model),
  withHandlers({
    onSubmit: props => formState => {
      props.setOutput(JSON.stringify(formState, null, 2));
    }
  })
)(Demo)

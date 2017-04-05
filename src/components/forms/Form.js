import React, { PropTypes } from 'react'
import _ from 'lodash'
import jsonpath from '../../utils/jsonpath'
import FieldFactory from '../../factories/FieldFactory'

const Form = ({ definition, formState, onChange, onSubmit }) => {
	return (
  	<div>
      { definition.fields.map(field => (
        <div key={field.path}>
          { FieldFactory.get(field, onChange, jsonpath.read(formState, field.path)) }
        </div>
      )) }
      <div className="text-right">
        <button onClick={e => onSubmit(formState)} className="btn btn-primary">Submit</button>
      </div>
    </div>
  )
}

Form.propTypes = {
  definition: PropTypes.shape({
    fields: PropTypes.array.isRequired,
  }).isRequired,
  formState: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

Form.Embedded = ({ definition, formState, onChange }) => {
	return (
  	<div>
      { definition.fields.map(field => (
        <div key={field.path}>
          { FieldFactory.get(field, onChange, jsonpath.read(formState, field.path)) }
        </div>
      )) }
    </div>
  )
}

Form.Embedded.propTypes = {
  definition: PropTypes.shape({
    fields: PropTypes.array.isRequired,
  }).isRequired,
  formState: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

Form.EmbeddedList = ({ definition, formState, onChange, onAdd, onRemove }) => {
	return (
  	<div>
      { formState.map((embeddedFormState, i) => (
        <div key={i}>
          <div className="pull-right">
            <button className="btn btn-xs btn-danger" onClick={() => onRemove(i)}>
              <i className="fa fa-trash"></i>
            </button>
          </div>
          <Form.Embedded
            definition={definition}
            formState={embeddedFormState}
            onChange={(path, newVal) => onChange(i, jsonpath.set(embeddedFormState, path, newVal)) }
          />
        </div>
      ))}
      <div className="text-center">
        <button className="btn btn-default btn-xs" onClick={onAdd}>
          <i className="fa fa-plus"></i>
        </button>
      </div>
    </div>
  )
}

Form.EmbeddedList.propTypes = {
  definition: PropTypes.shape({
    fields: PropTypes.array.isRequired,
  }).isRequired,
  formState: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
}

export default Form

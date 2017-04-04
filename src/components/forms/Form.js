import React, { PropTypes } from 'react'
import _ from 'lodash'
import jsonpath from '../../utils/jsonpath'
import FieldFactory from '../../factories/FieldFactory'

const Form = ({ model, definition, formState, onChange, onSubmit }) => {
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
  model: PropTypes.object,
  definition: PropTypes.shape({
    fields: PropTypes.array.isRequired,
  }).isRequired,
  formState: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default Form

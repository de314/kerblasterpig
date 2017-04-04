import React, { PropTypes } from 'react'
import _ from 'lodash'
import jsonpath from '../../utils/jsonpath'
import FieldFactory from '../../factories/FieldFactory'

const Form = ({ model, definition, formState, onChange, onSubmit, embedded = false }) => {
	return (
  	<div>
      { definition.fields.map(field => (
        <div key={field.path}>
          { FieldFactory.get(field, onChange, jsonpath.read(formState, field.path)) }
        </div>
      )) }
      { embedded ? '' : (
        <div className="text-right">
          <button onClick={e => onSubmit(formState)} className="btn btn-primary">Submit</button>
        </div>
      )}
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
  embedded: PropTypes.bool,
}

export default Form

import _ from 'lodash'
import { compose, defaultProps, withState, withHandlers, lifecycle } from 'recompose'
import jsonpath from '../../utils/jsonpath'

import FormComponent from '../../components/forms/Form'

function getDefaultValue(field, formState, model) {
  const modelVal = jsonpath.read(model, field.path);
  let { type, defaultValue } = field,
      defaultVal = undefined;
  if (_.isFunction(defaultValue)) {
    defaultValue = defaultValue()
  }
  if ((type === 'select' || type === 'radio') && _.isUndefined(defaultValue)) {
    defaultVal = field.options[0].value
  }
  defaultVal = _.defaultTo(defaultValue, '');
  if (type === 'embedded' && !_.isPlainObject(defaultVal)) {
    defaultVal = {}
  }
  return _.defaultTo(modelVal, defaultVal)
}

function initState({ model, definition, formState, setFormState, embedded, onSubmit }) {
  definition.fields.map(field => {
      return {
        field,
        val: getDefaultValue(field, formState, model)
      }
    })
    .forEach(p => jsonpath.set(formState, p.field.path, p.val));
  setFormState(formState);
  if (embedded) {
    onSubmit(formState)
  }
}

const Form = compose(
	defaultProps({
  	definition: { fields: [] },
    model: {},
    onSubmit: () => {},
    embedded: false,
  }),
  withState('formState', 'setFormState', props => _.cloneDeep(props.model)),
  withHandlers({
  	onChange: props => (path, newValue) => {
    	const { formState, setFormState, embedded, onSubmit } = props;
    	setFormState(jsonpath.set(formState, path, newValue))
      if (embedded) {
        onSubmit(formState)
      }
    },
  	onSubmit: props => (newFormState) => {
      const { onSubmit, formState } = props;
      if (_.isFunction(onSubmit)) {
        onSubmit(_.defaultTo(newFormState, formState))
      }
    }
  }),
  lifecycle({
    componentWillMount() {
      initState(this.props)
    },
    componentWillReceiveProps(nextProps) {
      if (!_.isEqual(this.props.definition, nextProps.definition) || !_.isEqual(this.props.model, nextProps.model)) {
        initState(nextProps)
      }
    },
  })
)(FormComponent);

export default Form

import _ from 'lodash'
import { compose, defaultProps, withState, withHandlers, lifecycle } from 'recompose'
import jsonpath from '../../utils/jsonpath'

import FormComponent from '../../components/forms/Form'

function initState({ model, definition, formState, setFormState }) {
  definition.fields.map(field => {
      const modelVal = jsonpath.read(model, field.path);
      let defaultVal = _.defaultTo(field.defaultValue, '');
      if ((field.type === 'select' || field.type === 'radio') && _.isUndefined(field.defaultValue)) {
        defaultVal = field.options[0].value
      }
      return {
        field,
        val: _.defaultTo(modelVal, defaultVal)
      }
    })
    .forEach(p => jsonpath.set(formState, p.field.path, p.val));
  setFormState(formState);
}

const Form = compose(
	defaultProps({
  	definition: { fields: [] },
    model: {},
    onSubmit: () => {}
  }),
  withState('formState', 'setFormState', props => _.cloneDeep(props.model)),
  withHandlers({
  	onChange: props => (path, newValue) => {
    	const { formState, setFormState } = props;
    	setFormState(jsonpath.set(formState, path, newValue))
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

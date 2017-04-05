import _ from 'lodash'
import { compose, defaultProps, withProps, withState, withHandlers, lifecycle } from 'recompose'
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
  defaultVal = _.defaultTo(defaultVal, '');
  if (type === 'embedded' && !_.isPlainObject(defaultVal)) {
    defaultVal = {}
  }
  if (type === 'embeddedList' && !_.isArray(defaultVal)) {
    defaultVal = []
  }
  return _.defaultTo(modelVal, defaultVal)
}

function _initState(model, definition, formState) {
  definition.fields.map(field => {
      return {
        field,
        val: getDefaultValue(field, formState, model)
      }
    })
    .forEach(p => jsonpath.set(formState, p.field.path, p.val));
}

function initState({ model, definition, formState, setFormState, embedded, onSubmit }) {
  if (_.isArray(formState)) {
    for (let i=0;i<formState.length;i++) {
      _initState(model[i], definition, formState[i])
    }
  } else {
    _initState(model, definition, formState);
  }
  setFormState(formState);
  if (embedded) {
    onSubmit(formState)
  }
}

const formEnhancer = compose(
	defaultProps({
  	definition: { fields: [] },
    model: {},
    onSubmit: () => {},
    embedded: false,
    demo: false,
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
      if (this.props.demo === true || nextProps.demo === true) {
        if (!_.isEqual(this.props.definition, nextProps.definition) || !_.isEqual(this.props.model, nextProps.model)) {
          initState(nextProps)
        }
      }
    },
  })
);

const Form = formEnhancer(FormComponent);

Form.Embedded = compose(
  defaultProps({ embedded: true })
)(formEnhancer(FormComponent.Embedded));

let EmbeddedList = compose(
  withProps(props => {
    const { fields, defaultValue } = props.definition;
    let defaultEmbeddedFormState = defaultValue
    if (_.isUndefined(defaultEmbeddedFormState) && props.formState.length > 0) {
      defaultEmbeddedFormState = _.cloneDeep(props.formState[props.formState.length - 1])
    } else {
      defaultEmbeddedFormState = (fields.length === 1 && fields[0].type === 'embeddedList') ? [] : {};
    }
    return { defaultEmbeddedFormState }
  }),
  withHandlers({
    onChange: props => (i, newValue) => {
      const { formState, onSubmit } = props
      formState[i] = newValue
      onSubmit(formState)
    },
    onAdd: props => () => {
      const { formState, defaultEmbeddedFormState, onSubmit } = props
      formState.push(defaultEmbeddedFormState)
      initState(props)
    },
    onRemove: props => i => {
      const { path, onSubmit } = props
      let formState = props.formState.splice(i, 1);
      onSubmit(path, formState)
    },
  })
)(FormComponent.EmbeddedList)

EmbeddedList = formEnhancer(EmbeddedList)

Form.EmbeddedList = compose(
  defaultProps({ embedded: true })
)(EmbeddedList);

export default Form

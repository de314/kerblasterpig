import React, { PropTypes } from 'react'
import _ from 'lodash'

import RawHtml from '../components/view/RawHtml'
import { Label, Image, Thumbnail } from 'react-bootstrap'
import AceEditor from 'react-ace'

import 'brace/mode/json'
import 'brace/mode/java'
import 'brace/mode/javascript'
import 'brace/theme/github'
import 'brace/theme/monokai'


const SimpleViewField = ({ label, className, children }) => {
  return (
    <p className={className}>
      <span className="view-label">{ _.isUndefined(label) ? '' : `${label}: ` }</span>
      <span className="view-value"> {children}</span>
    </p>
  );
}

SimpleViewField.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

const ViewFactory = {


  /**
   * string - Create string view
   *
   * @param  {object} params - Display parameters
   * @param  {object} params.field - The display config
   * @param  {string} [params.field.label] - Optional value label.
   * @param  {string} [params.field.className] - Optional field view classname
   * @param  {string} params.value - value to display
   */
  string({ field, value }) {
    const { label, className = '' } = field;
    return (
      <SimpleViewField className={`view-string-field ${className}`} label={label}>
        {value}
      </SimpleViewField>
    );
  },


  /**
   * email - Create email view
   *
   * @param  {object} params - Display parameters
   * @param  {object} params.field - The display config
   * @param  {string} [params.field.label] - Optional value label.
   * @param  {string} [params.field.className] - Optional field view classname
   * @param  {string|object} params.value - value to display
   * @param  {string} params.value.text - email to display
   * @param  {string} params.value.email - email to link
   */
  email({ field, value }) {
    const { label, className = '' } = field,
        emailVal = _.isPlainObject(value) ? value : { text: value, email: value };
    return (
      <SimpleViewField className={`view-email-field ${className}`} label={label}>
        <a href={`mailto:${emailVal.email}`}>{emailVal.text}</a>
      </SimpleViewField>
    );
  },

  /**
   * url - Create url view
   *
   * @param  {object} params - Display parameters
   * @param  {object} params.field - The display config
   * @param  {string} [params.field.label] - Optional value label.
   * @param  {string} [params.field.className] - Optional field view classname
   * @param  {string|object} params.value - value to display
   * @param  {string} params.value.text - text to display
   * @param  {string} [params.value.url=#] - url to link
   * @param  {string} [params.value.target=_blank] - anchor target
   */
  url({ field, value }) {
    value = _.isString(value) ? { text: value, url: value } : value;
    const { label, className = '' } = field,
        { url = '#', text = 'Click Here', target = '_blank' } = value;
    return (
      <SimpleViewField className={`view-url-field ${className}`} label={label}>
        <a href={`${url}`} target={target}>{text}</a>
      </SimpleViewField>
    );
  },


  /**
   * bool - Create boolean view
   *
   * @param  {object} params - Display parameters
   * @param  {object} params.field - The display config
   * @param  {string} [params.field.label] - value label.
   * @param  {string} [params.field.className] - field view classname
   * @param  {object} [params.field.icon] - field icon
   * @param  {boolean} [params.field.icon.t] - field view icon for true
   * @param  {boolean} [params.field.icon.f] - field view icon for false
   * @param  {boolean} params.value - value to display
   */
  bool({ field, value }) {
    const { label, className = '', icon = {} } = field,
        { t = '', f = '' } = icon,
        boolComp = _.isString(icon) ? (<i className={`bool-${value} ${value ? t : f}`}></i>) : "" + value
    return (
      <SimpleViewField className={`view-bool-field ${className}`} label={label}>
        {boolComp}
      </SimpleViewField>
    );
  },


  /**
   * ul - Create un-ordered list view
   *
   * @param  {object} parms description
   * @param  {type} value description
   * @return {type}         description
   */
  ul({ field, value }) {
    const { label, className = '', icon } = field,
      values = value = _.isArray(value) ? value : [value]
    return (
      <SimpleViewField className={`view-ul-field ${className}`} label={label}>
        <ul>
          {values.map(val => (<li>{val}</li>))}
        </ul>
      </SimpleViewField>
    );
  },

  ol({ field, value }) {
    const { label, className = '', icon } = field,
      values = value = _.isArray(value) ? value : [value]
    return (
      <SimpleViewField className={`view-ol-field ${className}`} label={label}>
        <ol>
          {values.map(val => (<li>{val}</li>))}
        </ol>
      </SimpleViewField>
    );
  },

  tags({ field, value }) {
    const { label, className = '', icon } = field,
        values = value = _.isArray(value) ? value : [value];
    return (
      <SimpleViewField className={`view-ul-field ${className}`} label={label}>
        {values.map(val => {
          val = _.isPlainObject(val) ? val : { text: val + '' };
          const { style = 'default', text = '' } = val;
          return <Label bsStyle={style}>{text}</Label>&nbsp;
        })
        }
      </SimpleViewField>
    );
  },

  progress({ field, value }) {
    value = _.isPlainObject(value) ? value : { progress: value }
    const { label, className = '' } = field,
        { progress, style } = value
    return (
      <SimpleViewField className={`view-bool-field ${className}`} label={label}>
        <ProgressBar bsStyle={style} now={progress} label={progress} />
      </SimpleViewField>
    );
  },

  image({ field, value }) {
    value = _.isPlainObject(value) ? value : { src: value }
    const { label, className = '' } = field,
        { src, rounded = false, circle = false, thumbnail = false, responsive = false } = value,
        imgProps = { src, rounded, circle, thumbnail, responsive };
    return (
      <SimpleViewField className={`view-bool-field ${className}`} label={label}>
        <Image {...imgProps} />
      </SimpleViewField>
    );
  },

  thumbnail({ field, value }) {
    const { label, className = '' } = field,
        imgProps = { href, src: imgSrc };
    return (
      <SimpleViewField className={`view-bool-field ${className}`} label={label}>
        <Thumbnail {...imgProps} />
      </SimpleViewField>
    );
  },

  html({ field, value }) {
    const { label, className = '' } = field
    return (
      <SimpleViewField className={`view-html-field ${className}`} label={label}>
        <RawHtml content={value} />
      </SimpleViewField>
    );
  },

  code({ field, value }) {
    const { label, mode, theme = "github" } = field;
    return (
      <SimpleViewField className={`view-code-field view-code-${mode} ${className}`} label={label}>
        <AceEditor
          mode={mode}
          theme={theme}
          width="100%"
          value={value}
          readOnly={true}
          editorProps={{ $blockScrolling: Infinity }}
        />
      </SimpleViewField>
    )
  },
};

FieldFactory.get = (field, value) => {
  let compFactory = FieldFactory[field.type];
  if (_.isUndefined(compFactory)) {
    compFactory = FieldFactory.string;
  }
  return compFactory({ field, onChange, stateValue })
}

export default FieldFactory

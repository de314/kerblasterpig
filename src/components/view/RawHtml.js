import React, { PropTypes } from 'react'

const RawHtml = ({ content }) => {
  return (
    <span className="RawHtml" dangerouslySetInnerHTML={content} />
  );
}

RawHtml.propTypes = {
  content: PropTypes.string.isRequired,
}

export default RawHtml

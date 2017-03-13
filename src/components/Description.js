import React from 'react';

// parse description string to detect where to add links on tracker
const getTrackerLinks = (description, pattern = '#([0-9]+)', trackerUrl) => {
  if (trackerUrl === undefined) {
    return description;
  }
  const reIssueId = new RegExp(pattern, 'ig');
  const result = [];
  let match;
  let index = 0;
  while ((match = reIssueId.exec(description)) !== null) {
    result.push(description.substring(index, match.index));
    result.push({ href: trackerUrl.replace('%ID%', match[1]), text: match[0] });
    index = reIssueId.lastIndex;
  }
  if (index < description.length) {
      result.push(description.substring(index, description.length));
  }
  return result.length > 0 ? result : description;
}

class Description extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.arrayOf(React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.shape({
          href: React.PropTypes.string.isRequired,
          text: React.PropTypes.string.isRequired,
        }),
      ])),
    ]),
    options: React.PropTypes.shape({
      trackerUrl: React.PropTypes.string,
      pattern: React.PropTypes.string,
    }),
  };

  static defaultProps = {
    options: {},
  };

  renderArray(entries) {
    return entries.map((e, index) => typeof e === 'string' 
      ? <span key={index}>{e}</span>
      : <a key={index} href={e.href} target="_blank">{e.text}</a>
    );
  }

  render() {
    const { children, options } = this.props;
    const { trackerUrl, pattern } = options; 
    const description = getTrackerLinks(children, pattern, trackerUrl);
    return (
      <em>
        {Array.isArray(description) ? this.renderArray(description) : description}
      </em>
    );
  }
}

export default Description;
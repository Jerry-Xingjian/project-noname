import React from 'react';
import { Link } from 'react-router-dom';
import parse, { domToReact } from 'html-react-parser';

// options for html-react-parser
// Docmentation: https://github.com/remarkablemark/html-react-parser
const options = {
  replace: ({ attribs, name, children }) => {
    if (!attribs) {
      return null;
    }

    if (name === 'a') {
      const id = attribs.href;
      return <Link to={`/profile/${id}`} className="text-decoration-none">{ domToReact(children, options) }</Link>;
    }

    if (name === 'span') {
      return <span className="text-primary">{ domToReact(children, options) }</span>;
    }

    return null;
  },
};

function CommentWithMention(props) {
  const { contentObj: { plainTextValue, mentions } } = props;

  // Convert mentions to html
  const updatedMention = mentions.reduce((acc, mention) => {
    const { id, display } = mention;
    const html = `<a href=${id}><span>${display}</span></a>`;
    const newAcc = acc.replace(display, html);
    return newAcc;
  }, plainTextValue);

  return (
    <div>
      { parse(updatedMention, options) }
    </div>
  );
}

export default CommentWithMention;

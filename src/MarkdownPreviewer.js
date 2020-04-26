import React from 'react';

const MarkdownPreviewer = (props) => {
    return (
        <div className="markdown-previewer" dangerouslySetInnerHTML={props.renderMarkdown} />
    )

}

export default MarkdownPreviewer;
import React from 'react';

const MarkdownPreviewer = (props) => {
    return (
        <div 
        className="markdown-previewer editor-col" 
        dangerouslySetInnerHTML={props.renderMarkdown} />
    )

}

export default MarkdownPreviewer;
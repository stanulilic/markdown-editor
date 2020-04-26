import React from 'react';

const TextEditor = (props) => {
    return (
        <div className="editor">
            <textarea defaultValue={props.text} className="markdown-input">
            </textarea>
        </div>
    )
}

export default TextEditor;
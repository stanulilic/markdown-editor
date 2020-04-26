import React from 'react';

const TextEditor = (props) => {
    return (
        <div className="editor">
            <textarea class="markdown-input">
                {props.text}
            </textarea>
        </div>
    )
}

export default TextEditor;
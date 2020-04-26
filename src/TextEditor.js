import React from 'react';

const TextEditor = (props) => {
    return (
        <div className="editor editor-col">
            <textarea 
            defaultValue={props.text} 
            className="markdown-input" 
            onBlur={props.changeHandler} onChange={props.changeHandler}>
            </textarea>
        </div>
    )
}

export default TextEditor;
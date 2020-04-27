import React, { useState, useEffect, useRef } from 'react';
import TextEditor from './TextEditor';
import MarkdownPreviewer from './MarkdownPreviewer';
import marked from 'marked';


const App = () => {
    const initialMarkdownText = `
    
# This is a heading

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

This line contains **strong** text.

This is \`inline\` code

The following is a link: [link text](https://www.reddit.com)

unordered list items:

- houses
- cars
- animals

ordered list items:

1. first
2. second
3. fourth

This is a paragraph

    `
    const [md, setMarkdown] = useState(initialMarkdownText);
    const editorWrapper = useRef(null);

    useEffect(() => {
        const editorWrapperNode = editorWrapper.current;
        const  textAreaElement = editorWrapperNode.querySelector('textarea');
        const  mdPreviewElement = editorWrapperNode.querySelector('.markdown-previewer');

        textAreaElement.addEventListener('scroll', onScrollHandler);
        mdPreviewElement.addEventListener('scroll', onScrollHandler);
        // scroll to bottom
        textAreaElement.scrollTop = textAreaElement.scrollHeight;
        mdPreviewElement.scrollTop = mdPreviewElement.scrollHeight;
    }, []);

    const onScrollHandler = (e) => {
        const editorWrapperNode = editorWrapper.current;
        const  textAreaElement = editorWrapperNode.querySelector('textarea');
        const  mdPreviewElement = editorWrapperNode.querySelector('.markdown-previewer');
        if(e.type === 'change') {
        textAreaElement.scrollTop = textAreaElement.scrollHeight;
        }
        else{

        if(e.target.className === 'markdown-input'){
        mdPreviewElement.scrollTop = textAreaElement.scrollTop;
        }else {
        textAreaElement.scrollTop = mdPreviewElement.scrollTop;
        }
    }
        

    }

    const renderMarkdown = (markdown) => {
        const rawHtml = marked(markdown);
        return {__html: rawHtml}

    }

    const changeHandler = (e) => {
        setMarkdown(e.target.value);
        onScrollHandler(e);
    }
    return (
    <div className="editor-container">
        <div className="split editor-wrapper" ref={editorWrapper}>
         <TextEditor text={md} changeHandler={changeHandler} />
         <MarkdownPreviewer renderMarkdown={renderMarkdown(md)} />
        </div>
    </div>
    );
};

export default App;
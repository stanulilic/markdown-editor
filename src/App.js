import React, { useState, useEffect, useRef } from 'react';
import TextEditor from './TextEditor';
import MarkdownPreviewer from './MarkdownPreviewer';
import Nav from './Nav';
import marked from 'marked';

const App = () => {
    let mdInitialHistory = [`
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

This is a paragraph`];
   
// https://konvajs.org/docs/react/Undo-Redo.html 
// https://medium.com/better-programming/enhance-your-react-app-with-undo-and-reset-abilities-cee6f37af0d9
    const [mdHistory, setMdHistory] = useState(mdInitialHistory);
    const [md, setMarkdown] = useState(mdHistory[0]);
    let [historyStep, setHistoryStep] = useState(0);
    const [cursorPos, setCursorPos] = useState(md);
    const editorWrapper = useRef(null);

    useEffect(() =>{
        const textArea = getTextArea();
        textArea.focus();
        textArea.selectionStart = cursorPos;
        textArea.selectionEnd = cursorPos;

    }, [cursorPos]);

    useEffect(() => {
        console.log(mdHistory);
        console.log(historyStep);

    }, [md, mdHistory, historyStep]);


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

    const handleUndo = () => {
        const textArea = getTextArea();
        if(historyStep === 0) {
            return;
        }
        const newHistoryStep = historyStep - 1;
        setHistoryStep(newHistoryStep);
        const previous = mdHistory[newHistoryStep];
        setMarkdown(previous);
        textArea.value = previous;
    }

    const updateMarkdownState =(newValue) => {
        const newMdHistory = mdHistory.slice(0, historyStep + 1);
        setMdHistory(newMdHistory.concat([newValue]));
        setHistoryStep(historyStep += 1);
        setMarkdown(newValue);
    };

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
        const value = e.target.value;
        setMarkdown(value);
    }

    const keyDownHandler = (event) => {
        const key = event.keyCode || event.charCode;
       // backspace: 8, delete: 46, enter: 13 
       if(key === 8 || key === 46 || key === 13){
        const textArea = getTextArea();
        const newValue = textArea.value;
        const newMdHistory = mdHistory.slice(0, historyStep + 1);
        setMdHistory(newMdHistory.concat([newValue]));
        setHistoryStep(historyStep += 1);
       }
    }

    const getTextArea = () => {

        const editorWrapperNode = editorWrapper.current;
        const  textAreaElement = editorWrapperNode.querySelector('textarea');
        return textAreaElement;

    }

    return (
    <div>
     <Nav 
     getTextArea={getTextArea} setCursorPos={setCursorPos}  
     updateMarkdownState={updateMarkdownState}
     handleUndo={handleUndo}
     historyStep={historyStep} />
    <div className="editor-container">
        <div className="split editor-wrapper" ref={editorWrapper}>
         <TextEditor text={md} keyDownHandler={keyDownHandler}  changeHandler={changeHandler} />
         <MarkdownPreviewer renderMarkdown={renderMarkdown(md)} />
        </div>
    </div>
    </div>
    );
};

export default App;
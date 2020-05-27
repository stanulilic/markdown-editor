import React, { useState, useEffect, useRef } from 'react';
import TextEditor from './TextEditor';
import MarkdownPreviewer from './MarkdownPreviewer';
import Nav from './Nav';
import ButtonBar from './ButtonBar';
import marked from 'marked';
import FileSaver from 'file-saver';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


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
   
    const [mdHistory, setMdHistory] = useState(mdInitialHistory);
    const [md, setMarkdown] = useState(mdHistory[0]);
    let [historyStep, setHistoryStep] = useState(0);
    const [cursorPos, setCursorPos] = useState(md);
    const [undoState, setUndoState] = useState(false);
    const editorWrapper = useRef(null);
    const appWrapper = useRef(null);

    useEffect(() =>{
        // set cursor to the end of the default text
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
        // scroll to the bottom on page load
        const editorWrapperNode = editorWrapper.current;
        const  textAreaElement = editorWrapperNode.querySelector('textarea');
        const  mdPreviewElement = editorWrapperNode.querySelector('.markdown-previewer');

        if(!(mdPreviewElement.className === 'hide')){
        textAreaElement.addEventListener('scroll', onScrollHandler);
        mdPreviewElement.addEventListener('scroll', onScrollHandler);
        // scroll to bottom
        textAreaElement.scrollTop = textAreaElement.scrollHeight;
        mdPreviewElement.scrollTop = mdPreviewElement.scrollHeight;
        }
    }, []);

    const handleRedo = () => {
        // undo to previous state
        const textArea = getTextArea();
        if(historyStep === mdHistory.length -1 ) {
            setUndoState(false); // disable button if no more redo's
            return;
        }
        const newHistoryStep = historyStep + 1;
        setHistoryStep(newHistoryStep);
        const next = mdHistory[newHistoryStep];
        setMarkdown(next);
        textArea.value = next;
    }

    const handleUndo = () => {
        // undo to previous state
        const textArea = getTextArea();
        if(historyStep === 0) {
            return;
        }
        const newHistoryStep = historyStep - 1;
        setHistoryStep(newHistoryStep);
        const previous = mdHistory[newHistoryStep];
        setMarkdown(previous);
        textArea.value = previous;
        setUndoState(true);
    }

    const updateMarkdownState =(newValue, cursorIndex) => {
        // update state when buttons such as bold, italic, etc
        // is clicked
        const newMdHistory = mdHistory.slice(0, historyStep + 1);
        setMdHistory(newMdHistory.concat([newValue]));
        setHistoryStep(historyStep += 1);
        setMarkdown(newValue);

        const textArea = getTextArea();
        textArea.selectionStart = cursorIndex;
        textArea.selectionEnd = cursorIndex;
        textArea.focus();
    };

    const onScrollHandler = (e) => {
        // sync texteditor and preview windows
        const editorWrapperNode = editorWrapper.current;
        const  textAreaElement = editorWrapperNode.querySelector('textarea');
        const  mdPreviewElement = editorWrapperNode.querySelector('.markdown-previewer');
        if(e.type === 'change') {
        textAreaElement.scrollTop = textAreaElement.scrollHeight;
        }
        else{

        if(e.target.className === 'markdown-input'){
        mdPreviewElement.scrollTop = textAreaElement.scrollTop;
        }else if(!mdPreviewElement === 'hide'){
        textAreaElement.scrollTop = mdPreviewElement.scrollTop;
        }
    }
        

    }

    const renderMarkdown = (markdown) => {
        // convert markdown to html
        const rawHtml = marked(markdown);
        return {__html: rawHtml}

    }
    const getDomElements = () => {
        const appWrapperNode = appWrapper.current;
        const headerElement = appWrapperNode.querySelector('header');
        const editorWrapper = appWrapperNode.querySelector('.editor-wrapper');
        const  mdPreviewElement = appWrapperNode.querySelector('.markdown-previewer');
        const  textAreaElement = appWrapperNode.querySelector('textarea');
        const  buttonBarElement = appWrapperNode.querySelector('.buttonbar');
        const  navBarEditingElement = appWrapperNode.querySelector('.navbar__editing');
        const  openFileElement = appWrapperNode.querySelector('.navbar__maintools > div');
        return {
            headerElement,
            editorWrapper,
            mdPreviewElement,
            textAreaElement,
            buttonBarElement,
            navBarEditingElement,
            openFileElement
        }

    }

    const saveAsHtml = (hideModal) => {
        const content = marked(md);
        const blob = new Blob([content], {type: "text/html;charset=utf-8"});
        FileSaver.saveAs(blob, "newHtmlDocument.html");
        hideModal();
    }

    const saveAsMarkdown = (hideModal) => {
        const content = md;
        const blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "newMarkdownDocument.md");
        hideModal();
    }

    const saveAsPDF = (hideModal, quality) => {
        const editorWrapperNode = editorWrapper.current;
        const  mdPreviewElement = editorWrapperNode.querySelector('.markdown-previewer');
        const filename = 'newDocument.pdf';
        html2canvas(mdPreviewElement, {scale: quality}).then(canvas => {
            let pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);
            pdf.save(filename);
        });
    }

    const changeHandler = (e) => {
        // save state on each keypress
        const value = e.target.value;
        setMarkdown(value);
    }

    const keyDownHandler = (event) => {
       // save state in history if backspace or delete or enter key
       // is pressed
        const key = event.keyCode || event.charCode;
       // backspace: 8, delete: 46, enter: 13 
       if(key === 8 || key === 46 || key === 13){
        const textArea = getTextArea();
        const newValue = textArea.value;
        saveHistory(newValue);
       }
    }

    const saveHistory = (newValue) => {
        const newMdHistory = mdHistory.slice(0, historyStep + 1);
        setMdHistory(newMdHistory.concat([newValue]));
        setHistoryStep(historyStep += 1);
    }

    const getTextArea = () => {
        // get textarea from dom using refs
        const editorWrapperNode = editorWrapper.current;
        const  textAreaElement = editorWrapperNode.querySelector('textarea');
        return textAreaElement;

    }

    return (
    <div className="container" ref={appWrapper}>
     <Nav 
     getTextArea={getTextArea} setCursorPos={setCursorPos}  
     updateMarkdownState={updateMarkdownState}
     handleUndo={handleUndo}
     handleRedo={handleRedo}
     historyStep={historyStep}
     undoState={undoState}
     setMarkdown={setMarkdown}
     saveHistory={saveHistory}
     saveAsHtml={saveAsHtml}
     saveAsMarkdown={saveAsMarkdown}
     saveAsPDF={saveAsPDF}
      />
    <div className="editor-container">
        <div className="split editor-wrapper" ref={editorWrapper}>
         <TextEditor text={md} keyDownHandler={keyDownHandler}  changeHandler={changeHandler} />
         <ButtonBar getDomElements={getDomElements} />
         <MarkdownPreviewer renderMarkdown={renderMarkdown(md)} />
        </div>
    </div>
    </div>
    );
};

export default App;
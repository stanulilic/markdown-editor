import React, { useState, useRef, useEffect } from 'react';
import { ReactComponent as BoldIcon} from './icons/bold.svg';
import { ReactComponent as LinkIcon} from './icons/chain.svg';
import { ReactComponent as CodeIcon} from './icons/code.svg';
import { ReactComponent as ImageIcon} from './icons/file-image-o.svg';
import { ReactComponent as HeadingIcon} from './icons/header.svg';
import { ReactComponent as ItalicIcon} from './icons/italic.svg';
import { ReactComponent as StrikeThroughIcon} from './icons/strikethrough.svg';
import { ReactComponent as OlListIcon} from './icons/list-ol.svg';
import { ReactComponent as UlListIcon} from './icons/list-ul.svg';
import { ReactComponent as BlockQuoteIcon} from './icons/quote-right.svg';
import { ReactComponent as DownloadIcon} from './icons/download.svg';
import { ReactComponent as OpenFileIcon} from './icons/upload2.svg';
import { ReactComponent as RedoIcon} from './icons/redo2.svg';
import { ReactComponent as UndoIcon} from './icons/undo2.svg';
import { ReactComponent as CloseIcon } from './icons/close.svg';
import { ReactComponent as MarkdownIcon } from './icons/markdown.svg';
import { ReactComponent as PdfIcon } from './icons/pdf.svg';
import { ReactComponent as HtmlIcon } from './icons/embed.svg';
import Modal from './Modal.js';

const IconElement = (props) => {
    return (
            <div className={props.buttonType}>
                <button onClick={props.handleClick} className="navbar__button" title={props.title} arial-label={props.label} id={props.id} disabled={props.disabled}>
                {props.children}
                </button>
            </div>
    )

}
const EditingIcons = (props) => {


    const changeSelectedText = (textArea, startPos, endPos, enclosingTextStart, enclosingTextEnd) => {
            const selectedText = textArea.value.slice(startPos, endPos);
            const output = `${enclosingTextStart}${selectedText}${enclosingTextEnd}`
            return output;
    }

    const formatMarkdownCode = ()  => {
        let currentValue = null;
        let cursorIndex = 0;
        let  curString = "";
        const textArea = props.getTextArea();
        let text = "`enter code here`";
        const startPos = textArea.selectionStart;
        const endPos = textArea.selectionEnd;
        const textBeforeCursorPosition = textArea.value.substring(0, startPos)
        const textAfterCursorPosition = textArea.value.substring(endPos, textArea.value.length)
        const lines = textArea.value.substring(0, startPos).split("\n");
        // check if cursor is non-empty line
        if(lines[lines.length - 1 ]) {
            if(startPos !== endPos) {
                text = changeSelectedText(textArea, startPos, endPos, "`", "`");
            }
            
        }
        else {
            const enclosers = "```\n";
            const enclosingTextEnd = "\n```";
            text = `\n${enclosers}enter code here\n${enclosers}`;
            // if text is highlighted
            if(startPos !== endPos) {
                text = changeSelectedText(textArea, startPos, endPos, enclosers, enclosingTextEnd);
            }
        }
        currentValue  = `${textBeforeCursorPosition}${text}${textAfterCursorPosition}`; 
        curString = `${textBeforeCursorPosition}${text}`;
        textArea.value = currentValue;
        cursorIndex = Number(curString.length);
        props.updateMarkdownState(currentValue, cursorIndex);

    }
    const formatText = (defaultText, enclosingTextStart, enclosingTextEnd) => {
        let currentValue = null;
        let cursorIndex = 0;
        let  curString = "";
        const textArea = props.getTextArea();
        let text = defaultText;
        const startPos = textArea.selectionStart;
        const endPos = textArea.selectionEnd;
        // if text is highlighted or selected
        if(startPos !== endPos) {
            text = changeSelectedText(textArea, startPos, endPos, enclosingTextStart, enclosingTextEnd)
        }
        const textBeforeCursorPosition = textArea.value.substring(0, startPos)
        const textAfterCursorPosition = textArea.value.substring(endPos, textArea.value.length)

        if(enclosingTextEnd){
            currentValue  = `${textBeforeCursorPosition}${text}${textAfterCursorPosition}`; 
            curString = `${textBeforeCursorPosition}${text}`;
        }
        else {
            currentValue  = `${textBeforeCursorPosition}\n${text}\n${textAfterCursorPosition}`; 
            curString = `${textBeforeCursorPosition}\n${text}`;
        }

        textArea.value = currentValue;
        // get last inserted character index position
        cursorIndex = Number(curString.length);
        props.updateMarkdownState(currentValue, cursorIndex);
    }

    return (
        <div className="navbar__editing nav-child">
            <IconElement  buttonType="redo-btn" handleClick={() => { props.handleRedo()}} title="Redo" label="Redo" disabled={!props.undoState}><RedoIcon /></IconElement>
            <IconElement  buttonType="undo-btn" handleClick={() => { props.handleUndo()}} title="Undo" label="Undo" disabled={!props.historyStep}><UndoIcon /></IconElement>
            <IconElement  buttonType="bold-btn" handleClick={() => {formatText("**strong text**", "**", "**")}} title="Bold" label="Bold"><BoldIcon /></IconElement>
            <IconElement  buttonType="italic-btn" handleClick={() => {formatText("*emphasized text*", "*", "*")}} title="Italic" label="Italic"><ItalicIcon /></IconElement>
            <IconElement  buttonType="heading-btn" handleClick={() => {formatText("# heading", "# ", "")}} title="Heading" label="Heading"><HeadingIcon /></IconElement>
            <IconElement  buttonType="strike-btn" handleClick={() => {formatText("~~strikethrough text~~", "~~", "~~")}} title="Strikethrough" label="Strikethrough"><StrikeThroughIcon /></IconElement>
            <IconElement  buttonType="ul-btn" handleClick={() => {formatText("- list item one\n- list item two", "- ", "")}} title="Unordered List" label="Unordered List"><UlListIcon /></IconElement>
            <IconElement  buttonType="ol-btn" handleClick={() => {formatText("1. list item one\n2. list item two", "1. ", "")}} title="Ordered List" label="Ordered List"><OlListIcon /></IconElement>
            <IconElement  buttonType="blockquote-btn" handleClick={() => {formatText("> Blockquote", "> ", "")}} title="Block Quote" label="Block Quote"><BlockQuoteIcon /></IconElement>
            <IconElement  buttonType="code-btn" handleClick={() => { formatMarkdownCode()}}  title="Code" label="Code"><CodeIcon /></IconElement>
            <IconElement  buttonType="link-btn" handleClick={() => {props.setMarkdownImagelink(false);props.toggleModal()}} title="Link" label="Link" id="format-link"><LinkIcon /></IconElement>
            <IconElement  buttonType="imagelink-btn" handleClick={() => {props.setMarkdownImagelink(true);props.toggleModal()}} title="Image" label="Image"><ImageIcon /></IconElement>
        </div>
    )
}

const NavbarMainTools = (props) => {
    const [ showModal, setModal] = useState(false);
    const inputEl = useRef(null);

    const toggleModal = () => {
        setModal(!showModal)
    };
    const readMarkdownFile = (e) => {
        const file = e.target.files[0];
        if(!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const contents = e.target.result;
            props.setMarkdown(contents);
            const textArea = props.getTextArea();
            textArea.value = contents;
            props.saveHistory(contents);
        }
        reader.readAsText(file);
    }

    
    return (
        <div className="navbar__maintools nav-child">
            <input onChange={(e) => {readMarkdownFile(e)}} type="file" id="upload" name="upload" ref={inputEl} />
            <IconElement  handleClick={() => { inputEl.current.click() }} title="Open File" label="Open File"><OpenFileIcon /></IconElement>
            <IconElement  handleClick={() => {toggleModal()}} title="Export" label="Export"><DownloadIcon /></IconElement>
            { showModal ? (
                <Modal>
                    <div className="modal__wrap">
                        <div  className="modal__content">
                         <div className="modal__header">
                            <button  onClick={() => {toggleModal()}}
                             className="modal__close-btn" id="close-modal" 
                             title="close modal" arial-label="Close Modal">
                          <CloseIcon />
                        </button>
                        </div>
                        <div className="modal__body">
                            <h1>Save As</h1>
                            <div className="modal__saveicons">
                                <button onClick={()=> {props.saveAsMarkdown(toggleModal)}} className="save-markdown">
                                    <MarkdownIcon />
                                    <span>Markdown</span>
                                </button>
                                <button onClick={()=> {props.saveAsHtml(toggleModal)}} className="save-html">
                                    <HtmlIcon />
                                    <span>HTML</span>
                                </button>
                                <button onClick={()=> {props.saveAsPDF(toggleModal)}} className="save-pdf">
                                    <PdfIcon />
                                    <span>PDF</span>
                                </button>
                            </div>
                        </div>
                        </div>
                    </div>
                </Modal>
            ):null }
        </div>
    )
} 


const Nav = (props) => {
    const [ showModal, setModal] = useState(false);
    const [ markdownImageLink, setMarkdownImagelink] = useState(false);
    const [ description, setDescription] = useState("");


    useEffect(() => {
        // check if markdown link button is clicked
        if(!markdownImageLink) {
            setDescription("Please provide a URL for your link.");
        } 
        else {
            setDescription("Please provide a URL for your image.");
        }

    }, [markdownImageLink]);

    const toggleModal = () => {
        setModal(!showModal)
    };

    const formatMarkdownLink = (type, url) => {
        let currentValue = null;
        const textArea = props.getTextArea();
        let cursorIndex = 0;
        let  curString = "";
        let text = null;
        let exclamation = "";
        const startPos = textArea.selectionStart;
        const endPos = textArea.selectionEnd;
        const textBeforeCursorPosition = textArea.value.substring(0, startPos)
        const textAfterCursorPosition = textArea.value.substring(endPos, textArea.value.length)
        const lines = textArea.value.substring(0, startPos).split("\n");
        if(type === "anchor") {
            text = "enter link description here";
        }else{
            text = "enter image description here";
            exclamation = "!";
        }
         

        if(startPos !== endPos) {
            text = textArea.value.slice(startPos, endPos);
        }
        if(lines[lines.length - 1 ]) {
            currentValue  = `${textBeforeCursorPosition} ${exclamation}[${text}](${url}) ${textAfterCursorPosition}`; 
            curString = `${textBeforeCursorPosition} ${exclamation}[${text}](${url})`
        }else{
            currentValue  = `${textBeforeCursorPosition}\n${exclamation}[${text}](${url})\n${textAfterCursorPosition}`; 
            curString = `${textBeforeCursorPosition}\n${exclamation}[${text}](${url})`;
        }

        textArea.value = currentValue;
        // get last inserted character index position
        cursorIndex = Number(curString.length);
        props.updateMarkdownState(currentValue, cursorIndex);
        toggleModal();
    }

    return (
        <header>
            <nav className="navbar">
                <EditingIcons  
                toggleModal={toggleModal}
                setMarkdownImagelink={setMarkdownImagelink}
                getTextArea={props.getTextArea}
                updateMarkdownState={props.updateMarkdownState}
                setCursorPos={props.setCursorPos}
                handleUndo={props.handleUndo}
                handleRedo={props.handleRedo}
                undoState={props.undoState}
                historyStep={props.historyStep} />
                <NavbarMainTools setMarkdown={props.setMarkdown}
                getTextArea={props.getTextArea}
                saveHistory={props.saveHistory}
                saveAsHtml={props.saveAsHtml}
                saveAsMarkdown={props.saveAsMarkdown}
                saveAsPDF={props.saveAsPDF} />
                { showModal ? (
                    <Modal>
                    <div className="modal__wrap">
                        <form onSubmit={event => {
                            event.preventDefault();
                            // check if markdown link button is clicked
                            if(!markdownImageLink) {
                                formatMarkdownLink("anchor", event.target.elements.url.value);
                            }
                            else {
                                formatMarkdownLink("image", event.target.elements.url.value);
                            }
                        }} 
                        className="modal__content">
                         <div className="modal__header">
                            <button  onClick={() => {toggleModal()}}
                             className="modal__close-btn" id="close-modal" 
                             title="close modal" arial-label="Close Modal">
                          <CloseIcon />
                        </button>
                        </div>
                        <div className="modal__body">
                          <p>{description}</p>
                            <div className="modal__form">
                            <label htmlFor="url" className="modal__label">URL</label>
                            <input type="url" name="url" className="modal__input" />
                            </div>
                        </div>
                        <div className="modal__footer modal_buttons">
                            <button onClick={() => {toggleModal()}} 
                            className="modal-footer__btn modal__cancel-btn">Cancel</button>
                            <button className="modal-footer__btn modal__okay-btn" type="submit">Ok</button>
                        </div>
                        </form>
                    </div>
                    </Modal>
                ): null}
            </nav>
        </header>
    )
};

export default Nav;
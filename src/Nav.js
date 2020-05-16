import React, { useState, useRef, useEffect } from 'react';
import Modal from './Modal.js';
import { ReactComponent as BoldIcon} from './icons/bold.svg';
import { ReactComponent as LinkIcon} from './icons/chain.svg';
import { ReactComponent as CodeIcon} from './icons/code.svg';
import { ReactComponent as ColumnsIcon} from './icons/columns.svg';
import { ReactComponent as ToggleIcon} from './icons/crosshairs.svg';
import { ReactComponent as EyeIcon} from './icons/eye.svg';
import { ReactComponent as ImageIcon} from './icons/file-image-o.svg';
import { ReactComponent as HeadingIcon} from './icons/header.svg';
import { ReactComponent as ItalicIcon} from './icons/italic.svg';
import { ReactComponent as StrikeThroughIcon} from './icons/strikethrough.svg';
import { ReactComponent as OlListIcon} from './icons/list-ol.svg';
import { ReactComponent as UlListIcon} from './icons/list-ul.svg';
import { ReactComponent as PencilIcon} from './icons/pencil.svg';
import { ReactComponent as BlockQuoteIcon} from './icons/quote-right.svg';
import { ReactComponent as DownloadIcon} from './icons/download.svg';
import { ReactComponent as OpenFileIcon} from './icons/folder-open.svg';
import { ReactComponent as RedoIcon} from './icons/redo2.svg';
import { ReactComponent as UndoIcon} from './icons/undo2.svg';
import { ReactComponent as CloseIcon } from './icons/close.svg';

const IconElement = (props) => {
    return (
            <div>
                <button onClick={props.handleClick} className="navbar__button" title={props.title} arial-label={props.label} id={props.id}>
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
        textArea.value = currentValue;
        props.updateMarkdownState(currentValue);

    }
    const formatText = (defaultText, enclosingTextStart, enclosingTextEnd) => {
        let currentValue = null;
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
        }
        else {
            currentValue  = `${textBeforeCursorPosition}\n${text}\n${textAfterCursorPosition}`; 
        }

        textArea.value = currentValue;
        props.updateMarkdownState(currentValue);
    }

    return (
        <div className="navbar__editing nav-child">
            <IconElement  title="Redo" label="Redo"><RedoIcon /></IconElement>
            <IconElement  title="Undo" label="Undo"><UndoIcon /></IconElement>
            <IconElement  handleClick={() => {formatText("**strong text**", "**", "**")}} title="Bold" label="Bold"><BoldIcon /></IconElement>
            <IconElement  handleClick={() => {formatText("*emphasized text*", "*", "*")}} title="Italic" label="Italic"><ItalicIcon /></IconElement>
            <IconElement  handleClick={() => {formatText("# heading", "# ", "")}} title="Heading" label="Heading"><HeadingIcon /></IconElement>
            <IconElement  handleClick={() => {formatText("~~strikethrough text~~", "~~", "~~")}} title="Strikethrough" label="Strikethrough"><StrikeThroughIcon /></IconElement>
            <IconElement  handleClick={() => {formatText("- list item one\n- list item two", "- ", "")}} title="Unordered List" label="Unordered List"><UlListIcon /></IconElement>
            <IconElement  handleClick={() => {formatText("1. list item one\n2. list item two", "1. ", "")}} title="Ordered List" label="Ordered List"><OlListIcon /></IconElement>
            <IconElement  handleClick={() => {formatText("> Blockquote", "> ", "")}} title="Block Quote" label="Block Quote"><BlockQuoteIcon /></IconElement>
            <IconElement  handleClick={() => { formatMarkdownCode()}}  title="Code" label="Code"><CodeIcon /></IconElement>
            <IconElement  handleClick={() => {props.toggleModal()}} title="Link" label="Link" id="format-link"><LinkIcon /></IconElement>
            <IconElement  title="Image" label="Image"><ImageIcon /></IconElement>
        </div>
    )
}

const NavbarMainTools = () => {
    return (
        <div className="navbar__maintools nav-child">
            <IconElement  title="Open File" label="Open File"><OpenFileIcon /></IconElement>
            <IconElement  title="Export" label="Export"><DownloadIcon /></IconElement>
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

    }, [markdownImageLink]);

    const toggleModal = () => {
        setModal(!showModal)
    };
    const getTextArea = () => {
        const editorWrapperNode = props.textAreaRef.current;
        const  textAreaElement = editorWrapperNode.querySelector('textarea');
        return textAreaElement;

    }


    const formatMarkdownLink = (type, url) => {
        let currentValue = null;
        const textArea = getTextArea();
        let text = null;
        if(type === "anchor") {
            text = "enter link description here";
        }
        const startPos = textArea.selectionStart;
        const endPos = textArea.selectionEnd;
        const textBeforeCursorPosition = textArea.value.substring(0, startPos)
        const textAfterCursorPosition = textArea.value.substring(endPos, textArea.value.length)
        const lines = textArea.value.substring(0, startPos).split("\n");
         
        if(startPos !== endPos) {
            text = textArea.value.slice(startPos, endPos);
        }
        if(lines[lines.length - 1 ]) {
            currentValue  = `${textBeforeCursorPosition} [${text}](${url}) ${textAfterCursorPosition}`; 
        }else{
            currentValue  = `${textBeforeCursorPosition}\n[${text}](${url})\n${textAfterCursorPosition}`; 
        }

        textArea.value = currentValue;
        props.updateMarkdownState(currentValue);
        toggleModal();
    }

    return (
        <header>
            <nav className="navbar">
                <EditingIcons textAreaRef={props.textAreaRef} 
                toggleModal={toggleModal} 
                getTextArea={getTextArea}
                updateMarkdownState={props.updateMarkdownState} />
                <NavbarMainTools />
                { showModal ? (
                    <Modal>
                    <div className="modal__wrap">
                        <form onSubmit={event => {
                            event.preventDefault();
                            // check if markdown link button is clicked
                            if(!markdownImageLink) {
                                formatMarkdownLink("anchor", event.target.elements.url.value);
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
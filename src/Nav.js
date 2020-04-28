import React, { useRef } from 'react';
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

const IconElement = (props) => {
    return (
            <div>
                <button onClick={props.handleClick} className="navbar__button" title={props.title} arial-label={props.label}>
                {props.children}
                </button>
            </div>
    )

}
const EditingIcons = (props) => {

    const getTextArea = () => {
        const editorWrapperNode = props.textAreaRef.current;
        const  textAreaElement = editorWrapperNode.querySelector('textarea');
        return textAreaElement;

    }

    const makeBold = () => {
        const textArea = getTextArea();
        let text = "**strong text**";
        const startPos = textArea.selectionStart;
        const endPos = textArea.selectionEnd;
        // if text is highlighted or selected
        if(startPos !== endPos) {
            const selectedText = textArea.value.slice(startPos, endPos);
            text = `**${selectedText}**`;
        }
        const textBeforeCursorPosition = textArea.value.substring(0, startPos)
        const textAfterCursorPosition = textArea.value.substring(endPos, textArea.value.length)

        const currentValue  = `${textBeforeCursorPosition}${text}${textAfterCursorPosition}`; 
        textArea.value = currentValue;
        props.updateMarkdownState(currentValue);
    }

    return (
        <div className="navbar__editing nav-child">
            <IconElement   title="Redo" label="Redo"><RedoIcon /></IconElement>
            <IconElement  title="Undo" label="Undo"><UndoIcon /></IconElement>
            <IconElement  handleClick={makeBold} title="Bold" label="Bold"><BoldIcon /></IconElement>
            <IconElement  title="Italic" label="Italic"><ItalicIcon /></IconElement>
            <IconElement  title="Heading" label="Heading"><HeadingIcon /></IconElement>
            <IconElement  title="Strikethrough" label="Strikethrough"><StrikeThroughIcon /></IconElement>
            <IconElement  title="Unordered List" label="Unordered List"><UlListIcon /></IconElement>
            <IconElement  title="Ordered List" label="Ordered List"><OlListIcon /></IconElement>
            <IconElement  title="Block Quote" label="Block Quote"><BlockQuoteIcon /></IconElement>
            <IconElement  title="Code" label="Code"><CodeIcon /></IconElement>
            <IconElement  title="Link" label="Link"><LinkIcon /></IconElement>
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
    return (
        <header>
            <nav className="navbar">
                <EditingIcons textAreaRef={props.textAreaRef} updateMarkdownState={props.updateMarkdownState} />
                <NavbarMainTools />
            </nav>
        </header>

    )
};

export default Nav;
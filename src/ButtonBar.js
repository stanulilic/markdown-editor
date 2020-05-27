import React from 'react';
import { ReactComponent as ColumnsIcon} from './icons/columns.svg';
import { ReactComponent as EyeIcon} from './icons/eye.svg';
import { ReactComponent as ShowNavIcon} from './icons/chevron-up.svg';

const ButtonBar = (props) => {
    const toggleNav = () => {
        document.body.classList.toggle('remove-margin');
        const { headerElement, editorWrapper } = props.getDomElements();
        headerElement.classList.toggle('hide');
        editorWrapper.classList.toggle('full-height');

    }

    const makeTextareaFullscreen = () => {
        const { editorWrapper, mdPreviewElement, textAreaElement } = props.getDomElements();
        editorWrapper.classList.toggle('col-2');
        mdPreviewElement.classList.toggle('hide');
        textAreaElement.classList.toggle('editor-padding');

    }
    const makePreviewFullscreen = () => {
        const { editorWrapper, mdPreviewElement, textAreaElement, 
            buttonBarElement, navBarEditingElement, openFileElement } = props.getDomElements();

        editorWrapper.classList.toggle('col-1');
        textAreaElement.classList.toggle('hide');
        openFileElement.classList.toggle('hide-visibility')
        navBarEditingElement.classList.toggle('hide-visibility');
        buttonBarElement.classList.toggle('hide');
        mdPreviewElement.classList.toggle('editor-padding');
        mdPreviewElement.classList.toggle('editor-col');

    }
    return (
        <div className="buttonbar">
            <button onClick={() => {toggleNav()}} className="buttonbar__button">
                <ShowNavIcon />
            </button>
            <button onClick={() => makeTextareaFullscreen()} className="buttonbar__button">
                <ColumnsIcon />
            </button>
            <button onClick={() => makePreviewFullscreen()} className="buttonbar__button">
                <EyeIcon />
            </button>

        </div>

    )
}

export default ButtonBar;
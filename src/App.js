import React, { useState } from 'react';
import TextEditor from './TextEditor';
import MarkdownPreviewer from './MarkdownPreviewer';
import marked from 'marked';


const App = () => {
    const initialMarkdownText = `# This is a heading

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

Type what you got in your mind

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

    const renderMarkdown = (markdown) => {
        const rawHtml = marked(markdown);
        return {__html: rawHtml}

    }

    const changeHandler = (e) => {
        setMarkdown(e.target.value)
    }
    return (
    <div className="editor-container">
        <div className="split">
         <TextEditor text={md} changeHandler={changeHandler} />
         <MarkdownPreviewer renderMarkdown={renderMarkdown(md)} />
        </div>
    </div>
    );
};

export default App;
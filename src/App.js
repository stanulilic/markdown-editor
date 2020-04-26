import React, { useState } from 'react';
import TextEditor from './TextEditor';


const App = () => {
    const initialMarkdownText = `
    # This is a heading
     Type what you got in your mind

     The following is a link: [link text](https://www.reddit.com)

     list items:

     - houses
     - cars
     - animals

     This is a paragraph

     ## This is second heading
    `
    const [text, setText] = useState(initialMarkdownText);
    return (
    <div className="editor-container">
        <div class="split">
         <TextEditor text={text} />
        </div>
    </div>
    );
};

export default App;
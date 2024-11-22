import React from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ code, language, theme, onChange }) {
  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      language={language}
      theme={theme}
      value={code}
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        fontSize: 16,
        wordWrap: 'on',
        automaticLayout: true,
      }}
    />
  );
}

export default CodeEditor;
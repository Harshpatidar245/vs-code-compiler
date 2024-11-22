import React from 'react';

function OutputPanel({ output }) {
  return (
    <div className="h-full bg-gray-800 p-4 overflow-auto">
      <h2 className="text-lg font-semibold mb-2">Output</h2>
      <pre className="font-mono">{output}</pre>
    </div>
  );
}

export default OutputPanel;
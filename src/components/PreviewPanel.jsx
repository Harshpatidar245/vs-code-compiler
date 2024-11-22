import React from 'react';

function PreviewPanel() {
  return (
    <div className="h-full bg-gray-800 p-4">
      <h2 className="text-lg font-semibold mb-2">Preview</h2>
      <iframe
        id="preview-frame"
        className="w-full h-[calc(100%-2rem)] bg-white rounded"
        title="preview"
      ></iframe>
    </div>
  );
}

export default PreviewPanel;
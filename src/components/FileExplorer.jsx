import React from 'react';
import { FiFile, FiFolder, FiPlus, FiTrash } from 'react-icons/fi';

function FileExplorer({ files, currentFile, onFileSelect, onNewFile, onDeleteFile }) {
  return (
    <div className="bg-gray-900 w-64 p-4 border-r border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Files</h2>
        <button
          onClick={onNewFile}
          className="p-1 hover:bg-gray-700 rounded"
          title="New File"
        >
          <FiPlus />
        </button>
      </div>
      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className={`flex items-center justify-between p-2 rounded cursor-pointer ${
              currentFile?.id === file.id ? 'bg-gray-700' : 'hover:bg-gray-800'
            }`}
            onClick={() => onFileSelect(file)}
          >
            <div className="flex items-center gap-2">
              <FiFile className="text-gray-400" />
              <span>{file.name}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFile(file.id);
              }}
              className="p-1 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100"
            >
              <FiTrash className="text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileExplorer;
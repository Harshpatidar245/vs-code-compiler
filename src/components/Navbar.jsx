import React from 'react';

function Navbar({ language, theme, setTheme, onRun, filename }) {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">VS Code Clone</h1>
          <span className="text-gray-400">{filename}</span>
        </div>
        <div className="flex gap-4">
          <select 
            className="bg-gray-700 px-3 py-1 rounded"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="vs-dark">Dark</option>
            <option value="light">Light</option>
          </select>
          <button 
            onClick={onRun}
            className="bg-green-600 px-4 py-1 rounded hover:bg-green-700"
          >
            Run
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
import { useState } from "react";
import Split from "react-split";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Navbar from "./components/Navbar";
import FileExplorer from "./components/FileExplorer";
import CodeEditor from "./components/CodeEditor";
import OutputPanel from "./components/OutputPanel";
import WebPreview from "./components/WebPreview";

const getFileLanguage = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();
  const languageMap = {
    js: "javascript",
    html: "html",
    css: "css",
    cpp: "cpp",
    java: "java",
    py: "python",
  };
  return languageMap[ext] || "plaintext";
};

const getFileTemplate = (language) => {
  const templates = {
    html: "<!DOCTYPE html>\n<html>\n<head>\n  <title>New Page</title>\n</head>\n<body>\n\n</body>\n</html>",
    css: "body {\n  margin: 0;\n  padding: 20px;\n}",
    javascript: "// Your JavaScript code here",
    cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello World!";\n    return 0;\n}',
    java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}',
    python:
      'def main():\n    print("Hello World!")\n\nif __name__ == "__main__":\n    main()',
  };
  return templates[language] || "";
};

function App() {
  const [files, setFiles] = useState([
    {
      id: uuidv4(),
      name: "index.html",
      content: getFileTemplate("html"),
      language: "html",
    },
    {
      id: uuidv4(),
      name: "styles.css",
      content: getFileTemplate("css"),
      language: "css",
    },
    {
      id: uuidv4(),
      name: "script.js",
      content: getFileTemplate("javascript"),
      language: "javascript",
    },
  ]);
  const [currentFile, setCurrentFile] = useState(files[0]);
  const [output, setOutput] = useState("");
  const [theme, setTheme] = useState("vs-dark");

  const handleFileSelect = (file) => {
    setCurrentFile(file);
  };

  const handleNewFile = () => {
    const filename = prompt(
      "Enter file name with extension (e.g., main.cpp, script.js, index.html):"
    );
    if (filename) {
      const language = getFileLanguage(filename);
      const newFile = {
        id: uuidv4(),
        name: filename,
        content: getFileTemplate(language),
        language,
      };
      setFiles([...files, newFile]);
      setCurrentFile(newFile);
    }
  };

  const handleDeleteFile = (fileId) => {
    const newFiles = files.filter((f) => f.id !== fileId);
    if (newFiles.length === 0) {
      alert("Cannot delete the last file!");
      return;
    }
    setFiles(newFiles);
    if (currentFile.id === fileId) {
      setCurrentFile(newFiles[0]);
    }
  };

  const handleEditorChange = (value) => {
    const updatedFiles = files.map((f) =>
      f.id === currentFile.id ? { ...f, content: value } : f
    );
    setFiles(updatedFiles);
    setCurrentFile({ ...currentFile, content: value });
  };

  const runCode = async () => {
  try {
    const requestBody = { code: currentFile.content };

    console.log("Request body:", requestBody); // Log the body before sending the request

    switch (currentFile.language) {
      case "cpp":
        const cppResponse = await axios.post(
          "http://localhost:5000/api/compile/cpp",
          requestBody,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setOutput(cppResponse.data.output);
        break;
      case "python":
        const pyResponse = await axios.post(
          "http://localhost:5000/api/run/python",
          requestBody,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setOutput(pyResponse.data.output);
        break;
      case "java":
        const javaResponse = await axios.post(
          "http://localhost:5000/api/compile/java",
          requestBody,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setOutput(javaResponse.data.output);
        break;
      case "javascript":
        try {
          const result = new Function(currentFile.content)();
          setOutput(String(result));
        } catch (error) {
          setOutput(error.toString());
        }
        break;
      case "html":
      case "css":
        // For HTML and CSS, directly update the iframe to show the preview
        const htmlFile = files.find(f => f.name.endsWith('.html'))?.content || '';
        const cssFile = files.find(f => f.name.endsWith('.css'))?.content || '';
        
        // Update the iframe content with HTML and CSS code
        const iframe = document.getElementById("previewIframe");
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>${cssFile}</style>
            </head>
            <body>
              ${htmlFile}
            </body>
          </html>
        `);
        doc.close();
        setOutput("Preview updated successfully!");
        break;
      default:
        setOutput("Language not supported for execution");
    }
  } catch (error) {
    console.error(error);
    setOutput(error.response?.data?.error || error.message);
  }
};


  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <Navbar
        language={currentFile.language}
        theme={theme}
        setTheme={setTheme}
        onRun={runCode}
        filename={currentFile.name}
      />
      <div className="flex flex-1 overflow-hidden">
        <FileExplorer
          files={files}
          currentFile={currentFile}
          onFileSelect={handleFileSelect}
          onNewFile={handleNewFile}
          onDeleteFile={handleDeleteFile}
        />
        <div className="flex-1">
          <Split
            direction="vertical"
            sizes={[70, 30]}
            minSize={100}
            gutterSize={10}
            className="h-full"
          >
            <div className="h-full">
              <CodeEditor
                code={currentFile.content}
                language={currentFile.language}
                theme={theme}
                onChange={handleEditorChange}
              />
            </div>
            <Split sizes={[50, 50]} minSize={100} gutterSize={10}>
              <OutputPanel output={output} />
              {currentFile.language === "html" ||
              currentFile.language === "css" ||
              currentFile.language === "javascript" ? (
                <WebPreview files={files} />
              ) : null}
            </Split>
          </Split>
        </div>
      </div>
    </div>
  );
}

export default App;

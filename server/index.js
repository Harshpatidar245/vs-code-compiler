import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ensure temp directory exists
const tempDir = path.join(__dirname, 'temp');

// Async function to handle temp directory creation
const createTempDir = async () => {
  try {
    await fs.mkdir(tempDir, { recursive: true }); // ensures the directory is created only if it doesn't exist
  } catch (error) {
    console.error('Error creating temp directory:', error);
  }
};

// Initialize the temp directory
createTempDir();

// Helper function to execute commands
const executeCommand = async (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(new Error(stderr));
      else resolve(stdout);
    });
  });
};

// C++ Compilation and Execution
app.post('/api/compile/cpp', async (req, res) => {
  const { code } = req.body;
  console.log('Received C++ code:', code);  // Log the received code

  const filename = `program_${Date.now()}`;
  const sourcePath = path.join(tempDir, `${filename}.cpp`);
  const execPath = path.join(tempDir, filename);

  try {
    await fs.writeFile(sourcePath, code);
    await executeCommand(`g++ "${sourcePath}" -o "${execPath}"`);
    const output = await executeCommand(`"${execPath}"`);
    res.json({ output });
  } catch (error) {
    console.error('Error during C++ execution:', error);
    res.status(400).json({ error: error.message });
  } finally {
    try {
      await fs.unlink(sourcePath);
      await fs.unlink(execPath);
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
});

// Python Execution
app.post('/api/run/python', async (req, res) => {
  const { code } = req.body;
  console.log('Received Python code:', code);  // Log the received code

  const filename = `program_${Date.now()}.py`;
  const filePath = path.join(tempDir, filename);

  try {
    await fs.writeFile(filePath, code);
    const output = await executeCommand(`python3 "${filePath}"`);
    res.json({ output });
  } catch (error) {
    console.error('Error during Python execution:', error);
    res.status(400).json({ error: error.message });
  } finally {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
});

// Java Compilation and Execution
app.post('/api/compile/java', async (req, res) => {
  const { code } = req.body;
  console.log('Received Java code:', code);  // Log the received code

  const filename = `Main_${Date.now()}`;
  const sourcePath = path.join(tempDir, `${filename}.java`);
  const classPath = path.join(tempDir, filename);

  try {
    await fs.writeFile(sourcePath, code);
    await executeCommand(`javac "${sourcePath}"`);
    const output = await executeCommand(`java -cp "${tempDir}" ${filename}`);
    res.json({ output });
  } catch (error) {
    console.error('Error during Java execution:', error);
    res.status(400).json({ error: error.message });
  } finally {
    try {
      await fs.unlink(sourcePath);
      await fs.unlink(path.join(tempDir, `${filename}.class`));
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

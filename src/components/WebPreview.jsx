import { useEffect, useRef } from 'react';

function WebPreview({ files }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const updatePreview = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      const htmlFile = files.find(f => f.name.endsWith('.html'))?.content || '';
      const cssFile = files.find(f => f.name.endsWith('.css'))?.content || '';
      const jsFile = files.find(f => f.name.endsWith('.js'))?.content || '';

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>${cssFile}</style>
          </head>
          <body>
            ${htmlFile}
            <script>${jsFile}</script>
          </body>
        </html>
      `);
      doc.close();
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.onload = updatePreview;
      updatePreview();
    }
  }, [files]);

  return (
    <div className="h-full bg-gray-800 p-4">
      <h2 className="text-lg font-semibold mb-2 text-white">Preview</h2>
      <iframe
        ref={iframeRef}
        className="w-full h-[calc(100%-2rem)] bg-white rounded"
        title="preview"
        sandbox="allow-scripts allow-same-origin" // Allow same-origin content
        srcDoc="<!DOCTYPE html><html><body></body></html>"
      />
    </div>
  );
}

export default WebPreview;

import React from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, title }) => {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-900 text-gray-100 font-mono text-sm my-4 shadow-sm">
      {title && (
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 text-xs text-gray-400 uppercase tracking-wider">
          {title}
        </div>
      )}
      <div className="p-4 overflow-x-auto">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
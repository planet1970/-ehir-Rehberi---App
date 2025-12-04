import React from 'react';
import { FileStructureItem } from '../types';

interface FileTreeProps {
  items: FileStructureItem[];
  level?: number;
}

export const FileTree: React.FC<FileTreeProps> = ({ items, level = 0 }) => {
  return (
    <div className="font-mono text-sm">
      {items.map((item, index) => (
        <div key={index} style={{ paddingLeft: `${level * 20}px` }}>
          <div className="flex items-center py-1 hover:bg-gray-100 rounded px-2">
            <span className="mr-2">
              {item.type === 'folder' ? '📁' : '📄'}
            </span>
            <span className={`${item.type === 'folder' ? 'font-semibold text-blue-700' : 'text-gray-600'}`}>
              {item.name}
            </span>
          </div>
          {item.children && (
            <FileTree items={item.children} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  );
};
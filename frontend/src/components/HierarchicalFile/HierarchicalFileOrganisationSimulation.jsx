import React, { useState } from 'react';

const HierarchicalFileOrganisation = () => {
  // Initial file system structure
  const initialFileSystem = {
    '/': {
      type: 'directory',
      children: {}
    }
  };

  const [fileSystem, setFileSystem] = useState(initialFileSystem);
  const [currentPath, setCurrentPath] = useState('/');
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('Welcome to the File System Explorer!\nTry commands like: mkdir, cd, create, ls');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Get the current directory from path
  const getCurrentDirectory = (path) => {
    const parts = path.split('/').filter(Boolean);
    let current = fileSystem['/'];
    
    for (const part of parts) {
      if (current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return null;
      }
    }
    
    return current;
  };

  // Get directory at specific path
  const getDirectoryAtPath = (path) => {
    if (path === '/') return fileSystem['/'];
    
    const parts = path.split('/').filter(Boolean);
    let current = fileSystem['/'];
    
    for (const part of parts) {
      if (current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return null;
      }
    }
    
    return current;
  };

  // Process commands
  const processCommand = (cmd) => {
    const parts = cmd.trim().split(' ');
    const action = parts[0].toLowerCase();
    
    // Add command to history
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    
    switch (action) {
      case 'ls':
        return listDirectory();
      case 'cd':
        return changeDirectory(parts.slice(1).join(' '));
      case 'mkdir':
        return createDirectory(parts.slice(1).join(' '));
      case 'create':
        return createFile(parts.slice(1).join(' '));
      case 'cat':
        return viewFile(parts.slice(1).join(' '));
      case 'rm':
        return removeItem(parts.slice(1).join(' '));
      case 'pwd':
        return showCurrentPath();
      case 'help':
        return showHelp();
      case 'tree':
        return displayTree();
      default:
        return `Command not found: ${action}\nTry 'help' for a list of commands`;
    }
  };

  // List directory contents
  const listDirectory = () => {
    const currentDir = getCurrentDirectory(currentPath);
    if (!currentDir || currentDir.type !== 'directory') {
      return 'Error: Not a directory';
    }
    
    const items = Object.keys(currentDir.children || {});
    if (items.length === 0) {
      return 'Directory is empty';
    }
    
    return items.map(item => {
      const isDir = currentDir.children[item].type === 'directory';
      return `${isDir ? 'd ' : 'f '} ${item}`;
    }).join('\n');
  };

  // Change directory
  const changeDirectory = (path) => {
    if (!path) {
      setCurrentPath('/');
      return `Changed directory to /`;
    }
    
    let newPath;
    if (path.startsWith('/')) {
      newPath = path;
    } else if (path === '..') {
      const parts = currentPath.split('/').filter(Boolean);
      parts.pop();
      newPath = parts.length === 0 ? '/' : '/' + parts.join('/');
    } else {
      newPath = currentPath === '/' ? `/${path}` : `${currentPath}/${path}`;
    }
    
    const dir = getDirectoryAtPath(newPath);
    if (!dir || dir.type !== 'directory') {
      return `Error: Cannot access ${newPath}: No such directory`;
    }
    
    setCurrentPath(newPath);
    return `Changed directory to ${newPath}`;
  };

  // Create directory
  const createDirectory = (name) => {
    if (!name) return 'Error: Directory name required';
    
    const updateFileSystem = {...fileSystem};
    const currentDir = getCurrentDirectory(currentPath);
    
    if (!currentDir || currentDir.type !== 'directory') {
      return 'Error: Current location is not a directory';
    }
    
    if (currentDir.children && currentDir.children[name]) {
      return `Error: ${name} already exists`;
    }
    
    // Find the node to update
    const parts = currentPath.split('/').filter(Boolean);
    let node = updateFileSystem['/'];
    for (const part of parts) {
      if (!node.children[part]) {
        return `Error: Path not found`;
      }
      node = node.children[part];
    }
    
    // Create new directory
    if (!node.children) node.children = {};
    node.children[name] = { type: 'directory', children: {} };
    
    setFileSystem(updateFileSystem);
    return `Created directory: ${name}`;
  };

  // Create file
  const createFile = (name) => {
    if (!name) return 'Error: File name required';
    
    const updateFileSystem = {...fileSystem};
    const currentDir = getCurrentDirectory(currentPath);
    
    if (!currentDir || currentDir.type !== 'directory') {
      return 'Error: Current location is not a directory';
    }
    
    if (currentDir.children && currentDir.children[name]) {
      return `Error: ${name} already exists`;
    }
    
    // Find the node to update
    const parts = currentPath.split('/').filter(Boolean);
    let node = updateFileSystem['/'];
    for (const part of parts) {
      if (!node.children[part]) {
        return `Error: Path not found`;
      }
      node = node.children[part];
    }
    
    // Create new file
    if (!node.children) node.children = {};
    node.children[name] = { type: 'file', content: '' };
    
    setFileSystem(updateFileSystem);
    return `Created file: ${name}`;
  };

  // View file
  const viewFile = (name) => {
    if (!name) return 'Error: File name required';
    
    const currentDir = getCurrentDirectory(currentPath);
    if (!currentDir || currentDir.type !== 'directory') {
      return 'Error: Current location is not a directory';
    }
    
    if (!currentDir.children || !currentDir.children[name]) {
      return `Error: ${name} does not exist`;
    }
    
    if (currentDir.children[name].type !== 'file') {
      return `Error: ${name} is not a file`;
    }
    
    return currentDir.children[name].content || '(empty file)';
  };

  // Remove item (file or directory)
  const removeItem = (name) => {
    if (!name) return 'Error: Item name required';
    
    const updateFileSystem = {...fileSystem};
    const currentDir = getCurrentDirectory(currentPath);
    
    if (!currentDir || currentDir.type !== 'directory') {
      return 'Error: Current location is not a directory';
    }
    
    if (!currentDir.children || !currentDir.children[name]) {
      return `Error: ${name} does not exist`;
    }
    
    // Find the node to update
    const parts = currentPath.split('/').filter(Boolean);
    let node = updateFileSystem['/'];
    for (const part of parts) {
      node = node.children[part];
    }
    
    // Remove the item
    delete node.children[name];
    
    setFileSystem(updateFileSystem);
    return `Removed: ${name}`;
  };

  // Show current path
  const showCurrentPath = () => {
    return currentPath;
  };

  // Show help
  const showHelp = () => {
    return `Available commands:
ls - List directory contents
cd [path] - Change directory (use 'cd ..' to go up)
mkdir [name] - Create directory
create [name] - Create file (any extension works, e.g. image.jpg)
cat [name] - View file contents
rm [name] - Remove file or directory
pwd - Show current path
tree - Display file tree structure
help - Show this help message`;
  };

  // Display tree structure
  const displayTree = () => {
    const buildTree = (node, path = '', prefix = '') => {
      if (!node || node.type !== 'directory') return '';
      
      let result = '';
      const items = Object.keys(node.children || {});
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const isLast = i === items.length - 1;
        const isDir = node.children[item].type === 'directory';
        
        result += `${prefix}${isLast ? '└── ' : '├── '}${item}${isDir ? '/' : ''}\n`;
        
        if (isDir) {
          const newPath = path ? `${path}/${item}` : `/${item}`;
          const newPrefix = `${prefix}${isLast ? '    ' : '│   '}`;
          result += buildTree(node.children[item], newPath, newPrefix);
        }
      }
      
      return result;
    };
    
    return `/${buildTree(fileSystem['/'])}`;
  };

  // Render file tree recursively
  const renderFileTree = (structure, path = '', indent = 0) => {
    if (!structure || structure.type !== 'directory') return null;
    
    return Object.keys(structure.children || {}).map((item) => {
      const isDir = structure.children[item].type === 'directory';
      const fullPath = path ? `${path}/${item}` : `/${item}`;
      const paddingLeft = `${indent * 16}px`;
      const isActive = currentPath === fullPath;
      
      return (
        <React.Fragment key={fullPath}>
          <div 
            className={`flex items-center py-1 cursor-pointer hover:bg-purple-100 ${isActive ? 'bg-purple-200' : ''}`}
            style={{ paddingLeft }}
            onClick={() => {
              if (isDir) {
                setCurrentPath(fullPath);
                setOutput(`Changed directory to ${fullPath}`);
              } else {
                setOutput(`Selected file: ${item}\nUse 'cat ${item}' to view contents`);
              }
            }}
          >
            <span className={`inline-block mr-2 ${isDir ? 'text-blue-600' : 'text-purple-600'}`}>
              {isDir ? '📁' : getFileIcon(item)}
            </span>
            <span className={isDir ? 'font-semibold' : ''}>{item}</span>
          </div>
          {isDir && structure.children[item].children && 
            renderFileTree(structure.children[item], fullPath, indent + 1)}
        </React.Fragment>
      );
    });
  };

  // Get icon based on file extension
  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    
    switch(ext) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      case 'txt':
        return '📄';
      case 'md':
        return '📝';
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return '📜';
      case 'json':
        return '📊';
      case 'html':
        return '🌐';
      case 'css':
        return '🎨';
      default:
        return '📄';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!command.trim()) return;
    
    const cmdOutput = `${currentPath}$ ${command}\n${processCommand(command)}`;
    setOutput(prev => `${prev}\n\n${cmdOutput}`);
    setCommand('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-purple-100 to-blue-50 text-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-3 text-white font-bold">
        File System Explorer
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* File tree sidebar */}
        <div className="w-64 bg-white border-r border-purple-200 overflow-y-auto">
          <div className="p-2 font-bold text-purple-800 border-b border-purple-200">
            File Tree
          </div>
          <div className="p-1">
            <div 
              className={`flex items-center py-1 cursor-pointer hover:bg-purple-100 ${currentPath === '/' ? 'bg-purple-200' : ''}`}
              onClick={() => {
                setCurrentPath('/');
                setOutput(prev => `${prev}\n\n/$ cd /\nChanged directory to /`);
              }}
            >
              <span className="inline-block mr-2 text-blue-600">📁</span>
              <span className="font-semibold">/</span>
            </div>
            {renderFileTree(fileSystem['/'], '', 1)}
          </div>
        </div>
        
        {/* Terminal view */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-gray-900 text-green-400 p-3 font-mono text-sm overflow-y-auto whitespace-pre-wrap">
            {output}
          </div>
          
          <form onSubmit={handleSubmit} className="border-t border-gray-700 flex">
            <div className="bg-gray-800 text-green-400 p-2 font-mono">{currentPath}$</div>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-gray-800 text-green-400 p-2 font-mono outline-none border-none"
              placeholder="Type command here (try 'help')"
              autoFocus
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default HierarchicalFileOrganisation;
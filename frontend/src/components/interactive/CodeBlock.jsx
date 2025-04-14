import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ code, language, title }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Calculate the number of lines in the code
  const linesCount = code.split('\n').length;
  
  // Determine preview code (show first 3 lines)
  const previewLineCount = 3;
  const previewCode = code.split('\n').slice(0, previewLineCount).join('\n');
  
  // Show preview if code is longer than preview lines
  const showCollapseOption = linesCount > previewLineCount;
  
  // Display either preview or full code based on expanded state
  const displayCode = (expanded || !showCollapseOption) ? code : previewCode;

  return (
    <div className="rounded-lg overflow-hidden mb-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      {title && (
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</h3>
          {showCollapseOption && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors focus:outline-none"
            >
              {expanded ? 'Collapse' : 'Expand'}
            </button>
          )}
        </div>
      )}
      
      <div className="relative">
        <SyntaxHighlighter
          language={language || 'javascript'}
          style={vscDarkPlus}
          customStyle={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}
          showLineNumbers={true}
        >
          {displayCode}
        </SyntaxHighlighter>
        
        {showCollapseOption && !expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent flex items-end justify-center pb-2">
            <motion.button
              onClick={() => setExpanded(true)}
              className="px-4 py-1 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Show {linesCount - previewLineCount} more lines
            </motion.button>
          </div>
        )}
      </div>
      
      {showCollapseOption && expanded && (
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <motion.button
            onClick={() => setExpanded(false)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors focus:outline-none mx-auto block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Collapse Code
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default CodeBlock; 
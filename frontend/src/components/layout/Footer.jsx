import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About OSCanvas</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Painting OS concepts clearly
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              An interactive platform for learning Operating System concepts through articles and simulations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/journey" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Learning Journey
                </Link>
              </li>
              <li>
                <Link to="/simulations" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Simulations
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources or Topics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Core Topics</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              <li>
                <Link to="/journey#process_management" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Process Management
                </Link>
              </li>
              <li>
                <Link to="/journey#memory" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Memory Management
                </Link>
              </li>
              <li>
                <Link to="/journey#scheduling" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  CPU Scheduling
                </Link>
              </li>
              <li>
                <Link to="/journey#synchronization" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Process Synchronization
                </Link>
              </li>
              <li>
                <Link to="/journey#deadlock" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Deadlock
                </Link>
              </li>
              <li>
                <Link to="/journey#file_systems" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  File Systems
                </Link>
              </li>
              <li>
                <Link to="/journey#interrupts" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Interrupts
                </Link>
              </li>
              <li>
                <Link to="/journey#system_calls" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  System Calls
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} OSCanvas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
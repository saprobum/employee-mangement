import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-3">
      <div className="flex flex-col md:flex-row items-center justify-between px-4 gap-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} HR Portal. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            Terms of Service
          </a>
          <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            Help
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

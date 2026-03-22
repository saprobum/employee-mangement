import React from 'react';
import { useThemeStore } from '../../store/themeStore';

export const ThemeCustomizer: React.FC = () => {
  const { 
    primary, secondary, success, warning, error,
    bannerFrom, bannerTo,
    isSidebarOpen, setSidebarOpen, setThemeColor, resetTheme 
  } = useThemeStore();

  if (!isSidebarOpen) return null;

  const colors = [
    { key: 'primary', label: 'Primary Color', value: primary },
    { key: 'secondary', label: 'Secondary Color', value: secondary },
    { key: 'success', label: 'Success Color', value: success },
    { key: 'warning', label: 'Warning Color', value: warning },
    { key: 'error', label: 'Error Color', value: error },
  ] as const;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* Sidebar panel */}
      <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Theme Settings</h2>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Color Pickers */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider">Design Tokens</h3>
            
            {colors.map(({ key, label, value }) => (
              <div key={key} className="flex flex-col gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {label}
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg shadow-inner overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => setThemeColor(key, e.target.value)}
                      className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    value={value.toUpperCase()}
                    onChange={(e) => setThemeColor(key, e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white uppercase font-mono"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider">Dashboard Banner</h3>
            
            {[
              { key: 'bannerFrom', label: 'Gradient Start', value: bannerFrom },
              { key: 'bannerTo', label: 'Gradient End', value: bannerTo },
            ].map(({ key, label, value }) => (
              <div key={key} className="flex flex-col gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400 font-medium">{label}</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg shadow-inner overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => setThemeColor(key as any, e.target.value)}
                      className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    value={value.toUpperCase()}
                    onChange={(e) => setThemeColor(key as any, e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white uppercase font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={resetTheme}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </>
  );
};

export default ThemeCustomizer;

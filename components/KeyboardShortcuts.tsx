'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Keyboard, X } from 'lucide-react';

export default function KeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Show help with ?
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowHelp(true);
        return;
      }

      // Only handle shortcuts with Ctrl/Cmd
      if (!e.ctrlKey && !e.metaKey) return;

      switch (e.key.toLowerCase()) {
        case 'd':
          e.preventDefault();
          router.push('/');
          break;
        case 'q':
          e.preventDefault();
          router.push('/quotes');
          break;
        case 's':
          e.preventDefault();
          router.push('/sales');
          break;
        case 'e':
          e.preventDefault();
          router.push('/expenses');
          break;
        case 'r':
          e.preventDefault();
          router.push('/reports');
          break;
        case 'k':
          e.preventDefault();
          setShowHelp(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router]);

  if (!showHelp) {
    return (
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="Keyboard Shortcuts (Press ?)"
      >
        <Keyboard size={20} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </h3>
          <button
            onClick={() => setShowHelp(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">Navigation</h4>
            {[
              { keys: ['Ctrl', 'D'], action: 'Go to Dashboard' },
              { keys: ['Ctrl', 'Q'], action: 'Go to Quotes' },
              { keys: ['Ctrl', 'S'], action: 'Go to Sales' },
              { keys: ['Ctrl', 'E'], action: 'Go to Expenses' },
              { keys: ['Ctrl', 'R'], action: 'Go to Reports' },
            ].map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">{shortcut.action}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map((key, i) => (
                    <kbd key={i} className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-2 border-t">
            <h4 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">General</h4>
            <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-700">Show this help</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">
                ?
              </kbd>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-700">Close dialog</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">
                Esc
              </kbd>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <p className="text-xs text-gray-600 text-center">
            Press <kbd className="px-1 py-0.5 text-xs font-semibold bg-white border border-gray-300 rounded">Esc</kbd> or click outside to close
          </p>
        </div>
      </div>
    </div>
  );
}

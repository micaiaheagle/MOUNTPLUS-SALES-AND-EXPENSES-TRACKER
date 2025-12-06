import { Settings, Database, Save } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans text-sm">
      <div className="max-w-[800px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 border border-gray-300 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Settings className="w-6 h-6 text-gray-600" />
            System Settings
          </h1>
          <p className="text-gray-500 mt-1">Manage application configuration and data.</p>
        </div>

        {/* Company Settings */}
        <div className="bg-white p-6 border border-gray-300 shadow-sm">
          <h2 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">Company Information</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input type="text" defaultValue="Mount Plus" className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-gray-50" disabled />
              <p className="text-xs text-gray-500 mt-1">System default.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <input type="text" defaultValue="USD ($)" className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-gray-50" disabled />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white p-6 border border-gray-300 shadow-sm">
          <h2 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Management
          </h2>
          <p className="text-gray-600 mb-4">
            Backup your data regularly. You can export all Sales and Expenses from their respective journals.
          </p>
          
          <div className="flex gap-4">
             {/* Placeholder for future functionality */}
             <button className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 opacity-50 cursor-not-allowed">
               <Save className="w-4 h-4" />
               Backup Database (Coming Soon)
             </button>
          </div>
        </div>

        <div className="text-center text-gray-400 text-xs">
          Mount Plus Sales & Expenses Tracker v1.0.0
        </div>
      </div>
    </div>
  );
}

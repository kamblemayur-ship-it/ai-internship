import React, { useState, useEffect } from 'react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    minMatchScore: 50,
    allowNewRegistrations: true,
    maintenanceMode: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // PRE-WIRED: Fetch global settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/admin/settings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        } else {
          console.warn("Admin Settings API pending. Using default local state.");
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        console.warn("Backend not ready. Simulating save to engine.");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setTimeout(() => setSaving(false), 800); // Simulate network processing
    }
  };

  if (loading) return <div className="p-10 font-bold text-slate-500 animate-pulse">Accessing Core Parameters...</div>;

  return (
    // BLIND SPOT FIXED: No <DashboardLayout> wrapper.
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in relative z-10">
      <div className="border-b border-white/30 pb-5">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Engine Parameters</h1>
        <p className="text-slate-600 mt-1 font-medium">Modify core allocation logic and network access rules.</p>
      </div>

      <div className="bg-white/90 backdrop-blur-xl border border-slate-200 p-8 rounded-3xl shadow-lg">
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* AI Engine Settings */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">AI Allocation Constraints</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Minimum Match Score Threshold (%)</label>
                <input 
                  type="number" 
                  min="0" max="100" 
                  value={settings.minMatchScore} 
                  onChange={e => setSettings({...settings, minMatchScore: parseInt(e.target.value)})}
                  className="w-full md:w-1/3 bg-slate-50 border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6b9b8e]/50"
                />
                <p className="text-[10px] text-slate-400 font-bold mt-1">Students below this percentage will not be allocated to company pipelines.</p>
              </div>
            </div>
          </div>

          {/* Network Security Settings */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Network Security</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.allowNewRegistrations}
                  onChange={e => setSettings({...settings, allowNewRegistrations: e.target.checked})}
                  className="w-5 h-5 rounded border-slate-300 text-[#6b9b8e] focus:ring-[#6b9b8e]"
                />
                <div>
                  <div className="font-bold text-slate-800">Allow New Registrations</div>
                  <div className="text-xs font-medium text-slate-500">Enable or disable new users joining the platform.</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer mt-4">
                <input 
                  type="checkbox" 
                  checked={settings.maintenanceMode}
                  onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})}
                  className="w-5 h-5 rounded border-slate-300 text-red-500 focus:ring-red-500"
                />
                <div>
                  <div className="font-bold text-red-600">Global Maintenance Mode</div>
                  <div className="text-xs font-medium text-red-400">Lock out all non-admin users immediately.</div>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className={`px-8 py-3 rounded-xl font-bold transition-all shadow-md ${
                saving ? 'bg-slate-400 text-white cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {saving ? 'Overwriting...' : 'Commit Changes to Engine'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
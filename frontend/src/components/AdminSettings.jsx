import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';

export default function AdminSettings() {
  // Mock State for AI Weights
  const [weights, setWeights] = useState({
    skills: 70,
    location: 20,
    availability: 10
  });

  // Mock State for System Toggles
  const [toggles, setToggles] = useState({
    registrationOpen: true,
    autoApproveCompanies: false,
    maintenanceMode: false
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleWeightChange = (e) => {
    setWeights({ ...weights, [e.target.name]: parseInt(e.target.value) });
  };

  const handleToggle = (name) => {
    setToggles({ ...toggles, [name]: !toggles[name] });
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call to backend configuration route
    setTimeout(() => {
      setIsSaving(false);
      alert("System configuration updated successfully.");
    }, 1000);
  };

  return (
    <DashboardLayout role="Admin">
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="border-b border-slate-200 pb-5 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings</h1>
            <p className="text-slate-500 mt-1">Configure the AI allocation algorithm and global platform controls.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all ${
              isSaving ? 'bg-slate-400 text-white cursor-not-allowed' : 'bg-[#6b9b8e] hover:bg-[#5a8679] text-white'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: AI Algorithm Tuning */}
          <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Algorithm Weights</h3>
            <p className="text-sm text-slate-500 mb-8">Adjust how the AI matches candidates to startups.</p>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-slate-700">Technical Skills Match</label>
                  <span className="text-sm font-bold text-[#6b9b8e]">{weights.skills}%</span>
                </div>
                <input 
                  type="range" name="skills" min="0" max="100" value={weights.skills} onChange={handleWeightChange}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#6b9b8e]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-slate-700">Location Proximity</label>
                  <span className="text-sm font-bold text-[#6b9b8e]">{weights.location}%</span>
                </div>
                <input 
                  type="range" name="location" min="0" max="100" value={weights.location} onChange={handleWeightChange}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#6b9b8e]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-slate-700">Availability Alignment</label>
                  <span className="text-sm font-bold text-[#6b9b8e]">{weights.availability}%</span>
                </div>
                <input 
                  type="range" name="availability" min="0" max="100" value={weights.availability} onChange={handleWeightChange}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#6b9b8e]"
                />
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500 leading-relaxed">
              <strong>Note:</strong> Adjusting these metrics will immediately alter the matching probabilities for all active students. Run a dry-test allocation before saving.
            </div>
          </div>

          {/* Card 2: Global Platform Controls */}
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Platform Access</h3>
              <p className="text-sm text-slate-500 mb-8">Manage incoming traffic and registrations.</p>

              <div className="space-y-6">
                
                {/* Custom Toggle 1 */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-700">Allow New Registrations</div>
                    <div className="text-xs text-slate-500">Enable or disable the public sign-up page.</div>
                  </div>
                  <button 
                    onClick={() => handleToggle('registrationOpen')}
                    className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${toggles.registrationOpen ? 'bg-[#6b9b8e]' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${toggles.registrationOpen ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </button>
                </div>

                {/* Custom Toggle 2 */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-700">Auto-Approve Startups</div>
                    <div className="text-xs text-slate-500">Skip manual admin verification for new company accounts.</div>
                  </div>
                  <button 
                    onClick={() => handleToggle('autoApproveCompanies')}
                    className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${toggles.autoApproveCompanies ? 'bg-[#6b9b8e]' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${toggles.autoApproveCompanies ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </button>
                </div>

                {/* Custom Toggle 3 */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-700">Maintenance Mode</div>
                    <div className="text-xs text-slate-500">Lock out all non-admin users instantly.</div>
                  </div>
                  <button 
                    onClick={() => handleToggle('maintenanceMode')}
                    className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${toggles.maintenanceMode ? 'bg-red-500' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${toggles.maintenanceMode ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </button>
                </div>

              </div>
            </div>

            {/* Card 3: Danger Zone */}
            <div className="bg-red-50 border border-red-200 p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold text-red-800 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-600 mb-6">Irreversible destructive actions.</p>
              
              <div className="space-y-4">
                <button className="w-full flex justify-between items-center px-4 py-3 bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-semibold text-sm">
                  <span>Purge Unallocated Students</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
                <button className="w-full flex justify-between items-center px-4 py-3 bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-semibold text-sm">
                  <span>Wipe Entire Database</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
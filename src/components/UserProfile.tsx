import React, { useState } from 'react';
import { useUser, UserProfile } from '../context/UserContext';
import { User, Shield, TrendingUp, Save, Trash2 } from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { profile, setProfile, savedStrategies, deleteStrategy } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(profile);

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const toggleAsset = (asset: string) => {
    setEditForm(prev => ({
      ...prev,
      assets: prev.assets.includes(asset) 
        ? prev.assets.filter(a => a !== asset)
        : [...prev.assets, asset]
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-mono uppercase tracking-widest">Trader Profile</h2>
            </div>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="text-xs font-mono text-emerald-500 hover:text-emerald-400"
            >
              {isEditing ? 'SAVE' : 'EDIT'}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-neutral-500 uppercase">Experience Level</label>
              {isEditing ? (
                <select 
                  value={editForm.experience}
                  onChange={e => setEditForm({...editForm, experience: e.target.value as any})}
                  className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded p-2 text-sm text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              ) : (
                <div className="mt-1 text-sm">{profile.experience}</div>
              )}
            </div>

            <div>
              <label className="text-xs font-mono text-neutral-500 uppercase">Risk Appetite</label>
              {isEditing ? (
                <select 
                  value={editForm.riskAppetite}
                  onChange={e => setEditForm({...editForm, riskAppetite: e.target.value as any})}
                  className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded p-2 text-sm text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              ) : (
                <div className="mt-1 text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  {profile.riskAppetite}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-mono text-neutral-500 uppercase">Preferred Assets</label>
              {isEditing ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {['Forex', 'Crypto', 'Stocks', 'Commodities'].map(asset => (
                    <button
                      key={asset}
                      onClick={() => toggleAsset(asset)}
                      className={`px-3 py-1 rounded text-xs font-mono border ${
                        editForm.assets.includes(asset) 
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' 
                          : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                      }`}
                    >
                      {asset}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.assets.map(asset => (
                    <span key={asset} className="px-2 py-1 bg-neutral-800 rounded text-xs font-mono text-neutral-300">
                      {asset}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Save className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-mono uppercase tracking-widest">Saved Strategies</h2>
          </div>

          {savedStrategies.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 font-mono text-sm">
              No strategies saved yet. Create one in the Backtest Engine or Strategy Lab.
            </div>
          ) : (
            <div className="space-y-4">
              {savedStrategies.map(strategy => (
                <div key={strategy.id} className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-emerald-400">{strategy.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono bg-neutral-900 px-2 py-1 rounded text-neutral-400">
                        {strategy.asset}
                      </span>
                      <button onClick={() => deleteStrategy(strategy.id)} className="text-neutral-500 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-300 font-mono line-clamp-2">{strategy.rules}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

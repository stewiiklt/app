import React, { useState } from 'react';
import { User as UserIcon, MapPin, Check, Save, UserCheck, Shield } from 'lucide-react';
import { useUserContext } from '../contexts/UserContext';
import { useLocationContext, SCANDINAVIAN_COUNTRIES } from '../contexts/LocationContext';

export const MyProfilePage: React.FC = () => {
  const { currentUser, updateCurrentUserProfile, switchUser, allDemoUsers } = useUserContext();
  const { allCities } = useLocationContext();

  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [bio, setBio] = useState(currentUser.bio);
  const [cityId, setCityId] = useState(currentUser.cityId);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile(bio, displayName, cityId);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
          My Profile & Settings
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage your personal details and test prototype personas
        </p>
      </div>

      {/* Demo Persona Switcher Banner */}
      <div className="bg-cream-100 rounded-3xl p-5 border border-amber-200 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-coral-600" />
            Switch Active Demo User
          </span>
          <span className="text-[11px] text-gray-500 font-medium">Prototype Testing Tool</span>
        </div>
        <p className="text-xs text-gray-600 mb-4">
          Click any persona below to switch view, test following relationships, and see private reviews from that user's perspective:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {allDemoUsers.map((u) => {
            const isCurrent = u.username === currentUser.username;
            return (
              <button
                key={u.username}
                type="button"
                onClick={() => {
                  switchUser(u.username);
                  setDisplayName(u.displayName);
                  setBio(u.bio);
                  setCityId(u.cityId);
                }}
                className={`flex items-center gap-3 p-2.5 rounded-2xl border text-left transition-all ${
                  isCurrent
                    ? 'bg-white border-coral-500 shadow-xs ring-2 ring-coral-500/20'
                    : 'bg-white/60 border-gray-200 hover:bg-white hover:border-coral-300'
                }`}
              >
                <img
                  src={u.profilePhotoUrl}
                  alt={u.displayName}
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 truncate">
                  <p className="text-xs font-bold text-charcoal-900 truncate">{u.displayName}</p>
                  <p className="text-[10px] text-gray-400">@{u.username} • {u.cityName}</p>
                </div>
                {isCurrent && <span className="text-xs font-bold text-coral-600">Active</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-100">
        <form onSubmit={handleSave} className="space-y-5">
          {/* Avatar display */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <img
              src={currentUser.profilePhotoUrl}
              alt={currentUser.displayName}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-coral-400 shadow-sm"
            />
            <div>
              <p className="text-sm font-bold text-charcoal-900">{currentUser.displayName}</p>
              <p className="text-xs text-coral-600 font-semibold">@{currentUser.username}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{currentUser.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
              Display Name
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-cream-100 border border-gray-200 focus:border-coral-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-charcoal-900 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
              Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-cream-100 border border-gray-200 focus:border-coral-500 focus:bg-white rounded-xl p-4 text-sm text-charcoal-900 focus:outline-none transition-colors resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
              Home Municipality
            </label>
            <select
              value={cityId}
              onChange={(e) => setCityId(Number(e.target.value))}
              className="w-full bg-cream-100 border border-gray-200 focus:border-coral-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-charcoal-900 focus:outline-none transition-colors cursor-pointer"
            >
              {allCities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.countryCode})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex items-center justify-between">
            {savedSuccess ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <Check className="w-4 h-4" />
                Profile updated successfully!
              </span>
            ) : (
              <span className="text-xs text-gray-400">Updates saved to browser session</span>
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

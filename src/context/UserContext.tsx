import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserProfile = {
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  assets: string[];
  riskAppetite: 'Low' | 'Medium' | 'High';
};

export type Strategy = {
  id: string;
  name: string;
  rules: string;
  asset: string;
};

type UserContextType = {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  savedStrategies: Strategy[];
  saveStrategy: (strategy: Strategy) => void;
  deleteStrategy: (id: string) => void;
};

const defaultProfile: UserProfile = {
  experience: 'Intermediate',
  assets: ['Crypto', 'Forex'],
  riskAppetite: 'Medium',
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [savedStrategies, setSavedStrategies] = useState<Strategy[]>([]);

  useEffect(() => {
    const storedProfile = localStorage.getItem('tradeMind_profile');
    const storedStrategies = localStorage.getItem('tradeMind_strategies');
    if (storedProfile) setProfile(JSON.parse(storedProfile));
    if (storedStrategies) setSavedStrategies(JSON.parse(storedStrategies));
  }, []);

  const handleSetProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('tradeMind_profile', JSON.stringify(newProfile));
  };

  const saveStrategy = (strategy: Strategy) => {
    const updated = [...savedStrategies, strategy];
    setSavedStrategies(updated);
    localStorage.setItem('tradeMind_strategies', JSON.stringify(updated));
  };

  const deleteStrategy = (id: string) => {
    const updated = savedStrategies.filter(s => s.id !== id);
    setSavedStrategies(updated);
    localStorage.setItem('tradeMind_strategies', JSON.stringify(updated));
  };

  return (
    <UserContext.Provider value={{ profile, setProfile: handleSetProfile, savedStrategies, saveStrategy, deleteStrategy }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};

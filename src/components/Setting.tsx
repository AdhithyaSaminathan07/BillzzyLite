'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  UserCircleIcon,
  BuildingStorefrontIcon,
  ExclamationTriangleIcon,
  QrCodeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Type for the form data
type FormData = {
  name: string;
  phoneNumber: string;
  address: string;
  shopName: string;
  shopAddress: string;
  merchantUpiId: string;
};

// Type for the SettingsField component's props
type SettingsFieldProps = {
  label: string;
  value: string;
  isEditing: boolean;
  name: keyof FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

// Compacted field component for a static view
const SettingsField = ({ label, value, isEditing, name, onChange, type = 'text' }: SettingsFieldProps) => (
  <div className="py-2 border-b border-gray-200 last:border-b-0">
    <label htmlFor={name} className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
      {label}
    </label>
    {isEditing ? (
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-1.5 px-2 mt-1"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    ) : (
      <p className="text-sm text-gray-800 pt-0.5">{value || '-'}</p>
    )}
  </div>
);

export default function Settings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  // STATE CHANGE: We now track which section is being edited, not the whole page.
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phoneNumber: '',
    address: '',
    shopName: '',
    shopAddress: '',
    merchantUpiId: '',
  });

  // Load data from localStorage or set defaults
  const loadFormData = () => {
    if (session?.user?.email) {
      const savedData = localStorage.getItem(`userSettings-${session.user.email}`);
      if (savedData) {
        setFormData(JSON.parse(savedData));
      } else {
        // Set default data if nothing is saved
        setFormData({
          name: session.user.name || '',
          phoneNumber: '(555) 123-4567',
          address: '456 User Lane, Profile City, 12345',
          shopName: 'Billzzy Lite Store',
          shopAddress: '123 Innovation Dr, Tech City',
          merchantUpiId: 'merchant-id@upi', // Example default UPI
        });
      }
    }
  };
  
  useEffect(() => {
    if (status === 'authenticated') loadFormData();
  }, [session, status]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Save data to localStorage on submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (session?.user?.email) {
      localStorage.setItem(`userSettings-${session.user.email}`, JSON.stringify(formData));
      setEditingSection(null); // Exit editing mode
      alert('Settings saved successfully!');
    } else {
      alert('Could not save settings. User not found.');
    }
  };
  
  // LOGIC CHANGE: On cancel, reload data and exit editing mode.
  const handleCancel = () => {
    loadFormData();
    setEditingSection(null); // Exit editing mode
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Helper component for section headers to avoid repetition
  const SectionHeader = ({ title, sectionKey, icon }: { title: string; sectionKey: string; icon: React.ReactNode }) => (
    <div className="px-3 py-1.5 border-b border-gray-200 flex items-center justify-between gap-2 bg-gray-50">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
      </div>
      <div>
        {editingSection === sectionKey ? (
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleCancel} className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200">
              <XMarkIcon className="h-5 w-5" />
            </button>
            <button type="submit" className="p-1.5 rounded-full text-indigo-600 hover:bg-indigo-100">
              <CheckIcon className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setEditingSection(sectionKey)} className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200">
            <PencilIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );

  if (status === 'authenticated' && session.user) {
    return (
      <div className="bg-gray-50 min-h-screen">
        {/* Header Profile Card - NOW CLEANER, NO EDIT BUTTONS */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                <UserCircleIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-base">{session.user.name}</p>
                <p className="mt-1">
                  <span style={{ backgroundColor: '#5a4fcf' }} className="px-2 py-0.5 rounded-full text-white text-xs font-medium">
                    {session.user.email}
                  </span>
                </p>
              </div>
            </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-2 px-2 pt-2">
          {/* User Profile Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <SectionHeader title="Personal Information" sectionKey="personal" icon={<UserCircleIcon className="h-4 w-4 text-indigo-600" />} />
            <div className="px-3">
              <SettingsField label="Full Name" name="name" value={formData.name} isEditing={editingSection === 'personal'} onChange={handleChange} />
              <SettingsField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} isEditing={editingSection === 'personal'} onChange={handleChange} />
              <SettingsField label="Address" name="address" value={formData.address} isEditing={editingSection === 'personal'} onChange={handleChange} />
            </div>
          </div>

          {/* Shop Details Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <SectionHeader title="Shop Details" sectionKey="shop" icon={<BuildingStorefrontIcon className="h-4 w-4 text-green-600" />} />
            <div className="px-3">
              <SettingsField label="Shop Name" name="shopName" value={formData.shopName} isEditing={editingSection === 'shop'} onChange={handleChange} />
              <SettingsField label="Shop Address" name="shopAddress" value={formData.shopAddress} isEditing={editingSection === 'shop'} onChange={handleChange} />
            </div>
          </div>

          {/* Merchant UPI Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <SectionHeader title="Payment Details" sectionKey="payment" icon={<QrCodeIcon className="h-4 w-4 text-purple-600" />} />
            <div className="px-3">
              <SettingsField label="Merchant UPI ID" name="merchantUpiId" value={formData.merchantUpiId} isEditing={editingSection === 'payment'} onChange={handleChange} />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
             <div className="px-3 py-1.5 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
              <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
              <h2 className="text-sm font-semibold text-gray-800">Account Actions</h2>
            </div>
            <div className="px-3 py-2.5">
              <button 
                onClick={() => signOut({ callbackUrl: '/' })} 
                type="button" 
                className="w-full rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                Log Out
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return null;
}
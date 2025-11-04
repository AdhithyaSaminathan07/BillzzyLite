'use client';

import React, { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Home,
  Package,
  Settings,
  CreditCard,
  LogOut,
  Menu,
  X,
  Clock, // Γ£à Added for Billing History
} from 'lucide-react';

//=========== PROPS DEFINITIONS ===========//
interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: Dispatch<SetStateAction<boolean>>;
}

interface MobileHeaderProps {
  onMenuClick: () => void;
}

//=========== NAVLINK COMPONENT ===========//
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive
          ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md'
          : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  );
}

//=========== SIDEBAR COMPONENT ===========//
export function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
    router.push('/');
  };

  // Close the sidebar when a nav link is clicked on mobile
  const handleLinkClick = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Overlay for mobile view */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 h-full w-64 flex-col bg-white z-40 lg:relative lg:flex transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none lg:border-r ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Header with logo */}
        <div className="flex h-16 items-center justify-between px-5 bg-gradient-to-r from-indigo-50 to-purple-50">
          <Image
            src="/lite-logo.png"
            alt="BillzzyLite Logo"
            width={130}
            height={32}
            priority
          />
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 rounded-full hover:bg-white/50 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X size={22} />
          </button>
        </div>
        
        {/* Decorative line */}
        <div className="h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"></div>

        {/* Navigation Links */}
        <nav
          onClick={handleLinkClick}
          className="flex flex-1 flex-col space-y-2 p-4"
        >
          <NavLink href="/dashboard">
            <Home className="mr-3 h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink href="/inventory">
            <Package className="mr-3 h-5 w-5" />
            <span>Inventory</span>
          </NavLink>

          <NavLink href="/billing">
            <CreditCard className="mr-3 h-5 w-5" />
            <span>Billing</span>
          </NavLink>

          {/* Γ£à New Billing History link */}
          <NavLink href="/billing-history">
            <Clock className="mr-3 h-5 w-5" />
            <span>Billing History</span>
          </NavLink>

          <NavLink href="/settings">
            <Settings className="mr-3 h-5 w-5" />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* Logout Button */}
        <div className="p-4 bg-gray-50">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-600 transition-all hover:bg-red-50 active:bg-red-100 font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

//=========== MOBILEHEADER COMPONENT ===========//
export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-between border-b bg-white px-4 shadow-sm lg:hidden">
      <Image
        src="/lite-logo.png"
        alt="BillzzyLite Logo"
        width={110}
        height={28}
        priority
      />
      <button
        onClick={onMenuClick}
        className="text-gray-600 hover:text-gray-900"
      >
        <Menu size={24} />
      </button>
    </header>
  );
}
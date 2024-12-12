import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, Package, Users, Settings, CreditCard } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Produtos', href: '/products', icon: Package },
  { name: 'Usuários', href: '/users', icon: Users },
  { name: 'Planos', href: '/plans', icon: CreditCard },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden">
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white z-30">
        <div className="h-full flex flex-col">
          <div className="px-4 py-6 bg-indigo-600 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <button
              onClick={onClose}
              className="rounded-md text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-4 bg-white space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors duration-150 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon
                  className="mr-4 h-6 w-6 flex-shrink-0"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
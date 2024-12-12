import React from 'react';
import { Package, Users } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
}

function StatsCard({ title, value, icon, description }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 transition-transform hover:scale-[1.02] duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
        <div className="p-3 bg-indigo-50 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
}

interface DashboardStatsProps {
  totalProducts: number;
  activeUsers: number;
}

export default function DashboardStats({
  totalProducts,
  activeUsers,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatsCard
        title="Total de Produtos"
        value={totalProducts}
        icon={<Package className="h-6 w-6 text-indigo-600" />}
        description="Produtos cadastrados na plataforma"
      />
      <StatsCard
        title="Usuários Ativos"
        value={activeUsers}
        icon={<Users className="h-6 w-6 text-indigo-600" />}
        description="Usuários com acesso ao sistema"
      />
    </div>
  );
}
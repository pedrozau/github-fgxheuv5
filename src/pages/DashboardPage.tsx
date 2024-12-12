import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { getDashboardStats } from '../lib/dashboard';
import type { DashboardStats } from '../lib/dashboard/types';
import DashboardStatsCards from '../components/DashboardStats';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const dashboardStats = await getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="mt-16 lg:mt-0 space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-gray-500">
          Não foi possível carregar os dados do dashboard
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 lg:mt-0 space-y-8 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bem-vindo de volta!</h1>
        <p className="mt-2 text-sm text-gray-600">
          Confira as últimas atualizações do seu negócio
        </p>
      </div>

      <DashboardStatsCards
        totalProducts={stats.totalProducts}
        activeUsers={stats.activeUsers}
      />

      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Atividade Recente</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {stats.recentActivities.length > 0 ? (
            stats.recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-indigo-50 rounded-full">
                      <Clock className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user_name}
                    </p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <time
                      className="text-sm text-gray-500"
                      dateTime={activity.created_at}
                    >
                      {new Date(activity.created_at).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">
              Nenhuma atividade recente para exibir.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
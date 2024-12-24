import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { getActivities } from '../lib/activity/queries';
import type { Activity } from '../lib/activity/types';
import type { PaginatedResponse } from '../lib/types/pagination';
import Pagination from './Pagination';
import toast from 'react-hot-toast';

export default function ActivityList() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [metadata, setMetadata] = useState<PaginatedResponse<Activity>['metadata'] | null>(null);

  const loadActivities = async (page: number) => {
    try {
      const response = await getActivities({ page, limit: 10 });
      setActivities(response.data);
      setMetadata(response.metadata);
    } catch (error) {
      toast.error('Erro ao carregar atividades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities(currentPage);
  }, [currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="divide-y divide-gray-200">
          {activities.map((activity) => (
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
          ))}
        </div>
      </div>

      {metadata && metadata.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={metadata.totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import { plans } from '../lib/plans/data';
import { getCurrentSubscription, getProductCount } from '../lib/plans/queries';
import { updateSubscription } from '../lib/plans/mutations';
import type { Subscription } from '../lib/plans/types';
import PlanCard from '../components/PlanCard';
import toast from 'react-hot-toast';

export default function PlansPage() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [currentSub, count] = await Promise.all([
          getCurrentSubscription(),
          getProductCount(),
        ]);
        setSubscription(currentSub);
        setProductCount(count);
      } catch (error) {
        console.error('Error loading plan data:', error);
        toast.error('Erro ao carregar informações do plano');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSelectPlan = async (planId: string) => {
    try {
      setUpdating(true);
      const updatedSubscription = await updateSubscription(planId);
      setSubscription(updatedSubscription);
      toast.success('Plano atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error('Erro ao atualizar plano');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="mt-16 lg:mt-0 space-y-8 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Planos e Preços</h1>
        <p className="mt-2 text-sm text-gray-600">
          Escolha o melhor plano para o seu negócio
        </p>
      </div>

      {productCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <p className="ml-3 text-sm text-blue-700">
              Você tem atualmente <strong>{productCount}</strong> produtos cadastrados
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={subscription?.plan_id === plan.id}
            onSelect={handleSelectPlan}
            loading={updating}
          />
        ))}
      </div>
    </div>
  );
}
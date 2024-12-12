import React from 'react';
import { Check } from 'lucide-react';
import Button from './Button';
import type { Plan } from '../lib/plans/types';

interface PlanCardProps {
  plan: Plan;
  isCurrentPlan?: boolean;
  onSelect: (planId: string) => void;
  loading?: boolean;
}

export default function PlanCard({ 
  plan, 
  isCurrentPlan,
  onSelect,
  loading 
}: PlanCardProps) {
  return (
    <div className={`
      relative p-6 rounded-lg border ${plan.isPopular 
        ? 'border-indigo-600 shadow-lg' 
        : 'border-gray-200'
      }
    `}>
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-indigo-600 text-white text-sm font-medium px-3 py-1 rounded-full">
            Mais Popular
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
        <div className="mt-4">
          <span className="text-4xl font-bold text-gray-900">
            {plan.price === 0 ? 'Grátis' : `${plan.price} Kz`}
          </span>
          {plan.price > 0 && (
            <span className="text-sm text-gray-500">/mês</span>
          )}
        </div>
      </div>

      <ul className="mt-6 space-y-4">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start">
            <Check className="h-5 w-5 text-indigo-600 shrink-0" />
            <span className="ml-3 text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Button
          onClick={() => onSelect(plan.id)}
          variant={isCurrentPlan ? 'secondary' : 'primary'}
          disabled={isCurrentPlan || loading}
          isLoading={loading}
          className="w-full"
        >
          {isCurrentPlan ? 'Plano Atual' : 'Selecionar Plano'}
        </Button>
      </div>
    </div>
  );
}
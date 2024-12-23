import React from 'react';
import { Mail } from 'lucide-react';
import { Toast, toast } from 'react-hot-toast';

interface EmailConfirmationToastProps {
  t: Toast;
  email: string;
}

export default function EmailConfirmationToast({ t, email }: EmailConfirmationToastProps) {
  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <Mail className="h-10 w-10 text-indigo-500" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              Confirme seu email
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Enviamos um link de confirmação para {email}. Por favor, verifique sua caixa de entrada para ativar sua conta.
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
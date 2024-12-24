import toast from 'react-hot-toast';

export function showEmailConfirmationNotification(email: string): void {
  toast.success(
    `Email de confirmação enviado para ${email}. Por favor, verifique sua caixa de entrada.`,
    {
      duration: 5000,
      position: 'top-right',
      icon: '📧',
    }
  );
}
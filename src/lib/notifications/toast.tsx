import toast from 'react-hot-toast';
import EmailConfirmationToast from '../../components/EmailConfirmationToast';

export function showEmailConfirmationNotification(email: string): void {
  toast.custom(
    (t) => (<EmailConfirmationToast t={t} email={email} />),
    { duration: 8000 }
  );
}
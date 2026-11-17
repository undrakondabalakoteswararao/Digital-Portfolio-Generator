import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/dashboard/PageHeader';
import Field from '../../components/forms/Field';
import { Spinner } from '../../components/common/Loader';
import { getErrorMessage } from '../../utils/errors';

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const acc = useForm({ defaultValues: { name: user.name, email: user.email } });
  const pw = useForm();

  const saveAccount = async (v) => {
    try {
      const { data } = await api.put('/auth/account', v);
      setUser(data.user);
      acc.reset({ name: data.user.name, email: data.user.email });
      toast.success('Account updated');
    } catch (e) { toast.error(getErrorMessage(e)); }
  };
  const savePassword = async (v) => {
    try {
      await api.put('/auth/password', { currentPassword: v.currentPassword, newPassword: v.newPassword });
      pw.reset();
      toast.success('Password updated');
    } catch (e) { toast.error(getErrorMessage(e)); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Account settings" description="Your login details. Portfolio content is edited in the other sections." />
      <form onSubmit={acc.handleSubmit(saveAccount)} noValidate className="card space-y-4 p-5">
        <h2 className="font-semibold">Account</h2>
        <Field label="Full name" required error={acc.formState.errors.name?.message}><input className="input" {...acc.register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })} /></Field>
        <Field label="Email address" required error={acc.formState.errors.email?.message}><input type="email" className="input" {...acc.register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} /></Field>
        <button className="btn btn-primary" disabled={acc.formState.isSubmitting || !acc.formState.isDirty}>{acc.formState.isSubmitting && <Spinner />} Save account</button>
      </form>
      <form onSubmit={pw.handleSubmit(savePassword)} noValidate className="card space-y-4 p-5">
        <h2 className="font-semibold">Change password</h2>
        <Field label="Current password" error={pw.formState.errors.currentPassword?.message}><input type="password" autoComplete="current-password" className="input" {...pw.register('currentPassword', { required: 'Enter your current password' })} /></Field>
        <Field label="New password" error={pw.formState.errors.newPassword?.message} hint="At least 8 characters, with a letter and a number."><input type="password" autoComplete="new-password" className="input" {...pw.register('newPassword', { required: 'Enter a new password', minLength: { value: 8, message: 'At least 8 characters' }, validate: (x) => (/[A-Za-z]/.test(x) && /\d/.test(x)) || 'Needs a letter and a number' })} /></Field>
        <Field label="Confirm new password" error={pw.formState.errors.confirm?.message}><input type="password" autoComplete="new-password" className="input" {...pw.register('confirm', { validate: (x) => x === pw.getValues('newPassword') || 'Passwords do not match' })} /></Field>
        <button className="btn btn-primary" disabled={pw.formState.isSubmitting}>{pw.formState.isSubmitting && <Spinner />} Update password</button>
      </form>
    </div>
  );
}

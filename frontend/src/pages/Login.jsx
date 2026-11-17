import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';
import Field from '../components/forms/Field';
import { Spinner } from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errors';
import useDocumentMeta from '../hooks/useDocumentMeta';

export default function Login() {
  useDocumentMeta({ title: 'Log in - PortfolioForge' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await login(values);
      toast.success('Welcome back!');
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (e) {
      setServerError(getErrorMessage(e));
    }
  };

  return (
    <AuthLayout title="Log in" subtitle="Pick up where you left off." footer={<>New here? <Link to="/register" className="font-semibold text-brand">Create an account</Link></>}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError && <div role="alert" className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{serverError}</div>}
        <Field label="Email address" error={errors.email?.message}>
          <input type="email" autoComplete="email" className="input" placeholder="you@college.edu" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' } })} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <div className="relative">
            <input type={show ? 'text' : 'password'} autoComplete="current-password" className="input pr-10" {...register('password', { required: 'Password is required' })} />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink" aria-label={show ? 'Hide password' : 'Show password'}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>
        <button className="btn btn-primary w-full" disabled={isSubmitting}>{isSubmitting && <Spinner />} Log in</button>
      </form>
    </AuthLayout>
  );
}

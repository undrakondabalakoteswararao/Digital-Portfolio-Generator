import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';
import Field from '../components/forms/Field';
import { Spinner } from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errors';
import useDocumentMeta from '../hooks/useDocumentMeta';

export default function Register() {
  useDocumentMeta({ title: 'Create your account - PortfolioForge' });
  const { register: signUp } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await signUp(values);
      toast.success('Account created. Welcome to PortfolioForge!');
      navigate('/dashboard', { replace: true });
    } catch (e) {
      setServerError(getErrorMessage(e));
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="It takes a minute. No coding needed." footer={<>Already have an account? <Link to="/login" className="font-semibold text-brand">Log in</Link></>}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError && <div role="alert" className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{serverError}</div>}
        <Field label="Full name" error={errors.name?.message}>
          <input autoComplete="name" className="input" {...register('name', { required: 'Full name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' }, maxLength: { value: 80, message: 'Name is too long' } })} />
        </Field>
        <Field label="Email address" error={errors.email?.message}>
          <input type="email" autoComplete="email" className="input" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' } })} />
        </Field>
        <Field label="Password" error={errors.password?.message} hint="At least 8 characters, with a letter and a number.">
          <div className="relative">
            <input type={show ? 'text' : 'password'} autoComplete="new-password" className="input pr-10" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' }, validate: (v) => (/[A-Za-z]/.test(v) && /\d/.test(v)) || 'Password needs a letter and a number' })} />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink" aria-label={show ? 'Hide password' : 'Show password'}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>
        <Field label="Confirm password" error={errors.confirmPassword?.message}>
          <input type={show ? 'text' : 'password'} autoComplete="new-password" className="input" {...register('confirmPassword', { required: 'Confirm your password', validate: (v) => v === watch('password') || 'Passwords do not match' })} />
        </Field>
        <button className="btn btn-primary w-full" disabled={isSubmitting}>{isSubmitting && <Spinner />} Create account</button>
      </form>
    </AuthLayout>
  );
}

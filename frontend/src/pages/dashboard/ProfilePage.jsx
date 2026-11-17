import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProfile } from '../../context/ProfileContext';
import useUnsavedChanges from '../../hooks/useUnsavedChanges';
import PageHeader from '../../components/dashboard/PageHeader';
import Field from '../../components/forms/Field';
import SaveBar from '../../components/forms/SaveBar';
import ImageUploadField from '../../components/forms/ImageUploadField';
import { URL_PATTERN } from '../../utils/format';
import { getErrorMessage } from '../../utils/errors';

const urlRule = { pattern: { value: URL_PATTERN, message: 'Enter a full URL starting with http:// or https://' } };

export default function ProfilePage() {
  const { profile, name, saveProfile, setProfile } = useProfile();

  const toForm = (p, n) => ({
    name: n,
    professionalTitle: p.professionalTitle || '',
    careerObjective: p.careerObjective || '',
    about: p.about || '',
    contactEmail: p.contactEmail || '',
    phone: p.phone || '',
    city: p.city || '',
    country: p.country || '',
    socialLinks: { linkedin: p.socialLinks?.linkedin || '', github: p.socialLinks?.github || '', website: p.socialLinks?.website || '', others: p.socialLinks?.others || [] },
    languages: (p.languages || []).join(', '),
    interests: (p.interests || []).join(', '),
    hobbies: (p.hobbies || []).join(', '),
  });

  const { register, control, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm({ defaultValues: toForm(profile, name) });
  const others = useFieldArray({ control, name: 'socialLinks.others' });
  useUnsavedChanges(isDirty);

  const list = (s) => String(s || '').split(',').map((x) => x.trim()).filter(Boolean);

  const onSubmit = async (v) => {
    try {
      const saved = await saveProfile({
        name: v.name,
        professionalTitle: v.professionalTitle,
        careerObjective: v.careerObjective,
        about: v.about,
        contactEmail: v.contactEmail,
        phone: v.phone,
        city: v.city,
        country: v.country,
        socialLinks: { ...v.socialLinks, others: (v.socialLinks.others || []).filter((o) => o.url).map(({ label, url }) => ({ label, url })) },
        languages: list(v.languages),
        interests: list(v.interests),
        hobbies: list(v.hobbies),
      });
      reset(toForm(saved, v.name));
      toast.success('Profile saved');
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const e = errors;
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <PageHeader title="My profile" description="This information appears at the top of your portfolio and on your resume." />

      <section className="card space-y-5 p-5">
        <h2 className="font-semibold">Personal information</h2>
        <div>
          <span className="label">Profile picture</span>
          <ImageUploadField round endpoint="/profile/upload-image" value={profile.profileImage} onUploaded={(d) => setProfile(d.profile)} label="Upload picture" />
          <p className="mt-1 text-xs text-muted">JPG, PNG or WebP, up to 2 MB. Uploaded immediately.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" required error={e.name?.message}><input className="input" {...register('name', { required: 'Full name is required', minLength: { value: 2, message: 'At least 2 characters' }, maxLength: 80 })} /></Field>
          <Field label="Professional title" error={e.professionalTitle?.message}><input className="input" placeholder="Full-Stack Developer" {...register('professionalTitle', { maxLength: { value: 100, message: 'Maximum 100 characters' } })} /></Field>
          <Field label="Career objective" className="sm:col-span-2" error={e.careerObjective?.message} hint="One or two sentences."><textarea rows={2} className="input" {...register('careerObjective', { maxLength: { value: 500, message: 'Maximum 500 characters' } })} /></Field>
          <Field label="About me" className="sm:col-span-2" error={e.about?.message}><textarea rows={5} className="input" {...register('about', { maxLength: { value: 2000, message: 'Maximum 2000 characters' } })} /></Field>
          <Field label="Contact email" error={e.contactEmail?.message}><input type="email" className="input" {...register('contactEmail', { pattern: { value: /^$|^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} /></Field>
          <Field label="Phone number" error={e.phone?.message}><input className="input" placeholder="+91 98765 43210" {...register('phone', { pattern: { value: /^$|^[+\d][\d\s()-]{6,19}$/, message: 'Enter a valid phone number' } })} /></Field>
          <Field label="City"><input className="input" {...register('city')} /></Field>
          <Field label="Country"><input className="input" {...register('country')} /></Field>
        </div>
      </section>

      <section className="card space-y-5 p-5">
        <h2 className="font-semibold">Social links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="LinkedIn URL" error={e.socialLinks?.linkedin?.message}><input className="input" placeholder="https://linkedin.com/in/you" {...register('socialLinks.linkedin', urlRule)} /></Field>
          <Field label="GitHub URL" error={e.socialLinks?.github?.message}><input className="input" placeholder="https://github.com/you" {...register('socialLinks.github', urlRule)} /></Field>
          <Field label="Personal website" className="sm:col-span-2" error={e.socialLinks?.website?.message}><input className="input" placeholder="https://" {...register('socialLinks.website', urlRule)} /></Field>
        </div>
        <div className="space-y-3">
          {others.fields.map((f, i) => (
            <div key={f.id} className="grid gap-3 sm:grid-cols-[1fr_2fr_auto] sm:items-start">
              <Field label="Label"><input className="input" placeholder="Portfolio, Behance..." {...register(`socialLinks.others.${i}.label`)} /></Field>
              <Field label="URL" error={e.socialLinks?.others?.[i]?.url?.message}><input className="input" {...register(`socialLinks.others.${i}.url`, urlRule)} /></Field>
              <button type="button" className="btn btn-danger sm:mt-7" onClick={() => others.remove(i)} aria-label="Remove link"><Trash2 size={16} /></button>
            </div>
          ))}
          <button type="button" className="btn btn-outline" onClick={() => others.append({ label: '', url: '' })}><Plus size={16} /> Add another link</button>
        </div>
      </section>

      <section className="card space-y-4 p-5">
        <h2 className="font-semibold">Additional information</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Languages known" hint="Comma separated"><input className="input" placeholder="English, Telugu, Hindi" {...register('languages')} /></Field>
          <Field label="Interests" hint="Comma separated"><input className="input" {...register('interests')} /></Field>
          <Field label="Hobbies" hint="Comma separated"><input className="input" {...register('hobbies')} /></Field>
        </div>
      </section>

      <SaveBar dirty={isDirty} saving={isSubmitting} onDiscard={() => reset(toForm(profile, name))} />
    </form>
  );
}

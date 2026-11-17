import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useProfile } from '../../context/ProfileContext';
import useUnsavedChanges from '../../hooks/useUnsavedChanges';
import { getErrorMessage } from '../../utils/errors';
import RecordListEditor from './RecordListEditor';
import SaveBar from './SaveBar';
import PageHeader from '../dashboard/PageHeader';

// Generic page for any "list of records" section. The `tags` field type is edited as comma-separated text.
export default function ArraySectionPage({ section, title, description, fields, emptyItem, itemLabel, addLabel, emptyText }) {
  const { profile, saveProfile } = useProfile();
  const tagKeys = fields.filter((f) => f.type === 'tags').map((f) => f.key);

  const toForm = (list) => ({
    items: (list || []).map((it) => {
      const o = { ...it };
      tagKeys.forEach((k) => { o[k] = (it[k] || []).join(', '); });
      return o;
    }),
  });

  const { register, control, handleSubmit, reset, getValues, formState: { errors, isDirty, isSubmitting } } = useForm({ defaultValues: toForm(profile[section]) });
  useUnsavedChanges(isDirty);

  const onSubmit = async ({ items }) => {
    const payload = items.map((it) => {
      const o = { ...it };
      delete o.id;
      tagKeys.forEach((k) => { o[k] = String(it[k] || '').split(',').map((s) => s.trim()).filter(Boolean); });
      return o;
    });
    try {
      const saved = await saveProfile({ [section]: payload });
      reset(toForm(saved[section]));
      toast.success(`${title} saved`);
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <PageHeader title={title} description={description} />
      <RecordListEditor
        control={control}
        register={register}
        errors={errors}
        fields={fields}
        emptyItem={emptyItem}
        itemLabel={(i) => itemLabel(getValues(`items.${i}`)) }
        addLabel={addLabel}
        emptyText={emptyText}
      />
      <SaveBar dirty={isDirty} saving={isSubmitting} onDiscard={() => reset(toForm(profile[section]))} />
    </form>
  );
}

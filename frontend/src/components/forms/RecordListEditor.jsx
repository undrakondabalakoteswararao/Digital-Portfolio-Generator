import { Controller, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import Field from './Field';
import ImageUploadField from './ImageUploadField';
import { URL_PATTERN } from '../../utils/format';

const rulesFor = (f) => {
  const r = {};
  if (f.required) r.required = `${f.label} is required`;
  if (f.type === 'url') r.pattern = { value: URL_PATTERN, message: 'Enter a full URL starting with http:// or https://' };
  if (f.type === 'year') r.pattern = { value: /^$|^(19|20)\d{2}$/, message: 'Enter a 4-digit year' };
  if (f.max) r.maxLength = { value: f.max, message: `Maximum ${f.max} characters` };
  return r;
};

// Reusable "add / edit / remove multiple records" editor used by Education, Projects, Experience, etc.
export default function RecordListEditor({ control, register, errors, name = 'items', fields: defs, emptyItem, itemLabel, addLabel, emptyText }) {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="space-y-4">
      {fields.length === 0 && (
        <div className="card border-dashed p-8 text-center text-sm text-muted">{emptyText}</div>
      )}
      {fields.map((item, i) => (
        <section key={item.id} className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-semibold">{itemLabel(i)}</h3>
            <button type="button" className="btn btn-danger !px-2 !py-1.5" onClick={() => window.confirm('Remove this entry? The change is saved when you click Save changes.') && remove(i)}>
              <Trash2 size={16} /> Remove
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {defs.map((f) => {
              const path = `${name}.${i}.${f.key}`;
              const error = errors?.[name]?.[i]?.[f.key]?.message;
              const span = f.full ? 'sm:col-span-2' : '';
              return (
                <Field key={f.key} label={f.label} required={f.required} error={error} hint={f.hint} className={span}>
                  {f.type === 'textarea' ? (
                    <textarea rows={4} className="input" placeholder={f.placeholder} {...register(path, rulesFor(f))} />
                  ) : f.type === 'image' ? (
                    <Controller control={control} name={path} render={({ field }) => <ImageUploadField value={field.value} onChange={field.onChange} label="Upload image" />} />
                  ) : (
                    <input
                      className="input"
                      type={f.type === 'month' ? 'month' : f.type === 'date' ? 'date' : 'text'}
                      inputMode={f.type === 'year' ? 'numeric' : undefined}
                      placeholder={f.placeholder}
                      {...register(path, rulesFor(f))}
                    />
                  )}
                </Field>
              );
            })}
          </div>
        </section>
      ))}
      <button type="button" className="btn btn-outline" onClick={() => append({ ...emptyItem })}>
        <Plus size={16} /> {addLabel}
      </button>
    </div>
  );
}

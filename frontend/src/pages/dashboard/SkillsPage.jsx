import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProfile } from '../../context/ProfileContext';
import useUnsavedChanges from '../../hooks/useUnsavedChanges';
import PageHeader from '../../components/dashboard/PageHeader';
import SaveBar from '../../components/forms/SaveBar';
import { SKILL_CATEGORIES, groupSkills } from '../../utils/format';
import { getErrorMessage } from '../../utils/errors';

const clean = (list) => list.map(({ name, category, level }) => ({ name, category, ...(level !== undefined && level !== null ? { level } : {}) }));

export default function SkillsPage() {
  const { profile, saveProfile } = useProfile();
  const [saved, setSaved] = useState(() => clean(profile.skills));
  const [skills, setSkills] = useState(saved);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState(SKILL_CATEGORIES[0]);
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');

  const dirty = JSON.stringify(skills) !== JSON.stringify(saved);
  useUnsavedChanges(dirty);

  const add = (e) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return toast.error('Enter a skill name.');
    if (skills.some((s) => s.name.toLowerCase() === n.toLowerCase() && s.category === category)) return toast.error('You already added that skill.');
    let lvl;
    if (level !== '') {
      lvl = Number(level);
      if (Number.isNaN(lvl) || lvl < 0 || lvl > 100) return toast.error('Proficiency must be between 0 and 100.');
    }
    setSkills([...skills, { name: n, category, ...(lvl !== undefined ? { level: lvl } : {}) }]);
    setName('');
    setLevel('');
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const p = await saveProfile({ skills });
      const next = clean(p.skills);
      setSaved(next);
      setSkills(next);
      toast.success('Skills saved');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const groups = groupSkills(skills);

  return (
    <form onSubmit={save}>
      <PageHeader title="Technical skills" description="Group your skills by type. Proficiency is optional - only add it if you want a progress bar on your portfolio." />
      <div className="card mb-6 grid gap-3 p-5 sm:grid-cols-[1fr_1.2fr_130px_auto] sm:items-end">
        <label><span className="label">Category</span>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>{SKILL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
        <label><span className="label">Skill</span>
          <input className="input" value={name} maxLength={50} placeholder="e.g. JavaScript" onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add(e)} />
        </label>
        <label><span className="label">Level % (optional)</span>
          <input className="input" type="number" min="0" max="100" value={level} onChange={(e) => setLevel(e.target.value)} />
        </label>
        <button type="button" className="btn btn-primary" onClick={add}><Plus size={16} /> Add skill</button>
      </div>

      {groups.length === 0 ? (
        <div className="card border-dashed p-8 text-center text-sm text-muted">No skills added yet. Add your first skill above.</div>
      ) : (
        <div className="space-y-4">
          {groups.map((g) => (
            <section key={g.category} className="card p-5">
              <h3 className="mb-3 font-semibold">{g.category}</h3>
              <div className="flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <span key={s.name + s.category} className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-sm font-medium text-brand">
                    {s.name}{s.level !== undefined && <span className="text-xs opacity-75">{s.level}%</span>}
                    <button type="button" aria-label={`Remove ${s.name}`} onClick={() => setSkills(skills.filter((x) => x !== skills.find((y) => y.name === s.name && y.category === s.category)))} className="rounded-full hover:opacity-70"><X size={14} /></button>
                  </span>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
      <SaveBar dirty={dirty} saving={saving} onDiscard={() => setSkills(saved)} />
    </form>
  );
}

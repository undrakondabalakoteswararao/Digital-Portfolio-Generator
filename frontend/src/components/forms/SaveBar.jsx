import { Save, Undo2 } from 'lucide-react';
import { Spinner } from '../common/Loader';

export default function SaveBar({ dirty, saving, onDiscard }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-6 flex items-center justify-between gap-3 border-t border-line bg-page/90 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
      <p className="text-sm text-muted">{dirty ? 'You have unsaved changes.' : 'All changes saved.'}</p>
      <div className="flex gap-2">
        <button type="button" className="btn btn-ghost" onClick={onDiscard} disabled={!dirty || saving}><Undo2 size={16} /> Discard</button>
        <button type="submit" className="btn btn-primary" disabled={!dirty || saving}>{saving ? <Spinner /> : <Save size={16} />} Save changes</button>
      </div>
    </div>
  );
}

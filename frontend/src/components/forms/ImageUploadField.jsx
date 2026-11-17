import { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { assetUrl } from '../../utils/format';
import { getErrorMessage } from '../../utils/errors';
import { Spinner } from '../common/Loader';

const TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Uploads straight to the API; calls onChange with the stored URL.
export default function ImageUploadField({ value, onChange, endpoint = '/profile/upload-project-image', label = 'Choose image', round = false, onUploaded }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!TYPES.includes(file.type)) return toast.error('Use a JPG, PNG or WebP image.');
    if (file.size > 2 * 1024 * 1024) return toast.error('Image is too large. Maximum size is 2 MB.');
    const body = new FormData();
    body.append('image', file);
    setBusy(true);
    try {
      const { data } = await api.post(endpoint, body);
      onChange?.(data.url);
      onUploaded?.(data);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`grid h-16 w-16 shrink-0 place-items-center overflow-hidden border border-line bg-brand-soft text-muted ${round ? 'rounded-full' : 'rounded-lg'}`}>
        {value ? <img src={assetUrl(value)} alt="" className="h-full w-full object-cover" /> : <ImagePlus size={22} />}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-outline" onClick={() => input.current?.click()} disabled={busy}>
          {busy ? <Spinner /> : <ImagePlus size={16} />} {value ? 'Replace' : label}
        </button>
        {value && onChange && !onUploaded && (
          <button type="button" className="btn btn-ghost" onClick={() => onChange('')}><X size={16} /> Remove</button>
        )}
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={pick} />
    </div>
  );
}

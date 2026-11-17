export default function Field({ label, error, required, hint, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{label}{required && <span className="text-red-500"> *</span>}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted">{hint}</span>}
      {error && <span className="err block">{error}</span>}
    </label>
  );
}

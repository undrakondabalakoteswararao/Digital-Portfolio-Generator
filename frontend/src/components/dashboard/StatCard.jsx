export default function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand"><Icon size={20} /></div>
      <div>
        <p className="text-2xl font-extrabold leading-none">{value}</p>
        <p className="mt-1 text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}

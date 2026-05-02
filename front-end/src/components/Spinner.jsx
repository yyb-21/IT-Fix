const Spinner = () => (
  <div className="space-y-6 py-4">
    <div className="skeleton h-10 max-w-xs skeleton-line border-0" />
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton h-28 border-0" style={{ animationDelay: `${i * 80}ms` }} />
      ))}
    </div>
    <div className="space-y-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="skeleton h-24 border-0" style={{ animationDelay: `${120 + i * 70}ms` }} />
      ))}
    </div>
  </div>
);

export default Spinner;

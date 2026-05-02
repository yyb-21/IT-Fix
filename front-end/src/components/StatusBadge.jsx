const StatusBadge = ({ status }) => {
  const text = status || "open";
  const label = text.replace("_", " ");
  const allowed = ["open", "in_progress", "resolved", "closed"];
  const variant = allowed.includes(text) ? text : "open";
  return (
    <span className={`status-pill status-pill--${variant}`}>
      <span className="status-pill-dot" aria-hidden />
      {label}
    </span>
  );
};

export default StatusBadge;

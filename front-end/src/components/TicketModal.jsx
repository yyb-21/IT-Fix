import { useState } from "react";
import { X } from "lucide-react";

const TicketModal = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!open) return null;

  const submit = async (event) => {
    event.preventDefault();
    await onSubmit({ title, description });
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <form onSubmit={submit} className="modal-panel glass-card">
        <button type="button" className="btn-ghost-icon absolute right-4 top-4" onClick={onClose} aria-label="Close">
          <X size={18} strokeWidth={1.75} />
        </button>
        <h2 className="mb-6 pr-10 text-lg font-semibold tracking-tight text-[var(--text-primary)]">New Ticket</h2>
        <div className="mb-4">
          <label className="form-label" htmlFor="ticket-title">
            Title
          </label>
          <input
            id="ticket-title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short summary"
          />
        </div>
        <div className="mb-6">
          <label className="form-label" htmlFor="ticket-desc">
            Description
          </label>
          <textarea
            id="ticket-desc"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What should IT know?"
            rows={5}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketModal;

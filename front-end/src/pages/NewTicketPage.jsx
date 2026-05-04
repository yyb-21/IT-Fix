import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { createTicketRequest } from "../api/tickets";

const NewTicketPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await createTicketRequest({ title, description });
      toast.success("Ticket created");
      navigate("/dashboard");
    } catch (error) {
      const apiError = error?.response?.data;
      const message =
        apiError?.message ||
        apiError?.error_description ||
        apiError?.msg ||
        apiError?.error ||
        error?.message ||
        "Could not create ticket";
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <Link to="/dashboard" className="mb-6 inline-flex items-center gap-2 text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--accent-bright)]">
          <ArrowLeft size={16} strokeWidth={1.75} />
          Back to dashboard
        </Link>
        <form onSubmit={onSubmit} className="glass-card p-8">
          <p className="mb-1 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">Create</p>
          <h2 className="mb-6 text-xl font-semibold tracking-tight">New ticket</h2>
          <div className="mb-4">
            <label className="form-label" htmlFor="new-title">
              Title
            </label>
            <input id="new-title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="What needs attention?" />
          </div>
          <div className="mb-6">
            <label className="form-label" htmlFor="new-desc">
              Description
            </label>
            <textarea id="new-desc" value={description} onChange={(e) => setDescription(e.target.value)} required rows={6} placeholder="Steps, error messages, urgency..." />
          </div>
          <button type="submit" className="btn-primary">
            Submit ticket
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewTicketPage;

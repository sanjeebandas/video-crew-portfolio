import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type Contact = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  budget?: string;
  preferredDate?: string;
  service?: string;
  subject: string;
  message: string;
  status?: "new" | "processing" | "completed";
  adminNotes?: string;
  createdAt: string;
};

const ContactManager = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const navigate = useNavigate();

  const fetchContacts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please login again.");
      return;
    }

    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/contact`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const contacts = response.data?.contacts || response.data || [];
      setContacts(contacts);
      setError("");
    } catch {
      setError("Failed to fetch contacts.");
      toast.error("❌ Failed to fetch contacts.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: Contact["status"]) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("❌ No token found. Please login again.");

    try {
      setUpdatingId(id);
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/contact/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );
      toast.success("✅ Inquiry status updated!");
    } catch {
      toast.error("❌ Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteContact = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("❌ No token found. Please login again.");

    const confirmed = window.confirm("Are you sure you want to delete this inquiry?");
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts((prev) => prev.filter((c) => c._id !== id));
      toast.success("🗑️ Inquiry deleted.");
    } catch {
      toast.error("❌ Failed to delete inquiry.");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Contact Inquiries</h1>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="px-3 py-1 rounded bg-gray-100 text-sm text-gray-800 hover:bg-gray-200 transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading contacts...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : contacts.length === 0 ? (
        <p className="text-gray-400">No contact submissions found.</p>
      ) : (
        <div className="space-y-6">
          {contacts.map((contact, index) => {
            const isExpanded = expandedIds.includes(contact._id);
            return (
              <div
                key={contact._id}
                className="bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-md text-white transition-all"
              >
                <div className="flex justify-between items-center p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold">{contact.name}</h2>
                      {index === 0 ? (
                        <span className="text-xs bg-green-700 text-white px-2 py-0.5 rounded">
                          Newest
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-600 text-white px-2 py-0.5 rounded">
                          Older
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{contact.email}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={contact.status || "new"}
                      onChange={(e) =>
                        updateStatus(contact._id, e.target.value as Contact["status"])
                      }
                      className="border border-gray-600 rounded px-2 py-1 bg-gray-800 text-sm"
                      disabled={updatingId === contact._id}
                    >
                      <option value="new">New</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                    </select>

                    <button
                      onClick={() => toggleExpand(contact._id)}
                      className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                    >
                      {isExpanded ? "Close" : "More Details"}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-700 p-4 grid gap-2 text-sm bg-[#111]">
                    <div><strong>Phone:</strong> {contact.phone || "-"}</div>
                    <div><strong>Company:</strong> {contact.company || "-"}</div>
                    <div><strong>Budget:</strong> {contact.budget || "-"}</div>
                    <div><strong>Preferred Date:</strong> {contact.preferredDate || "-"}</div>
                    <div><strong>Service:</strong> {contact.service || "-"}</div>
                    <div><strong>Subject:</strong> {contact.subject}</div>
                    <div><strong>Message:</strong> {contact.message}</div>
                    <div><strong>Admin Notes:</strong> {contact.adminNotes || "-"}</div>
                    <div className="pt-2">
                      <button
                        onClick={() => deleteContact(contact._id)}
                        className={`text-red-500 hover:text-red-700 font-medium ${
                          deletingId === contact._id ? "opacity-50 pointer-events-none" : ""
                        }`}
                      >
                        {deletingId === contact._id ? "Deleting..." : "Delete Inquiry"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContactManager;

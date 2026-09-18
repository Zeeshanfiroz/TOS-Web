import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';
import useFocusTrap from '../../hooks/useFocusTrap';
import Spinner from '../../components/ui/Spinner';
import ImageUploadDropzone from '../../components/ui/ImageUploadDropzone';

const emptyForm = {
  title: '',
  description: '',
  date: '',
  location: '',
  eventType: 'organized',
  registrationLink: '',
  ruleBookUrl: '',
  fee: '',
  externalLinks: [], // [{ label, url }]
};

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // event being edited
  const [form, setForm] = useState(emptyForm);
  const [banner, setBanner] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  // Freeze background scroll while the create/edit modal is open
  useLockBodyScroll(showModal);

  // Trap keyboard focus inside the modal; restore focus on close
  const trapRef = useFocusTrap(showModal);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/events', { params: { filter: 'all', limit: 100, includeRsvps: true } });
      setEvents(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load events right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setBanner(null);
    setGalleryFiles([]);
    setShowModal(true);
  };

  const openEdit = (event) => {
    setEditing(event);
    setForm({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().slice(0, 10),
      location: event.location,
      eventType: event.eventType || 'organized',
      registrationLink: event.registrationLink || '',
      ruleBookUrl: event.ruleBookUrl || '',
      fee: event.fee || '',
      externalLinks: event.externalLinks || [],
    });
    setBanner(null);
    setGalleryFiles([]);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.location) {
      toast.error('Please enter the title, date, and location.');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('date', form.date);
      fd.append('location', form.location);
      fd.append('eventType', form.eventType || 'organized');
      // Optional detail fields (sent only if filled — nothing is required)
      if (form.registrationLink.trim()) fd.append('registrationLink', form.registrationLink.trim());
      else if (editing) fd.append('registrationLink', ''); // clear on edit
      if (form.ruleBookUrl.trim()) fd.append('ruleBookUrl', form.ruleBookUrl.trim());
      else if (editing) fd.append('ruleBookUrl', '');
      if (form.fee.trim()) fd.append('fee', form.fee.trim());
      else if (editing) fd.append('fee', '');
      const validLinks = form.externalLinks.filter((l) => l.label?.trim() && l.url?.trim());
      fd.append('externalLinks', JSON.stringify(validLinks));
      if (banner) fd.append('image', banner);
      if (galleryFiles.length) {
        galleryFiles.forEach((file) => fd.append('images', file));
      }

      if (editing) {
        await api.put(`/events/${editing._id}`, fd);
        toast.success('Event updated successfully ✅');
      } else {
        await api.post('/events', fd);
        toast.success('Event created successfully 🌱');
      }
      setShowModal(false);
      loadEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (event) => {
    if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/events/${event._id}`);
      toast.success('Event deleted successfully');
      loadEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to delete this event.');
    }
  };

  // ── Interested list modal (names + emails + bulk email) ──
  const [rsvpModal, setRsvpModal] = useState(null); // { eventTitle, rsvps: [] }
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [mailSubject, setMailSubject] = useState('');
  const [mailMessage, setMailMessage] = useState('');
  const [mailSending, setMailSending] = useState(false);

  const openRsvps = async (event) => {
    setRsvpLoading(true);
    setRsvpModal({ _id: event._id, eventTitle: event.title, rsvps: [] });
    setMailSubject('');
    setMailMessage('');
    try {
      const { data } = await api.get(`/events/${event._id}/rsvps`);
      // Preserve the event _id for the bulk email API call
      setRsvpModal({ _id: event._id, eventTitle: data.data.eventTitle, rsvps: data.data.rsvps });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load the interested list.');
      setRsvpModal(null);
    } finally {
      setRsvpLoading(false);
    }
  };

  const sendBulkEmail = async () => {
    if (!mailSubject.trim() || !mailMessage.trim()) {
      toast.error('Please write both a subject and a message.');
      return;
    }
    setMailSending(true);
    try {
      const { data } = await api.post(`/events/${rsvpModal._id}/rsvps/email`, {
        subject: mailSubject,
        message: mailMessage,
      });
      toast.success(data.message || 'Emails queued!');
      setMailSubject('');
      setMailMessage('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send the emails.');
    } finally {
      setMailSending(false);
    }
  };

  // ── Queries modal (questions with asker name/email + reply) ──
  const [queryModal, setQueryModal] = useState(null); // { eventTitle, queries: [] }
  const [queryLoading, setQueryLoading] = useState(false);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replyBusyId, setReplyBusyId] = useState(null);

  const openQueries = async (event) => {
    setQueryLoading(true);
    setQueryModal({ eventTitle: event.title, queries: [] });
    setReplyDrafts({});
    try {
      const { data } = await api.get(`/events/${event._id}/queries`);
      setQueryModal({ _id: event._id, eventTitle: event.title, queries: data.data });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load the questions.');
      setQueryModal(null);
    } finally {
      setQueryLoading(false);
    }
  };

  const sendReply = async (queryId) => {
    const answer = replyDrafts[queryId]?.trim();
    if (!answer) {
      toast.error('Please write a reply first.');
      return;
    }
    setReplyBusyId(queryId);
    try {
      await api.post(`/events/${queryModal._id}/queries/${queryId}/answer`, { answer });
      toast.success('Reply sent — the member has been emailed. ✅');
      const { data } = await api.get(`/events/${queryModal._id}/queries`);
      setQueryModal((m) => ({ ...m, queries: data.data }));
      setReplyDrafts((d) => ({ ...d, [queryId]: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send the reply.');
    } finally {
      setReplyBusyId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-gray-900">Manage Events</h1>
        <button
          onClick={openCreate}
          className="btn btn-primary px-5 py-2.5 text-sm"
        >
          ➕ New Event
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-forest-50 text-left text-forest-800">
              <tr>
                <th className="px-5 py-3 font-semibold">Event</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Interested members</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((ev) => (
                <tr key={ev._id} className="hover:bg-forest-50/40">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900 line-clamp-1">{ev.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{ev.location}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                    {new Date(ev.date).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">
                    <div className="max-w-sm">
                      <button
                        onClick={() => openRsvps(ev)}
                        className="font-medium text-forest-700 hover:text-forest-800 hover:underline text-left"
                        title="View names + emails, send an update"
                      >
                        {ev.rsvps?.length || 0} interested 👥
                      </button>
                      {ev.rsvps?.length ? (
                        <div className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                          {ev.rsvps.map((r) => r.user?.name || 'Unknown').join(', ')}
                        </div>
                      ) : (
                        <div className="text-[11px] text-gray-400 mt-1">No interested members</div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => openQueries(ev)}
                      className="text-amber-600 hover:text-amber-700 font-medium mr-4"
                      title="View questions and reply"
                    >
                      {ev.queries?.length ? `Queries (${ev.queries.length})` : 'Queries'}
                    </button>
                    <button
                      onClick={() => openEdit(ev)}
                      className="text-forest-600 hover:text-forest-800 font-medium mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ev)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-gray-500">
                    No events yet — create your first one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Create/Edit modal */}
      {showModal && (
        <div
          ref={trapRef}
          role="dialog"
          aria-modal="true"
          aria-label={editing ? 'Edit event' : 'New event'}
          className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-7">
            <h2 className="font-display text-xl font-bold text-gray-900">
              {editing ? 'Edit Event' : 'New Event'}
            </h2>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
                  placeholder="Tree Plantation Drive"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300 resize-none"
                  placeholder="What's this event about?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    value={form.eventType}
                    onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
                  >
                    <option value="organized">Organised</option>
                    <option value="participated">Participated</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
                  placeholder="Main Campus Lawn"
                />
              </div>

              {/* ── Optional details (none of these are required) ── */}
              <div className="border-t border-gray-100 pt-4 mt-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Extra details (all optional)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Link</label>
                    <input
                      type="url"
                      value={form.registrationLink}
                      onChange={(e) => setForm({ ...form, registrationLink: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
                      placeholder="https://unstop.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rule Book Link</label>
                    <input
                      type="url"
                      value={form.ruleBookUrl}
                      onChange={(e) => setForm({ ...form, ruleBookUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
                      placeholder="https://.../rulebook.pdf"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Entry Fee</label>
                    <input
                      type="text"
                      value={form.fee}
                      onChange={(e) => setForm({ ...form, fee: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
                      placeholder='e.g. "Free" or "₹50 per team"'
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other Links</label>
                  {form.externalLinks.map((link, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const links = [...form.externalLinks];
                          links[i] = { ...links[i], label: e.target.value };
                          setForm({ ...form, externalLinks: links });
                        }}
                        className="w-40 px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
                        placeholder="Label (e.g. Brochure)"
                      />
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => {
                          const links = [...form.externalLinks];
                          links[i] = { ...links[i], url: e.target.value };
                          setForm({ ...form, externalLinks: links });
                        }}
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
                        placeholder="https://..."
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, externalLinks: form.externalLinks.filter((_, j) => j !== i) })}
                        className="px-3 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 text-sm font-medium"
                        aria-label="Remove link"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, externalLinks: [...form.externalLinks, { label: '', url: '' }] })}
                    className="mt-1 text-sm font-semibold text-forest-600 hover:text-forest-700"
                  >
                    + Add a link (WhatsApp group, brochure, results...)
                  </button>
                </div>
              </div>
              <div>
                <ImageUploadDropzone
                  label={editing ? 'Banner Image (leave empty to keep current)' : 'Banner Image'}
                  value={banner}
                  onChange={(file) => setBanner(file || null)}
                  helperText={banner ? `Selected: ${banner.name}` : 'Landscape image works best for event banners'}
                />
              </div>
              <div>
                <ImageUploadDropzone
                  label="Extra Event Photos (optional)"
                  value={galleryFiles}
                  onChange={(files) => setGalleryFiles(files || [])}
                  multiple
                  helperText={galleryFiles.length ? `${galleryFiles.length} image(s) selected` : 'Optional gallery for the event'}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editing ? 'Update Event' : 'Create Event'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Interested members modal: names + emails + bulk email ── */}
      {rsvpModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setRsvpModal(null)}>
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-gray-900">Interested Members</h2>
                <p className="text-xs text-gray-500">{rsvpModal.eventTitle}</p>
              </div>
              <button onClick={() => setRsvpModal(null)} className="text-gray-400 hover:text-gray-600 text-xl" aria-label="Close">✕</button>
            </div>

            {rsvpLoading ? (
              <Spinner />
            ) : rsvpModal.rsvps.length === 0 ? (
              <p className="text-sm text-gray-500">No one has marked interest yet.</p>
            ) : (
              <>
                <div className="rounded-xl border border-gray-100 divide-y divide-gray-100 max-h-56 overflow-y-auto mb-4">
                  {rsvpModal.rsvps.map((r) => (
                    <div key={r._id} className="px-4 py-2.5 flex items-center justify-between gap-3 text-sm">
                      <div>
                        <p className="font-medium text-gray-900">{r.name}</p>
                        <p className="text-xs text-gray-500">{r.email}</p>
                      </div>
                      <a
                        href={`mailto:${r.email}`}
                        className="text-xs text-forest-600 hover:text-forest-800 font-medium whitespace-nowrap"
                      >
                        Email
                      </a>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl bg-forest-50 border border-forest-100 p-4">
                  <p className="text-sm font-semibold text-forest-800 mb-2">
                    📧 Send an update to all {rsvpModal.rsvps.length} interested member(s)
                  </p>
                  <input
                    type="text"
                    value={mailSubject}
                    onChange={(e) => setMailSubject(e.target.value)}
                    placeholder="Subject (e.g. Venue change for RE:GEN)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300 mb-2 text-sm"
                  />
                  <textarea
                    rows={4}
                    value={mailMessage}
                    onChange={(e) => setMailMessage(e.target.value)}
                    placeholder="Write the update... (line breaks are preserved in the email)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300 resize-none text-sm"
                  />
                  <button
                    onClick={sendBulkEmail}
                    disabled={mailSending}
                    className="mt-2 w-full py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-sm font-semibold disabled:opacity-60"
                  >
                    {mailSending ? 'Sending...' : `Send to ${rsvpModal.rsvps.length} member(s)`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Queries modal: questions with name/email + reply ── */}
      {queryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setQueryModal(null)}>
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-gray-900">Event Queries</h2>
                <p className="text-xs text-gray-500">{queryModal.eventTitle}</p>
              </div>
              <button onClick={() => setQueryModal(null)} className="text-gray-400 hover:text-gray-600 text-xl" aria-label="Close">✕</button>
            </div>

            {queryLoading ? (
              <Spinner />
            ) : queryModal.queries.length === 0 ? (
              <p className="text-sm text-gray-500">No questions yet. Members can ask from the event page.</p>
            ) : (
              <div className="space-y-4">
                {queryModal.queries.map((q) => (
                  <div key={q._id} className="rounded-xl border border-gray-100 p-4">
                    <p className="text-sm text-gray-800 font-medium">Q. {q.question}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      — {q.user?.name || 'Unknown'} ({q.user?.email || 'no email'})
                    </p>
                    {q.answer ? (
                      <div className="mt-3 pl-3 border-l-2 border-forest-300">
                        <p className="text-xs font-semibold text-forest-700">Your reply:</p>
                        <p className="text-sm text-gray-700">{q.answer}</p>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <textarea
                          rows={3}
                          value={replyDrafts[q._id] || ''}
                          onChange={(e) => setReplyDrafts((d) => ({ ...d, [q._id]: e.target.value }))}
                          placeholder="Write a reply — it will be emailed to the member..."
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300 resize-none text-sm"
                        />
                        <button
                          onClick={() => sendReply(q._id)}
                          disabled={replyBusyId === q._id}
                          className="mt-2 px-4 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-semibold disabled:opacity-60"
                        >
                          {replyBusyId === q._id ? 'Sending...' : 'Send Reply'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
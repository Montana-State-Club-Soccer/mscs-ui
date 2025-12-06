import { useState, useEffect } from 'react';
import { Card, ImageBlock, Button, Spinner, Modal, Input, Divider } from 'mscss-montana';
import { useAuth } from '../hooks/useAuth';

import { getEvents, deleteEvent, createEvent, updateEvent, uploadImage } from '../utils/api'; 
import PlayerImage from '../images/team24.jpg';

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    imageUrl: '' 
  });

  const [showEditEvent, setShowEditEvent] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadingEdit, setUploadingEdit] = useState(false);
  const [uploadErrorEdit, setUploadErrorEdit] = useState('');
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    imageUrl: ''
  });

  const { isAdmin } = useAuth();
  
  useEffect(() => {
    loadEvents();
  }, []);

  // --- API / Data Handlers ---

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      // Sort by creation date or another relevant field, newest first
      setEvents(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      setError('Failed to load events.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ title: '', description: '', imageUrl: '' });
    setUploadError('');
  };

  const resetEditForm = () => {
    setEditingId(null);
    setEditForm({ title: '', description: '', imageUrl: '' });
    setUploadErrorEdit('');
  };

  // CREATE Event
  const handleCreateEvent = async () => {
    if (!form.title || !form.imageUrl) {
      alert('Title and Image are required for an event.');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl,
      };
      const created = await createEvent(payload);
      setEvents(prev => [created, ...prev]);
      setShowAddEvent(false);
      resetForm();
    } catch (err) {
      alert(err.message || 'Failed to create event.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // DELETE Event
  const handleDeleteEvent = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await deleteEvent(id);
      setEvents(events.filter(e => e._id !== id));
    } catch (err) {
      alert('Failed to delete event.');
      console.error(err);
    }
  };

  // UPDATE Event
  const handleUpdateEvent = async () => {
    if (!editForm.title || !editForm.imageUrl) {
      alert('Title and Image are required.');
      return;
    }
    if (!editingId) return;

    try {
      setSavingEdit(true);
      const payload = {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        imageUrl: editForm.imageUrl,
      };
      const updated = await updateEvent(editingId, payload);
      setEvents((prev) => prev.map(e => e._id === editingId ? updated : e));
      setShowEditEvent(false);
      resetEditForm();
    } catch (err) {
      alert(err.message || 'Failed to update event.');
      console.error(err);
    } finally {
      setSavingEdit(false);
    }
  };

  // START Edit Event
  const startEditEvent = (event) => {
    setEditingId(event._id);
    setEditForm({
      title: event.title || '',
      description: event.description || '',
      imageUrl: event.imageUrl || ''
    });
    setShowEditEvent(true);
  };
  
  // --- Image Upload Handlers ---

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    try {
      setUploading(true);
      const { url } = await uploadImage(file); 
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (err) {
      setUploadError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelectEdit = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadErrorEdit('');
    try {
      setUploadingEdit(true);
      const { url } = await uploadImage(file);
      setEditForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (err) {
      setUploadErrorEdit(err.message || 'Image upload failed');
    } finally {
      setUploadingEdit(false);
    }
  };


  // --- Render Logic ---

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner label="Loading home page content..." /></div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome to Montana State Club Soccer</h1>
        {isAdmin && (
          <Button variant="primary" onClick={() => setShowAddEvent(true)}>Add Event</Button>
        )}
      </div>

      <ImageBlock 
        aspectRatio="panoramic" 
        image={PlayerImage} 
      />

      <Divider className='my-8' variant="secondary"/>

      <section>
        <h2 className="text-2xl font-bold mb-4">Latest Events</h2>
        {events.length === 0 ? (
          <p className="text-gray-500">No events posted yet. Check back soon!</p>
        ) : (
          <div className="space-y-6">
            {events.map(event => (
              <Card key={event._id} colorScheme="gold" variant="default" className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  
                  <div className="md:w-1/3 flex-shrink-0">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title} 
                      className="w-full h-48 md:h-full object-cover rounded-lg shadow-md"
                    />
                  </div>

                  <div className="md:w-2/3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{event.title}</h3>
                      {isAdmin && (
                        <div className="flex gap-2">
                          <Button variant="outlined" size="sm" onClick={() => startEditEvent(event)}>Edit</Button>
                          <Button 
                            variant="outlined" 
                            size="sm"
                            onClick={() => handleDeleteEvent(event._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{event.description}</p>
                    <p className="text-sm text-gray-400">Posted: {new Date(event.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {isAdmin && (
        <Modal
          isOpen={showAddEvent}
          onClose={() => { if (!saving) { setShowAddEvent(false); resetForm() } }}
          title="Add New Event"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => { if (!saving) { setShowAddEvent(false); resetForm() } }}>Cancel</Button>
              <Button variant="primary" onClick={handleCreateEvent} disabled={saving || uploading || !form.title || !form.imageUrl}>
                {saving ? 'Posting...' : 'Post Event'}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Event Title"
              placeholder="e.g., Spring Fundraiser"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input
              label="Description"
              placeholder="Details about the event..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="space-y-2">
              <Input
                label="Upload Image"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
              />
              {uploading && <p className="text-sm text-gray-600">Uploading...</p>}
              {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
              <Input
                label="Or Image URL"
                type="url"
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
              {form.imageUrl && (
                <div className="mt-2">
                  <img src={form.imageUrl} alt="Preview" className="h-24 w-24 object-cover rounded" />
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {isAdmin && editingId && (
        <Modal
          isOpen={showEditEvent}
          onClose={() => { if (!savingEdit) { setShowEditEvent(false); resetEditForm() } }}
          title="Edit Event"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => { if (!savingEdit) { setShowEditEvent(false); resetEditForm() } }}>Cancel</Button>
              <Button variant="primary" onClick={handleUpdateEvent} disabled={savingEdit || uploadingEdit || !editForm.title || !editForm.imageUrl}>
                {savingEdit ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Event Title"
              placeholder="e.g., Spring Fundraiser"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            />
            <Input
              label="Description"
              placeholder="Details about the event..."
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
            <div className="space-y-2">
              <Input
                label="Upload Image"
                type="file"
                accept="image/*"
                onChange={handleImageSelectEdit}
              />
              {uploadingEdit && <p className="text-sm text-gray-600">Uploading...</p>}
              {uploadErrorEdit && <p className="text-sm text-red-600">{uploadErrorEdit}</p>}
              <Input
                label="Or Image URL"
                type="url"
                placeholder="https://..."
                value={editForm.imageUrl}
                onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
              />
              {editForm.imageUrl && (
                <div className="mt-2">
                  <img src={editForm.imageUrl} alt="Preview" className="h-24 w-24 object-cover rounded" />
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Home;
import React, { useMemo, useState } from 'react';
import { MessageSquare, Plus, Search, Copy, Send, Trash2, Edit2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePersistedData } from '../../hooks/usePersistedData';
import { useConfirm } from '../../hooks/useConfirm';

const BUSINESS_NAME = import.meta.env.VITE_BUSINESS_NAME || 'Asrar Solar';

interface Template {
  id: number;
  name: string;
  content: string;
}

export const WhatsAppTemplates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({ name: '', content: '' });
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [testPhone, setTestPhone] = useState('');
  const [showTestInput, setShowTestInput] = useState<number | null>(null);
  const { openConfirm, ConfirmDialogWrapper } = useConfirm();

  const [templates, setTemplates] = usePersistedData<Template[]>('whatsapp_templates', [
    { id: 1, name: 'Initial Lead Greeting', content: `Namaste {{name}} ji, thank you for inquiring with ${BUSINESS_NAME}. We have received your request for {{service}} in {{city}}. Our team will contact you shortly.` },
    { id: 2, name: 'Quote Follow-up', content: 'Hello {{name}} ji, just following up on the quotation QT-{{id}} we sent for your {{size}} solar system. Do you have any questions regarding the subsidies?' },
    { id: 3, name: 'AMC Reminder', content: 'Dear {{name}}, your solar system maintenance is due on {{date}}. Regular cleaning ensures 20% more efficiency. Reply YES to schedule.' },
  ]);

  const filtered = useMemo(() =>
    templates.filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.content.toLowerCase().includes(searchTerm.toLowerCase())),
    [templates, searchTerm]
  );

  const openAdd = () => {
    setEditingTemplate(null);
    setFormData({ name: '', content: '' });
    setShowForm(true);
  };

  const openEdit = (t: Template) => {
    setEditingTemplate(t);
    setFormData({ name: t.name, content: t.content });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.content.trim()) return;
    if (editingTemplate) {
      setTemplates((prev) => prev.map((t) => t.id === editingTemplate.id ? { ...t, ...formData } : t));
    } else {
      setTemplates((prev) => [...prev, { id: Date.now(), ...formData }]);
    }
    setShowForm(false);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await openConfirm({
      title: 'Delete Template',
      message: 'Are you sure? This cannot be undone.',
    });
    if (confirmed) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleCopy = async (t: Template) => {
    await navigator.clipboard.writeText(t.content);
    setCopiedId(t.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTestSend = (t: Template) => {
    if (!testPhone.trim()) return;
    const phone = testPhone.replace(/\D/g, '');
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(t.content)}`, '_blank');
    setShowTestInput(null);
    setTestPhone('');
  };

  const inputCls = 'admin-input w-full px-3 py-2.5 rounded-xl text-sm';

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">WhatsApp Templates</h1>
            <p className="text-white/40">Manage pre-defined messages for quick customer communication.</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-amber text-depth px-5 py-2.5 rounded-xl hover:bg-amber-light transition-colors font-bold shadow-sm"
          >
            <Plus size={20} />
            New Template
          </button>
        </div>

        <div className="admin-card p-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input w-full pl-10 pr-4 py-2.5 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.length === 0 && (
            <p className="col-span-2 text-center text-gray-400 text-sm py-8">No templates match your search.</p>
          )}
          {filtered.map((template) => (
            <motion.div
              key={template.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="admin-card p-6 hover:border-amber/30 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-dim text-emerald flex items-center justify-center">
                    <MessageSquare size={20} />
                  </div>
                  <h3 className="font-bold text-white">{template.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(template)} className="p-2 text-white/30 hover:text-amber transition-colors" title="Edit">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(template.id)} className="p-2 text-white/30 hover:text-red-400 transition-colors" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="bg-depth p-4 rounded-xl text-sm text-white/60 mb-4 font-body leading-relaxed whitespace-pre-wrap">
                {template.content}
              </div>

              {showTestInput === template.id ? (
                <div className="flex gap-2 mb-2">
                  <input
                    type="tel"
                    placeholder="Customer phone (10 digits)"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="admin-input flex-1 px-3 py-2 rounded-lg text-sm"
                  />
                  <button onClick={() => handleTestSend(template)} className="px-3 py-2 bg-emerald text-depth rounded-lg text-xs font-bold hover:bg-emerald-light transition-colors">
                    Send
                  </button>
                  <button onClick={() => setShowTestInput(null)} className="px-3 py-2 bg-depth text-white/40 rounded-lg text-xs font-bold hover:text-white transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleCopy(template)}
                    className="flex-1 flex items-center justify-center gap-2 bg-depth border border-white/10 py-2 rounded-lg text-xs font-bold text-white/70 hover:text-white hover:border-white/20 transition-colors"
                  >
                    {copiedId === template.id ? <><Check size={14} className="text-emerald" /> Copied!</> : <><Copy size={14} /> Copy Text</>}
                  </button>
                  <button
                    onClick={() => { setShowTestInput(template.id); setTestPhone(''); }}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-dim text-emerald py-2 rounded-lg text-xs font-bold hover:bg-emerald/20 transition-colors"
                  >
                    <Send size={14} />
                    Test Send
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="fixed inset-0 bg-void/70 backdrop-blur-sm z-[300]" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-[301] flex items-center justify-center p-4">
              <div className="admin-card w-full max-w-lg p-6 space-y-5">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-display font-bold text-white">{editingTemplate ? 'Edit Template' : 'New Template'}</h2>
                  <button onClick={() => setShowForm(false)} className="p-2 hover:bg-depth rounded-full transition-colors text-white/40 hover:text-white"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase mb-1">Template Name *</label>
                    <input value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} className={inputCls} placeholder="e.g. Site Survey Confirmation" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase mb-1">Message Content *</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                      rows={5}
                      className={`${inputCls} resize-none`}
                      placeholder="Use {{name}}, {{city}}, {{date}} as placeholders..."
                    />
                    <p className="text-[10px] text-white/30 mt-1">Variables: {'{{name}}'}, {'{{city}}'}, {'{{service}}'}, {'{{date}}'}, {'{{size}}'}, {'{{id}}'}</p>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} className="flex-1 bg-amber text-depth py-3 rounded-xl font-bold hover:bg-amber-light transition-colors">
                    {editingTemplate ? 'Save Changes' : 'Create Template'}
                  </button>
                  <button onClick={() => setShowForm(false)} className="px-5 py-3 bg-depth text-white/40 rounded-xl font-bold hover:text-white transition-colors">Cancel</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    <ConfirmDialogWrapper />
  </>
  );
};

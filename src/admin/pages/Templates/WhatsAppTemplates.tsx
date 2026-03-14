import React, { useState } from 'react';
import { MessageSquare, Plus, Search, Copy, Send, Trash2, Edit2 } from 'lucide-react';

export const WhatsAppTemplates = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const templates = [
    { id: 1, name: 'Initial Lead Greeting', content: 'Namaste {{name}} ji, thank you for inquiring with SolarEdge Pro. We have received your request for {{service}} in {{city}}. Our team will contact you shortly.' },
    { id: 2, name: 'Quote Follow-up', content: 'Hello {{name}} ji, just following up on the quotation QT-{{id}} we sent for your {{size}} solar system. Do you have any questions regarding the subsidies?' },
    { id: 3, name: 'AMC Reminder', content: 'Dear {{name}}, your solar system maintenance is due on {{date}}. Regular cleaning ensures 20% more efficiency. Reply YES to schedule.' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-sky-deep mb-2">WhatsApp Templates</h1>
          <p className="text-gray-500">Manage pre-defined messages for quick customer communication.</p>
        </div>
        
        <button className="flex items-center gap-2 bg-sky-deep text-white px-5 py-2.5 rounded-xl hover:bg-sky transition-colors font-bold shadow-sm">
          <Plus size={20} />
          New Template
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-sky/5">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search templates..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white p-6 rounded-2xl border border-sky/5 shadow-sm hover:border-sun transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal/10 text-teal flex items-center justify-center">
                  <MessageSquare size={20} />
                </div>
                <h3 className="font-bold text-sky-deep">{template.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-sky-deep transition-colors" title="Edit">
                  <Edit2 size={18} />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="bg-light-bg p-4 rounded-xl text-sm text-gray-600 mb-4 font-body leading-relaxed">
              {template.content}
            </div>
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-sky/10 py-2 rounded-lg text-xs font-bold text-sky-deep hover:bg-sky/5 transition-colors">
                <Copy size={14} />
                Copy Text
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-teal text-white py-2 rounded-lg text-xs font-bold hover:bg-teal-600 transition-colors">
                <Send size={14} />
                Test Send
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

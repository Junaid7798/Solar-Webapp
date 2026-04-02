import React, { useMemo, useState } from 'react';
import { Package, Plus, Search, Filter, AlertTriangle, ArrowUpRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePersistedData } from '../../hooks/usePersistedData';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20, stiffness: 200 } },
};

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  minStock: number;
  price: number;
}

export const Inventory = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('All Categories');
  const [showAddModal, setShowAddModal] = useState(false);
  const [manageItem, setManageItem] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustMode, setAdjustMode] = useState<'add' | 'subtract'>('add');
  const [newItem, setNewItem] = useState({ name: '', category: 'Panels', stock: '', unit: 'Nos', minStock: '', price: '' });

  const [inventoryItems, setInventoryItems] = usePersistedData('inventory_items', [
    { id: 'INV-001', name: 'Luminous 540W Mono PERC', category: 'Panels', stock: 124, unit: 'Nos', minStock: 50, price: 14500 },
    { id: 'INV-002', name: 'Tata Solar 5kW Inverter', category: 'Inverters', stock: 8, unit: 'Nos', minStock: 10, price: 42000 },
    { id: 'INV-003', name: 'DC Cable 4sqmm (Red)', category: 'Cables', stock: 450, unit: 'Mtrs', minStock: 200, price: 85 },
    { id: 'INV-004', name: 'MC4 Connectors (Pair)', category: 'Accessories', stock: 15, unit: 'Pairs', minStock: 40, price: 120 },
  ]);

  const lowStockItems = (inventoryItems as InventoryItem[]).filter((i) => i.stock <= i.minStock);
  const totalItems = (inventoryItems as InventoryItem[]).reduce((sum, i) => sum + i.stock, 0);
  const stockValue = (inventoryItems as InventoryItem[]).reduce((sum, i) => sum + i.stock * i.price, 0);

  const filtered = useMemo(() => (inventoryItems as InventoryItem[]).filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'All Categories' || i.category === categoryFilter;
    return matchSearch && matchCat;
  }), [inventoryItems, searchTerm, categoryFilter]);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.stock || !newItem.price) return;
    const item: InventoryItem = {
      id: `INV-${String(Date.now()).slice(-4)}`,
      name: newItem.name,
      category: newItem.category,
      stock: Number(newItem.stock),
      unit: newItem.unit,
      minStock: Number(newItem.minStock) || 0,
      price: Number(newItem.price),
    };
    setInventoryItems((prev: any[]) => [...prev, item]);
    setNewItem({ name: '', category: 'Panels', stock: '', unit: 'Nos', minStock: '', price: '' });
    setShowAddModal(false);
  };

  const handleAdjustStock = () => {
    const qty = Number(adjustQty);
    if (!manageItem || !qty || qty <= 0) return;
    setInventoryItems((prev: any[]) => prev.map((i) =>
      i.id === manageItem.id
        ? { ...i, stock: Math.max(0, adjustMode === 'add' ? i.stock + qty : i.stock - qty) }
        : i
    ));
    setManageItem(null);
    setAdjustQty('');
  };

  const inputCls = 'admin-input w-full px-3 py-2 rounded-xl text-sm';

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">Inventory</h1>
            <p className="text-xs md:text-sm text-white/40">Track stock levels and material dispatch.</p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-amber text-depth px-4 py-2.5 rounded-xl hover:bg-amber-light transition-colors font-bold shadow-sm text-sm"
            >
              <Plus size={16} />
              Add Stock
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <motion.div variants={itemAnim} className="admin-card p-4 md:p-6 flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-sky-dim text-sky flex items-center justify-center shrink-0">
              <Package size={20} />
            </div>
            <div>
              <p className="text-[10px] md:text-[11px] font-bold text-white/40 uppercase tracking-wider">Total Items</p>
              <p className="text-lg md:text-2xl font-display font-bold text-white">{totalItems.toLocaleString()}</p>
            </div>
          </motion.div>
          <motion.div variants={itemAnim} className="admin-card p-4 md:p-6 flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-[10px] md:text-[11px] font-bold text-white/40 uppercase tracking-wider">Low Stock</p>
              <p className="text-lg md:text-2xl font-display font-bold text-white">{String(lowStockItems.length).padStart(2, '0')}</p>
            </div>
          </motion.div>
          <motion.div variants={itemAnim} className="col-span-2 md:col-span-1 admin-card p-4 md:p-6 flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-dim text-emerald flex items-center justify-center shrink-0">
              <ArrowUpRight size={20} />
            </div>
            <div>
              <p className="text-[10px] md:text-[11px] font-bold text-white/40 uppercase tracking-wider">Stock Value</p>
              <p className="text-lg md:text-2xl font-display font-bold text-white">₹{(stockValue / 100000).toFixed(1)}L</p>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="admin-card p-3 md:p-4 flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input w-full pl-9 pr-4 py-2 rounded-xl text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="admin-input w-full pl-9 pr-8 py-2 rounded-xl appearance-none text-sm"
            >
              <option>All Categories</option>
              <option>Panels</option>
              <option>Inverters</option>
              <option>Cables</option>
              <option>Structures</option>
              <option>Accessories</option>
            </select>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {filtered.map((item) => (
            <motion.div key={item.id} variants={itemAnim} className="admin-card p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-wider">{item.id}</span>
                  <h3 className="font-bold text-white leading-tight">{item.name}</h3>
                </div>
                <span className="text-[10px] font-bold text-white/40 bg-depth px-2 py-0.5 rounded">{item.category}</span>
              </div>
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Stock Level</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${item.stock <= item.minStock ? 'text-red-400' : 'text-emerald'}`}>{item.stock}</span>
                    <span className="text-[10px] text-white/30 font-medium">{item.unit}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-1">Status</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${item.stock <= item.minStock ? 'bg-red-500/10 text-red-400' : 'bg-emerald-dim text-emerald'}`}>
                    {item.stock <= item.minStock ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                <span className="text-xs font-bold text-white/70">₹{item.price.toLocaleString()}</span>
                <button onClick={() => { setManageItem(item); setAdjustQty(''); setAdjustMode('add'); }} className="text-xs font-bold text-amber hover:text-amber-light transition-colors">
                  Manage Stock
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-depth border-b border-white/5">
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">SKU</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Item Name</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Category</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Stock Level</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Unit Price</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Status</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="p-4 font-mono text-xs font-bold text-white/30">{item.id}</td>
                    <td className="p-4 font-bold text-white">{item.name}</td>
                    <td className="p-4 text-xs font-medium text-white/40">{item.category}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${item.stock <= item.minStock ? 'text-red-400' : 'text-emerald'}`}>{item.stock}</span>
                        <span className="text-xs text-white/30">{item.unit}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-white/70">₹{item.price.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${item.stock <= item.minStock ? 'bg-red-500/10 text-red-400' : 'bg-emerald-dim text-emerald'}`}>
                        {item.stock <= item.minStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => { setManageItem(item); setAdjustQty(''); setAdjustMode('add'); }}
                        className="text-amber font-bold hover:text-amber-light transition-colors text-sm"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-white/30 text-sm">No items match your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Add Stock Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="fixed inset-0 bg-sky-deep/40 backdrop-blur-sm z-[300]" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-[301] flex items-center justify-center p-4">
              <div className="admin-card w-full max-w-md p-6 space-y-5">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-display font-bold text-white">Add New Item</h2>
                  <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-depth rounded-full transition-colors text-white/40 hover:text-white"><X size={20} /></button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase mb-1">Item Name *</label>
                    <input value={newItem.name} onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))} className={inputCls} placeholder="e.g. Luminous 375W Panel" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-white/40 uppercase mb-1">Category</label>
                      <select value={newItem.category} onChange={(e) => setNewItem((p) => ({ ...p, category: e.target.value }))} className={inputCls}>
                        <option>Panels</option><option>Inverters</option><option>Cables</option><option>Structures</option><option>Accessories</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/40 uppercase mb-1">Unit</label>
                      <select value={newItem.unit} onChange={(e) => setNewItem((p) => ({ ...p, unit: e.target.value }))} className={inputCls}>
                        <option>Nos</option><option>Mtrs</option><option>Pairs</option><option>Kgs</option><option>Sets</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-white/40 uppercase mb-1">Stock *</label>
                      <input type="number" min="0" value={newItem.stock} onChange={(e) => setNewItem((p) => ({ ...p, stock: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/40 uppercase mb-1">Min Stock</label>
                      <input type="number" min="0" value={newItem.minStock} onChange={(e) => setNewItem((p) => ({ ...p, minStock: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/40 uppercase mb-1">Price (₹) *</label>
                      <input type="number" min="0" value={newItem.price} onChange={(e) => setNewItem((p) => ({ ...p, price: e.target.value }))} className={inputCls} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleAddItem} className="flex-1 bg-amber text-depth py-3 rounded-xl font-bold hover:bg-amber-light transition-colors">Add Item</button>
                  <button onClick={() => setShowAddModal(false)} className="px-5 py-3 bg-depth text-white/40 rounded-xl font-bold hover:text-white transition-colors">Cancel</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Manage Stock Modal */}
      <AnimatePresence>
        {manageItem && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setManageItem(null)} className="fixed inset-0 bg-sky-deep/40 backdrop-blur-sm z-[300]" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-[301] flex items-center justify-center p-4">
              <div className="admin-card w-full max-w-sm p-6 space-y-5">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-display font-bold text-white">Adjust Stock</h2>
                  <button onClick={() => setManageItem(null)} className="p-2 hover:bg-depth rounded-full transition-colors text-white/40 hover:text-white"><X size={20} /></button>
                </div>
                <div className="bg-depth p-4 rounded-xl">
                  <p className="text-xs text-white/30 font-bold uppercase tracking-wider">{manageItem.id}</p>
                  <p className="font-bold text-white">{manageItem.name}</p>
                  <p className="text-sm text-white/40 mt-1">Current stock: <span className="font-bold text-amber">{manageItem.stock} {manageItem.unit}</span></p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setAdjustMode('add')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${adjustMode === 'add' ? 'bg-emerald text-depth' : 'bg-depth text-white/40'}`}>+ Add</button>
                  <button onClick={() => setAdjustMode('subtract')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${adjustMode === 'subtract' ? 'bg-red-500 text-white' : 'bg-depth text-white/40'}`}>− Remove</button>
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase mb-1">Quantity ({manageItem.unit})</label>
                  <input type="number" min="1" value={adjustQty} onChange={(e) => setAdjustQty(e.target.value)} className={inputCls} placeholder="Enter quantity" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleAdjustStock} className="flex-1 bg-amber text-depth py-3 rounded-xl font-bold hover:bg-amber-light transition-colors">Confirm</button>
                  <button onClick={() => setManageItem(null)} className="px-5 py-3 bg-depth text-white/40 rounded-xl font-bold hover:text-white transition-colors">Cancel</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

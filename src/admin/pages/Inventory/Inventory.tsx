import React, { useState } from 'react';
import { Package, Plus, Search, Filter, AlertTriangle, ArrowUpRight, ArrowDownRight, History, MoreVertical } from 'lucide-react';
import { motion } from 'motion/react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemAnim = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const inventoryItems = [
    { id: 'INV-001', name: 'Luminous 540W Mono PERC', category: 'Panels', stock: 124, unit: 'Nos', minStock: 50, price: 14500 },
    { id: 'INV-002', name: 'Tata Solar 5kW Inverter', category: 'Inverters', stock: 8, unit: 'Nos', minStock: 10, price: 42000 },
    { id: 'INV-003', name: 'DC Cable 4sqmm (Red)', category: 'Cables', stock: 450, unit: 'Mtrs', minStock: 200, price: 85 },
    { id: 'INV-004', name: 'MC4 Connectors (Pair)', category: 'Accessories', stock: 15, unit: 'Pairs', minStock: 40, price: 120 },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-sky-deep mb-1">Inventory</h1>
          <p className="text-xs md:text-sm text-gray-500">Track stock levels and material dispatch.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-sky/10 text-sky-deep px-4 py-2.5 rounded-xl hover:bg-sky/5 transition-colors font-bold shadow-sm text-sm">
            <History size={16} />
            Logs
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-sky-deep text-white px-4 py-2.5 rounded-xl hover:bg-sky transition-colors font-bold shadow-sm text-sm">
            <Plus size={16} />
            Add Stock
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <motion.div variants={itemAnim} className="bg-white p-4 md:p-6 rounded-2xl border border-sky/5 shadow-sm flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Package size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-wider">Total Items</p>
            <p className="text-lg md:text-2xl font-display font-bold text-sky-deep">1,240</p>
          </div>
        </motion.div>
        <motion.div variants={itemAnim} className="bg-white p-4 md:p-6 rounded-2xl border border-sky/5 shadow-sm flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-wider">Low Stock</p>
            <p className="text-lg md:text-2xl font-display font-bold text-sky-deep">04</p>
          </div>
        </motion.div>
        <motion.div variants={itemAnim} className="col-span-2 md:col-span-1 bg-white p-4 md:p-6 rounded-2xl border border-sky/5 shadow-sm flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ArrowUpRight size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-wider">Stock Value</p>
            <p className="text-lg md:text-2xl font-display font-bold text-sky-deep">₹18.4L</p>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-sky/5 flex flex-col md:flex-row gap-3 md:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search inventory..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun transition-colors text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select className="w-full pl-9 pr-8 py-2 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun transition-colors appearance-none text-sm">
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
        {inventoryItems.map((item, i) => (
          <motion.div 
            key={item.id} 
            variants={itemAnim}
            className="bg-white p-4 rounded-2xl shadow-sm border border-sky/5 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">{item.id}</span>
                <h3 className="font-bold text-sky-deep leading-tight">{item.name}</h3>
              </div>
              <button className="text-gray-400 p-1">
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Stock Level</p>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${item.stock <= item.minStock ? 'text-red-500' : 'text-sky-deep'}`}>
                    {item.stock}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">{item.unit}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Status</p>
                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                  item.stock <= item.minStock ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {item.stock <= item.minStock ? 'Low Stock' : 'In Stock'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-sky/5 flex justify-between items-center">
              <span className="text-xs font-bold text-sky-deep">₹{item.price.toLocaleString()}</span>
              <button className="text-xs font-bold text-teal hover:text-teal-600 transition-colors">
                Manage Stock
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-sky/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sky-deep/5 border-b border-sky/10">
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">SKU</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Item Name</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Category</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Stock Level</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Unit Price</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Status</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item) => (
                <tr key={item.id} className="border-b border-sky/5 hover:bg-sky/5 transition-colors">
                  <td className="p-4 font-mono text-xs font-bold text-gray-400">{item.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-sky-deep">{item.name}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-medium text-gray-500">{item.category}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${item.stock <= item.minStock ? 'text-red-500' : 'text-sky-deep'}`}>
                        {item.stock}
                      </span>
                      <span className="text-xs text-gray-400">{item.unit}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-sky-deep">₹{item.price.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.stock <= item.minStock ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.stock <= item.minStock ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-sky-deep font-bold hover:text-sun transition-colors text-sm">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

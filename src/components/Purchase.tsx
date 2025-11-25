'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Download, Calendar, Store, DollarSign, Edit2, X, Trash2, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Purchase {
  _id?: string;
  id?: string;
  shopName: string;
  date: string;
  products: Product[];
  totalAmount: number;
  paymentStatus: 'paid' | 'pending';
}

export default function Purchase() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [shopName, setShopName] = useState('');
  const [date, setDate] = useState('');
  const [products, setProducts] = useState<Product[]>([{ id: '1', name: '', quantity: 0, price: 0 }]);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending'>('pending');

  // ✅ Fetch all purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch('/api/purchase');
        if (!res.ok) {
          throw new Error(`Failed to fetch purchases: ${res.status}`);
        }
        const data = await res.json();
        setPurchases(data);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      }
    };
    fetchPurchases();
  }, []);

  const addProduct = () => {
    setProducts([...products, { id: Date.now().toString(), name: '', quantity: 0, price: 0 }]);
  };

  const updateProduct = (id: string, field: keyof Product, value: string | number) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const removeProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const calculateTotal = () => {
    return products.reduce((sum, p) => sum + p.quantity * p.price, 0);
  };

  // ✅ Add or Update Purchase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const purchaseData: Purchase = {
      shopName,
      date,
      products: products.filter((p) => p.name && p.quantity > 0 && p.price > 0),
      totalAmount: calculateTotal(),
      paymentStatus,
    };

    try {
      let res: Response;
      let data: Purchase | { error?: string };

      if (editingId) {
        // 🟢 UPDATE existing purchase
        res = await fetch(`/api/purchase/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(purchaseData),
        });
        data = await res.json();

        if (res.ok) {
          setPurchases((prev) =>
            prev.map((p) => (p._id === editingId ? { ...p, ...(data as Purchase) } : p))
          );
        }
      } else {
        // 🟣 CREATE new purchase
        res = await fetch('/api/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(purchaseData),
        });
        data = await res.json();

        if (res.ok) {
          setPurchases([data as Purchase, ...purchases]);
        }
      }
    } catch (error) {
      console.error('Error saving purchase:', error);
    }

    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setShopName('');
    setDate('');
    setProducts([{ id: Date.now().toString(), name: '', quantity: 0, price: 0 }]);
    setPaymentStatus('pending');
    setShowForm(false);
  };

  const handleEdit = (purchase: Purchase) => {
    const editId = purchase._id || purchase.id;
    if (!editId) return;

    setEditingId(editId);
    setShopName(purchase.shopName);
    setDate(purchase.date);
    setProducts(
      purchase.products.length > 0
        ? purchase.products.map((p) => ({
            ...p,
            id: p.id || Date.now().toString() + Math.random().toString(),
          }))
        : [{ id: Date.now().toString(), name: '', quantity: 0, price: 0 }]
    );
    setPaymentStatus(purchase.paymentStatus);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this bill?')) return;
    try {
      const res = await fetch(`/api/purchase/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPurchases((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error('Error deleting purchase:', error);
    }
  };

  const downloadPurchase = (purchase: Purchase) => {
    const content = `
Purchase Invoice
================
Shop Name: ${purchase.shopName}
Date: ${purchase.date}
Payment Status: ${purchase.paymentStatus.toUpperCase()}

Products:
${purchase.products
  .map(
    (p, i) =>
      `${i + 1}. ${p.name} - Qty: ${p.quantity} x ₹${p.price.toFixed(2)} = ₹${(
        p.quantity * p.price
      ).toFixed(2)}`
  )
  .join('\n')}

Total Amount: ₹${purchase.totalAmount.toFixed(2)}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Purchase_${purchase.shopName}_${purchase.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPaid = purchases.filter(p => p.paymentStatus === 'paid').reduce((sum, p) => sum + p.totalAmount, 0);
  const totalPending = purchases.filter(p => p.paymentStatus === 'pending').reduce((sum, p) => sum + p.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 overflow-x-hidden w-full">
      <div className="max-w-5xl mx-auto w-full">
        
        {/* Compact Header */}
        <div className="mb-3 w-full">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Package className="text-[#5a4fcf]" size={22} />
              Purchase Manager
            </h1>
            <button
              onClick={() => (showForm ? resetForm() : setShowForm(true))}
              className="flex items-center gap-1 bg-[#5a4fcf] text-white px-3 py-1.5 rounded-md hover:bg-[#4a3fb8] transition-all text-sm font-medium shadow-sm"
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? 'Close' : 'Add'}
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white p-2 rounded-md shadow-sm border-l-4 border-[#5a4fcf]">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-semibold">Total</p>
              <p className="text-base font-bold text-gray-800">{purchases.length}</p>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm border-l-4 border-green-500">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-semibold">Paid</p>
              <p className="text-base font-bold text-green-600">₹{totalPaid.toFixed(0)}</p>
            </div>
            {/* Pending Stat (Red) */}
            <div className="bg-white p-2 rounded-md shadow-sm border-l-4 border-red-500">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-semibold">Pending</p>
              <p className="text-base font-bold text-red-600">₹{totalPending.toFixed(0)}</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-3 mb-4 border border-gray-100 w-full animate-in slide-in-from-top-2">
            <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
              <Store size={16} className="text-[#5a4fcf]" />
              {editingId ? 'Edit Bill' : 'New Bill'}
            </h2>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-[#5a4fcf] outline-none"
                  placeholder="Shop Name"
                  required
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-[#5a4fcf] outline-none"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-600">Products</label>
                  <button
                    type="button"
                    onClick={addProduct}
                    className="text-xs text-[#5a4fcf] font-medium flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Item
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {products.map((product, idx) => (
                    <div key={product.id} className="flex gap-2 items-center">
                       <span className="text-[10px] text-gray-400 w-3">{idx + 1}</span>
                       <input
                          type="text"
                          value={product.name}
                          onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                          className="flex-1 min-w-0 px-2 py-1.5 text-xs border border-gray-300 rounded outline-none focus:border-[#5a4fcf]"
                          placeholder="Item"
                          required
                        />
                        <input
                            type="number"
                            value={product.quantity || ''}
                            onChange={(e) => updateProduct(product.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-12 px-2 py-1.5 text-xs border border-gray-300 rounded outline-none focus:border-[#5a4fcf]"
                            placeholder="Qty"
                        />
                        <input
                            type="number"
                            value={product.price || ''}
                            onChange={(e) => updateProduct(product.id, 'price', parseFloat(e.target.value) || 0)}
                            className="w-16 px-2 py-1.5 text-xs border border-gray-300 rounded outline-none focus:border-[#5a4fcf]"
                            placeholder="₹"
                        />
                        <button
                          type="button"
                          onClick={() => removeProduct(product.id)}
                          className="text-red-400 p-1"
                          disabled={products.length <= 1}
                        >
                          <Trash2 size={14} />
                        </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Buttons (Green / Red) */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t mt-2 gap-3">
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                    type="button"
                    onClick={() => setPaymentStatus('paid')}
                    className={`flex-1 sm:flex-none px-4 py-1.5 rounded text-xs font-bold transition-all border shadow-sm ${
                        paymentStatus === 'paid'
                        ? 'bg-green-600 border-green-700 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-green-50'
                    }`}
                    >
                    PAID
                    </button>
                    <button
                    type="button"
                    onClick={() => setPaymentStatus('pending')}
                    className={`flex-1 sm:flex-none px-4 py-1.5 rounded text-xs font-bold transition-all border shadow-sm ${
                        paymentStatus === 'pending'
                        ? 'bg-red-600 border-red-700 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-red-50'
                    }`}
                    >
                    PENDING
                    </button>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end bg-gray-50 p-1.5 rounded">
                    <p className="text-xs text-gray-600">Total:</p>
                    <p className="text-lg font-bold text-[#5a4fcf]">₹{calculateTotal().toFixed(2)}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-[#5a4fcf] hover:bg-[#4a3fb8] text-white py-2.5 rounded-md font-medium text-sm shadow-md mt-1"
              >
                {editingId ? 'Update Bill' : 'Save Bill'}
              </button>
            </div>
          </div>
        )}

        {/* Compact Card List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
          {purchases.map((purchase) => (
            <div
              key={purchase._id || purchase.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 relative hover:shadow-md transition-shadow"
            >
              {/* Card Header & Actions (Top Right) */}
              <div className="flex justify-between items-start mb-2">
                <div className="pr-20 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm truncate leading-tight" title={purchase.shopName}>
                        {purchase.shopName}
                    </h3>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar size={10} /> {purchase.date}
                    </p>
                </div>
                
                {/* Fixed Action Buttons Upside Right */}
                <div className="absolute top-2 right-2 flex gap-1 bg-white pl-1">
                    <button 
                        onClick={() => handleEdit(purchase)} 
                        className="p-1.5 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                        title="Edit"
                    >
                        <Edit2 size={12} />
                    </button>
                    <button 
                        onClick={() => downloadPurchase(purchase)} 
                        className="p-1.5 text-purple-500 bg-purple-50 hover:bg-purple-100 rounded transition-colors"
                        title="Download"
                    >
                        <Download size={12} />
                    </button>
                    <button 
                        onClick={() => handleDelete(purchase._id)} 
                        className="p-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
              </div>

              {/* Condensed Product List */}
              <div className="bg-gray-50 rounded p-2 mb-2 max-h-20 overflow-y-auto text-[11px] space-y-1 scrollbar-thin">
                {purchase.products.map((p, i) => (
                    <div key={i} className="flex justify-between text-gray-600">
                        <span className="truncate flex-1 pr-2">{p.name} <span className="text-gray-400">x{p.quantity}</span></span>
                        <span className="font-medium whitespace-nowrap">₹{(p.quantity * p.price).toFixed(0)}</span>
                    </div>
                ))}
              </div>

              {/* Card Footer: Status & Total */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-100 mt-1">
                {/* Status Badge (Red / Green) */}
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    purchase.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {purchase.paymentStatus}
                </span>

                <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-500">Total:</span>
                    <span className="text-sm font-bold text-gray-800">₹{purchase.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {purchases.length === 0 && !showForm && (
          <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300 mt-4">
            <Package size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-500">No purchases found.</p>
            <button
                onClick={() => setShowForm(true)}
                className="text-[#5a4fcf] text-xs font-bold hover:underline mt-1"
            >
                ADD FIRST BILL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
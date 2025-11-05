'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Download, Calendar, Store, DollarSign, Edit2, X, Trash2 } from 'lucide-react';

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

interface PurchaseResponse extends Purchase {
  error?: string;
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
        } else {
          console.error('Failed to update purchase:', (data as { error?: string }).error);
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
        } else {
          console.error('Failed to create purchase:', (data as { error?: string }).error);
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

  // 🟣 Handle Edit (Fixed)
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

  // 🗑️ Delete Purchase
  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this bill?')) return;
    try {
      const res = await fetch(`/api/purchase/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPurchases((prev) => prev.filter((p) => p._id !== id));
      } else {
        const errorData = await res.json();
        console.error('Failed to delete purchase:', errorData.error);
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

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div></div>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="flex items-center gap-1 bg-[#5a4fcf] text-white px-3 py-2 rounded-lg hover:bg-[#4e45b6] transition-all shadow-md active:scale-95 text-sm"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          <span>{showForm ? 'Close' : 'New Purchase'}</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-3 mb-4 border border-gray-100">
          <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Store size={18} className="text-[#5a4fcf]" />
            {editingId ? 'Edit Purchase' : 'Add New Purchase'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a4fcf] outline-none"
                placeholder="Shop Name"
                required
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a4fcf] outline-none"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-700">Products</label>
                <button
                  type="button"
                  onClick={addProduct}
                  className="text-xs text-[#5a4fcf] hover:text-[#4e45b6] font-medium flex items-center gap-1"
                >
                  <Plus size={14} /> Add Item
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {products.map((product) => (
                  <div key={product.id} className="p-2 bg-gray-50 rounded-lg grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#5a4fcf] outline-none"
                      placeholder="Product name"
                      required
                    />
                    <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
                      <input
                        type="number"
                        value={product.quantity || ''}
                        onChange={(e) =>
                          updateProduct(product.id, 'quantity', parseInt(e.target.value) || 0)
                        }
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#5a4fcf] outline-none"
                        placeholder="Qty"
                        min="1"
                        required
                      />
                      <input
                        type="number"
                        value={product.price || ''}
                        onChange={(e) =>
                          updateProduct(product.id, 'price', parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#5a4fcf] outline-none"
                        placeholder="Price"
                        min="0"
                        step="0.01"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeProduct(product.id)}
                        className="text-red-500 hover:bg-red-50 rounded-md px-2 disabled:opacity-50"
                        disabled={products.length <= 1}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentStatus('paid')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    paymentStatus === 'paid' ? 'bg-green-500 text-white shadow' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Paid
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentStatus('pending')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    paymentStatus === 'pending' ? 'bg-orange-500 text-white shadow' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Pending
                </button>
              </div>
              <div className="bg-[#eef0ff] p-2 rounded-lg border border-[#dadaff]">
                <p className="text-xs text-gray-600">Total Amount</p>
                <p className="text-lg font-bold text-center text-[#5a4fcf]">₹{calculateTotal().toFixed(2)}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button
                type="submit"
                className="flex-1 bg-[#5a4fcf] text-white py-2 rounded-lg hover:bg-[#4e45b6] transition-all shadow-md font-medium text-sm"
              >
                {editingId ? 'Update Purchase' : 'Save Purchase'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Purchase List */}
      <div className="space-y-2.5">
        {purchases.map((purchase) => (
          <div
            key={purchase._id || purchase.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
          >
            <div className="p-2.5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-base truncate flex items-center gap-1.5">
                    <Store size={15} className="text-[#5a4fcf]" />
                    {purchase.shopName}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                    <Calendar size={12} /> {purchase.date}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* ✏️ Edit */}
                  <button
                    onClick={() => handleEdit(purchase)}
                    className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>

                  {/* 🗑️ Delete */}
                  <button
                    onClick={() => handleDelete(purchase._id)}
                    className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>

                  {/* 📄 Download */}
                  <button
                    onClick={() => downloadPurchase(purchase)}
                    className="p-1.5 bg-[#eef0ff] text-[#5a4fcf] rounded-md hover:bg-[#dadaff]"
                    title="Download"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 mb-2.5">
                {purchase.products.map((product, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-1.5 bg-gray-50 rounded-md"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-medium text-gray-800 text-sm truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">
                        {product.quantity} × ₹{product.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold text-[#5a4fcf] text-sm flex-shrink-0">
                      ₹{(product.quantity * product.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-[#5a4fcf]" />
                  <span className="font-semibold text-gray-800 text-sm">Total</span>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 mb-1 rounded-full text-xs font-medium ${
                      purchase.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {purchase.paymentStatus.charAt(0).toUpperCase() +
                      purchase.paymentStatus.slice(1)}
                  </span>
                  <p className="text-lg font-bold text-[#5a4fcf]">
                    ₹{purchase.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

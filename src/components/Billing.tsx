// 'use client';

// import React from 'react';
// import { useSession } from 'next-auth/react';
// import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
// import QRCode from 'react-qr-code';
// import {
//   Scan, Trash2, Edit2, Check, X, AlertTriangle,
//   CreditCard, CheckCircle, DollarSign, MessageSquare, 
//   Nfc
// } from 'lucide-react';

// // --- HELPER FUNCTIONS ---
// const formatCurrency = (amount: number): string => {
//   return new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR"
//   }).format(amount);
// };

// const calculateGstDetails = (sellingPrice: number, gstRate: number) => {
//   const price = Number(sellingPrice) || 0;
//   const rate = Number(gstRate) || 0;
//   const gstAmount = (price * rate) / 100;
//   const totalPrice = price + gstAmount;
//   return { gstAmount, totalPrice };
// };

// // --- TYPE DEFINITIONS ---
// type CartItem = {
//   id: number;
//   productId?: string;
//   name: string;
//   quantity: number;
//   price: number;
//   gstRate: number;
//   isEditing?: boolean;
// };

// type InventoryProduct = {
//   id: string;
//   name: string;
//   quantity: number;
//   sellingPrice: number;
//   gstRate: number;
//   image?: string;
//   sku?: string;
// };

// // --- MODAL COMPONENT ---
// type ModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
//   children: React.ReactNode;
//   onConfirm?: () => void;
//   confirmText?: string;
//   showCancel?: boolean;
// };

// const Modal = ({ isOpen, onClose, title, children, onConfirm, confirmText = 'OK', showCancel = false }: ModalProps) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
//       <div className="relative w-[90%] max-w-md rounded-2xl bg-white p-5 shadow-2xl border border-gray-200">
//         <div className="flex items-start">
//           <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-[#5a4fcf]/10">
//             <AlertTriangle className="h-5 w-5 text-[#5a4fcf]" />
//           </div>
//           <div className="ml-3 text-left">
//             <h3 className="text-base font-semibold text-gray-900">{title}</h3>
//             <div className="mt-1.5 text-gray-600 text-sm">{children}</div>
//           </div>
//         </div>
//         <div className="mt-4 flex justify-end gap-2">
//           {showCancel && <button onClick={onClose} className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:bg-gray-300">Cancel</button>}
//           <button onClick={() => { if (onConfirm) onConfirm(); onClose(); }} className="rounded-lg bg-[#5a4fcf] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#4c42b8]">{confirmText}</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- MAIN BILLING COMPONENT ---
// export default function BillingPage() {
//   const { data: session, status } = useSession();
//   const [cart, setCart] = React.useState<CartItem[]>([]);
//   const [productName, setProductName] = React.useState('');
//   const [scanning, setScanning] = React.useState(true);
//   const [inventory, setInventory] = React.useState<InventoryProduct[]>([]);
//   const [suggestions, setSuggestions] = React.useState<InventoryProduct[]>([]);
//   const [showSuggestions, setShowSuggestions] = React.useState(false);
  
//   // States for flow
//   const [showWhatsAppSharePanel, setShowWhatsAppSharePanel] = React.useState(false);
//   const [showPaymentOptions, setShowPaymentOptions] = React.useState(false);
//   const [selectedPayment, setSelectedPayment] = React.useState<string>('');
  
//   // Data states
//   const [merchantUpi, setMerchantUpi] = React.useState('');
//   const [merchantName, setMerchantName] = React.useState('Billzzy Lite');
//   const [whatsAppNumber, setWhatsAppNumber] = React.useState('');
//   const [customerName, setCustomerName] = React.useState('');
//   const [amountGiven, setAmountGiven] = React.useState<number | ''>('');
//   const [isMessaging, setIsMessaging] = React.useState(false);
//   const [scannerError, setScannerError] = React.useState<string>('');
//   const [modal, setModal] = React.useState<{ isOpen: boolean; title: string; message: string | React.ReactNode; onConfirm?: (() => void); confirmText: string; showCancel: boolean; }>({ isOpen: false, title: '', message: '', confirmText: 'OK', showCancel: false });
//   const suggestionsRef = React.useRef<HTMLDivElement | null>(null);
  
//   const [settingsComplete, setSettingsComplete] = React.useState(false);
//   const [discountInput, setDiscountInput] = React.useState<string>('');
//   const [discountType, setDiscountType] = React.useState<'percentage' | 'fixed'>('percentage');
  
//   // NFC Loading State
//   const [isCreatingLink, setIsCreatingLink] = React.useState(false);

//   const subtotal = React.useMemo(() =>
//     cart.reduce((sum, item) => {
//       const { totalPrice } = calculateGstDetails(item.price, item.gstRate);
//       return sum + totalPrice * item.quantity;
//     }, 0),
//     [cart]
//   );

//   const { discountAmount, totalAmount } = React.useMemo(() => {
//     const discountValue = parseFloat(discountInput) || 0;
//     let calculatedDiscount = 0;
//     if (discountType === 'percentage' && discountValue > 0) {
//       calculatedDiscount = (subtotal * discountValue) / 100;
//     } else if (discountType === 'fixed' && discountValue > 0) {
//       calculatedDiscount = Math.min(discountValue, subtotal);
//     }
//     const finalTotal = Math.max(0, subtotal - calculatedDiscount);
//     return { discountAmount: calculatedDiscount, totalAmount: finalTotal };
//   }, [subtotal, discountInput, discountType]);

//   const balance = React.useMemo(() => {
//     const total = totalAmount;
//     const given = Number(amountGiven);
//     return given > 0 ? given - total : 0;
//   }, [totalAmount, amountGiven]);

//   const upiQR = merchantUpi ? `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount.toFixed(2)}&cu=INR&tn=Bill%20Payment` : '';

//   // Check Phone Number
//   const checkPhoneNumber = React.useCallback(() => {
//     if (status === 'authenticated' && session?.user?.email) {
//       const savedData = localStorage.getItem(`userSettings-${session.user.email}`);
//       if (savedData) {
//         try {
//           const parsedData = JSON.parse(savedData);
//           const phoneNumber = parsedData.phoneNumber || '';
//           if (phoneNumber && phoneNumber.trim() !== '' && /^\d{10,15}$/.test(phoneNumber)) {
//             setSettingsComplete(true);
//             setMerchantUpi(parsedData.merchantUpiId || '');
//             setMerchantName(parsedData.shopName || 'Billzzy Lite');
//             return true;
//           }
//         } catch (error) {
//           console.error('Error parsing settings data:', error);
//         }
//       }
//       setSettingsComplete(false);
//       return false;
//     }
//     return false;
//   }, [status, session]);

//   React.useEffect(() => { checkPhoneNumber(); }, [checkPhoneNumber]);

//   // Inventory Fetch
//   React.useEffect(() => {
//     if (status !== 'authenticated') return;
//     (async () => {
//       try {
//         const res = await fetch('/api/products');
//         if (!res.ok) { setInventory([]); return; }
//         const data: InventoryProduct[] = await res.json();
//         const productsWithGst = data.map(p => ({ ...p, gstRate: p.gstRate || 0 }));
//         setInventory(productsWithGst);
//       } catch (err) { setInventory([]); }
//     })();
//   }, [status]);

//   // Suggestions
//   React.useEffect(() => {
//     if (!productName.trim()) { setShowSuggestions(false); return; }
//     const query = productName.trim().toLowerCase();
//     const filtered = inventory.filter(p => p.name.toLowerCase().includes(query) || p.sku?.toLowerCase().includes(query)).slice(0, 5);
//     setSuggestions(filtered);
//     setShowSuggestions(filtered.length > 0);
//   }, [productName, inventory]);

//   React.useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
//         setShowSuggestions(false);
//       }
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   // --- WHATSAPP LOGIC ---
//   const sendWhatsAppMessage = async (phoneNumber: string, messageType: string) => {
//     if (!phoneNumber.trim() || !/^\d{10,15}$/.test(phoneNumber)) {
//       return false;
//     }
//     try {
//       const formattedPhone = phoneNumber.startsWith('91') ? phoneNumber : `91${phoneNumber}`;
//       const orderId = `INV-${Date.now().toString().slice(-6)}`;
//       const itemsList = cart.map((item) => `${item.name} (x${item.quantity})`).join(', ');

//       let templateName = '';
//       let bodyParameters: string[] = [];

//       switch (messageType) {
//         case 'cashPayment': templateName = 'payment_receipt_cashh'; break;
//         case 'qrPayment': templateName = 'payment_receipt_upii'; break;
//         case 'cardPayment': templateName = 'payment_receipt_card'; break;
//         default: throw new Error(`Invalid message type: ${messageType}`);
//       }

//       bodyParameters = [
//         orderId, 
//         merchantName, 
//         `₹${subtotal.toFixed(2)}`, 
//         itemsList, 
//         discountAmount > 0 ? `₹${discountAmount.toFixed(2)}` : '₹0.00',
//       ];

//       const messageData = {
//         messaging_product: 'whatsapp',
//         recipient_type: 'individual',
//         to: formattedPhone,
//         type: 'template',
//         template: {
//           name: templateName,
//           language: { code: 'en' },
//           components: [{ type: 'body', parameters: bodyParameters.map((text) => ({ type: 'text', text })) }],
//         },
//       };

//       const response = await fetch('/api/whatsapp/send', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(messageData),
//       });

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message || 'Failed to send message');
//       if (!result.success) throw new Error(result.message || 'WhatsApp API returned success: false');

//       return true;
//     } catch (error) {
//       console.error('WhatsApp API error:', error);
//       return false;
//     }
//   };

//   const sendWhatsAppReceipt = React.useCallback(async (paymentMethod: string) => {
//     let templateType = '';
//     switch (paymentMethod) { 
//       case 'cash': templateType = 'cashPayment'; break; 
//       case 'qr-code': templateType = 'qrPayment'; break; 
//       default: templateType = 'cashPayment'; 
//     }
//     return await sendWhatsAppMessage(whatsAppNumber, templateType);
//   }, [whatsAppNumber, cart, subtotal, discountAmount, merchantName]);

//   // --- CART ACTIONS ---
//   const addToCart = React.useCallback((name: string, price: number, gstRate: number, productId?: string, isEditing = false) => {
//     if (!name || price < 0) return;
//     setCart(prev => {
//       const existingItem = productId ? prev.find(item => item.productId === productId) : null;
//       if (existingItem) {
//         return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
//       }
//       return [{ id: Date.now(), productId, name, quantity: 1, price, gstRate, isEditing }, ...prev];
//     });
//     setProductName('');
//     setShowSuggestions(false);
//   }, []);

//   const handleScan = React.useCallback((results: IDetectedBarcode[]) => {
//     if (results && results[0]) {
//       const scannedValue = results[0].rawValue;
//       const foundProduct = inventory.find(p => p.id === scannedValue || p.sku?.toLowerCase() === scannedValue.toLowerCase() || p.name.toLowerCase() === scannedValue.toLowerCase());
//       if (foundProduct) {
//         addToCart(foundProduct.name, foundProduct.sellingPrice, foundProduct.gstRate, foundProduct.id);
//         setScanning(false);
//       } else {
//         addToCart(scannedValue, 0, 0, undefined, true);
//         setScanning(false);
//       }
//     }
//   }, [inventory, addToCart]);

//   const handleScanError = React.useCallback((error: unknown) => {
//     setScannerError(error instanceof Error ? error.message : 'Unknown scanner error');
//   }, []);

//   const handleManualAdd = React.useCallback(() => {
//     const name = productName.trim();
//     if (!name) { 
//       setModal({ isOpen: true, title: 'Item Name Required', message: 'Please enter a name for the custom item.', showCancel: false, confirmText: 'OK' }); 
//       return; 
//     }
//     addToCart(name, 0, 0, undefined, true);
//   }, [productName, addToCart]);

//   const deleteCartItem = (id: number) => setCart(prev => prev.filter(item => item.id !== id));
//   const toggleEdit = (id: number) => setCart(prev => prev.map(item => item.id === id ? { ...item, isEditing: !item.isEditing } : { ...item, isEditing: false }));
//   const updateCartItem = (id: number, updatedValues: Partial<CartItem>) => setCart(prev => prev.map(item => item.id === id ? { ...item, ...updatedValues } : item));

//   const handleTransactionDone = React.useCallback(() => {
//     setCart([]); 
//     setSelectedPayment(''); 
//     setShowWhatsAppSharePanel(false); 
//     setShowPaymentOptions(false); 
//     setWhatsAppNumber(''); 
//     setAmountGiven(''); 
//     setDiscountInput(''); 
//     setModal({ ...modal, isOpen: false });
//   }, [modal]);

//   const handleProceedToPayment = React.useCallback(async () => {
//     if (cart.length === 0) {
//       setModal({ isOpen: true, title: 'Cart Empty', message: 'Please add items to the cart before finalizing.', confirmText: 'OK', showCancel: false });
//       return;
//     }
//     setShowWhatsAppSharePanel(false);
//     setShowPaymentOptions(true);
//   }, [cart.length]);

//   // --- FINAL PAYMENT HANDLER (Unified) ---
//   const handlePaymentSuccess = React.useCallback(async (useNfc: boolean = false) => {
//     setIsMessaging(true); // Start Spinner
//     if (useNfc) setIsCreatingLink(true); // Start NFC Spinner

//     try {
//       // 1. If using NFC, generate the link FIRST
//       let nfcToken = '';
//       if (useNfc) {
//         const nfcRes = await fetch('/api/nfc-link', {
//            method: 'POST',
//            headers: { 'Content-Type': 'application/json' },
//            body: JSON.stringify({ cart, totalAmount }),
//         });
//         const nfcData = await nfcRes.json();
//         if (nfcData.success && nfcData.orderId) {
//             nfcToken = nfcData.orderId;
//         }
//       }

//       // 2. Update Inventory
//       const updatePromises = cart.filter(item => item.productId).map(item => 
//         fetch(`/api/products/${item.productId}`, { 
//           method: 'PUT', 
//           headers: { 'Content-Type': 'application/json' }, 
//           body: JSON.stringify({ quantityToDecrement: item.quantity }) 
//         })
//       );
//       await Promise.all(updatePromises).catch(err => console.error("Inventory update failed:", err));
    
//       // 3. Save Sale DB
//       const response = await fetch('/api/sales', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ amount: totalAmount, paymentMethod: selectedPayment })
//       });
      
//       if (!response.ok) throw new Error('Failed to save sale');

//       // 4. Save Customer DB
//       if (customerName.trim() && whatsAppNumber.trim()) {
//         fetch('/api/customers', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ name: customerName.trim(), phoneNumber: whatsAppNumber.trim() })
//         }).catch(err => console.error("Customer save error", err));
//       }
    
//       // 5. Send WhatsApp (ONLY IF NOT USING NFC)
//       let receiptSent = false;
//       if (!useNfc && whatsAppNumber && whatsAppNumber.trim()) {
//         receiptSent = await sendWhatsAppReceipt(selectedPayment);
//       }

//       // 6. Launch NFC if requested (No WhatsApp sent)
//       if (useNfc && nfcToken) {
//           const packageName = "com.billzzylite.bridge";
//           const bridgeUrl = `intent://nfc/${nfcToken}#Intent;scheme=billzzylite;package=${packageName};end`;
//           window.location.href = bridgeUrl;
//       }
    
//       // 7. Show Success Modal
//       setModal({
//         isOpen: true,
//         title: 'Success!',
//         message: receiptSent 
//           ? 'Transaction completed! Receipt sent to customer via WhatsApp.' 
//           : 'Transaction completed. Ready for a new bill.',
//         confirmText: 'New Bill',
//         onConfirm: handleTransactionDone,
//         showCancel: false
//       });

//     } catch (error) {
//       console.error("Payment Process Error:", error);
//       setModal({ 
//           isOpen: true, 
//           title: 'Error', 
//           message: 'An error occurred while saving the transaction.', 
//           confirmText: 'OK', 
//           showCancel: false 
//       });
//     } finally {
//       setIsMessaging(false);
//       setIsCreatingLink(false);
//     }
//   }, [selectedPayment, totalAmount, cart, handleTransactionDone, whatsAppNumber, sendWhatsAppReceipt, customerName]);

//   const toggleScanner = React.useCallback(() => {
//     setScanning(prev => { if (!prev) { setScannerError(''); } return !prev; });
//   }, []);

//   return (
//     <>
//       <div className="h-full flex flex-col bg-gray-50">
//         {!settingsComplete && (
//           <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
//             <div className="w-[90%] max-w-md rounded-2xl bg-white p-5 shadow-2xl border border-gray-200">
//               <div className="flex items-start">
//                 <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-[#5a4fcf]/10"><AlertTriangle className="h-5 w-5 text-[#5a4fcf]" /></div>
//                 <div className="ml-3 text-left"><h3 className="text-base font-semibold text-gray-900">Settings Incomplete</h3><div className="mt-1.5 text-gray-600 text-sm"><p>Please fill in your phone number in the settings to proceed with billing.</p></div></div>
//               </div>
//               <div className="mt-4 flex justify-end"><button onClick={() => { window.location.assign('/settings'); }} className="rounded-lg bg-[#5a4fcf] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#4c42b8]">Go to Settings</button></div>
//             </div>
//           </div>
//         )}
        
//         <div className="flex-1 min-h-0 overflow-y-auto">
//           <div className="p-2 space-y-2">
            
//             {scanning && settingsComplete && (
//               <div className="bg-white rounded-xl p-3 shadow-md border border-indigo-100">
//                 <div className="max-w-sm mx-auto"><Scanner constraints={{ facingMode: 'environment' }} onScan={handleScan} onError={handleScanError} scanDelay={300} styles={{ container: { width: '100%', height: 180, borderRadius: '12px', overflow: 'hidden' } }} /></div>
//                 {scannerError && <p className="text-center text-xs text-red-500 mt-2">{scannerError}</p>}
//                 <button onClick={toggleScanner} className="w-full mt-3 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-semibold hover:bg-red-100"><X size={16} /> Close Scanner</button>
//               </div>
//             )}

//             <div className="bg-white rounded-xl p-3 shadow-md border border-gray-200">
//               <div className="flex gap-2">
//                 <div ref={suggestionsRef} className="relative flex-1">
//                   <input type="text" placeholder={settingsComplete ? "Search or add item..." : "Settings required to add items"} className="w-full rounded-lg border-2 border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] outline-none transition-all" value={productName} onChange={(e) => setProductName(e.target.value)} onClick={() => setScanning(false)} onKeyPress={(e) => { if (e.key === 'Enter') { handleManualAdd(); } }} disabled={!settingsComplete} />
//                   {showSuggestions && settingsComplete && (
//                     <div className="absolute z-10 mt-2 w-full rounded-xl border-2 border-[#5a4fcf] bg-white shadow-xl max-h-48 overflow-y-auto">{suggestions.map((s) => (<div key={s.id} onClick={() => addToCart(s.name, s.sellingPrice, s.gstRate, s.id)} className="cursor-pointer border-b border-gray-100 p-3 hover:bg-indigo-50 transition-colors last:border-b-0"><div className="flex justify-between items-center"><span className="font-semibold text-gray-800 text-sm">{s.name}</span><span className="text-[#5a4fcf] font-bold text-sm">{formatCurrency(s.sellingPrice)}</span></div>{s.sku && <p className="text-xs text-gray-500 mt-0.5">SKU: {s.sku}</p>}</div>))}</div>
//                   )}
//                 </div>
//               </div>
//               {!scanning && settingsComplete && (<button onClick={toggleScanner} className="w-full mt-2 flex items-center justify-center gap-2 bg-indigo-50 text-[#5a4fcf] py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors"><Scan size={16} /> Scan Barcode</button>)}
//             </div>

//             {cart.length === 0 ? (
//               <div className="bg-white rounded-xl p-8 text-center shadow-md border border-gray-200"><div className="text-5xl mb-3">🛒</div><p className="text-gray-600 font-medium">{settingsComplete ? "Cart is Empty" : "Settings Required"}</p><p className="text-xs text-gray-500 mt-1">{settingsComplete ? "Add items to get started" : "Please complete your settings to start billing"}</p></div>
//             ) : (
//               <div className="space-y-2">{cart.map((item) => { const { gstAmount, totalPrice } = calculateGstDetails(item.price, item.gstRate); const totalItemPrice = totalPrice * item.quantity; return (<div key={item.id} className="bg-white rounded-xl p-3 shadow-md border border-gray-200"><div className="flex justify-between items-start gap-2"><div className="flex-1 min-w-0">{item.isEditing ? (<div className="space-y-2"><input type="text" value={item.name} onChange={(e) => updateCartItem(item.id, { name: e.target.value })} className="w-full border-2 border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#5a4fcf] outline-none" placeholder="Item name" disabled={!settingsComplete} /><div className="grid grid-cols-2 gap-2"><input type="number" value={item.quantity} onChange={(e) => updateCartItem(item.id, { quantity: parseInt(e.target.value, 10) || 1 })} className="border-2 border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#5a4fcf] outline-none" placeholder="Qty" disabled={!settingsComplete} /><input type="number" value={item.price} onChange={(e) => updateCartItem(item.id, { price: parseFloat(e.target.value) || 0 })} className="border-2 border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#5a4fcf] outline-none" placeholder="Price" disabled={!settingsComplete} /></div></div>) : (<><p className="font-bold text-gray-900 text-sm truncate">{item.name}</p><p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × {formatCurrency(totalPrice)}</p></>)}</div><div className="flex gap-2 items-start flex-shrink-0"><span className="text-base font-bold text-[#5a4fcf]">{formatCurrency(totalItemPrice)}</span><button onClick={() => toggleEdit(item.id)} className={`p-1.5 rounded-lg ${item.isEditing ? 'bg-green-100 text-green-600' : 'bg-indigo-50 text-[#5a4fcf]'} hover:opacity-80`} disabled={!settingsComplete}>{item.isEditing ? <Check size={16} /> : <Edit2 size={16} />}</button><button onClick={() => deleteCartItem(item.id)} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100" disabled={!settingsComplete}><Trash2 size={16} /></button></div></div>{!item.isEditing && item.gstRate > 0 && (<div className="text-xs text-gray-600 bg-indigo-50 rounded-lg p-2 mt-2 border border-indigo-100">Base: {formatCurrency(item.price)} + GST ({item.gstRate}%): {formatCurrency(gstAmount)}</div>)}</div>); })}</div>
//             )}
//           </div>
//         </div>
        
//         <div className="flex-shrink-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] border-t-2 border-gray-200">
//           <div className="p-2.5 space-y-2 max-h-[45vh] overflow-y-auto">
            
//             <div className="space-y-2"><div className="relative"><input type="number" placeholder="Discount" value={discountInput} onChange={(e) => setDiscountInput(e.target.value)} className="w-full rounded-lg border-2 border-gray-300 p-2 text-sm focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] outline-none transition-all pr-12" disabled={cart.length === 0 || !settingsComplete} /><div className="absolute inset-y-0 right-0 flex items-center"><button onClick={() => setDiscountType(discountType === 'percentage' ? 'fixed' : 'percentage')} className="h-full rounded-r-lg px-3 text-sm font-bold text-white bg-[#5a4fcf] hover:bg-[#4c42b8] transition-colors" disabled={cart.length === 0 || !settingsComplete}>{discountType === 'percentage' ? '%' : '₹'}</button></div></div><div className="space-y-1 text-sm rounded-lg bg-gray-50 p-2 border"><div className="flex justify-between items-center text-gray-600"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>{discountAmount > 0 && (<div className="flex justify-between items-center text-green-600"><span>Discount</span><span>- {formatCurrency(discountAmount)}</span></div>)}<div className="flex justify-between items-center text-gray-900 font-bold border-t pt-1 mt-1"><span className="text-base">Total</span><span className="text-xl">{formatCurrency(totalAmount)}</span></div></div></div>

//             {!showWhatsAppSharePanel && !showPaymentOptions && (
//               <button onClick={() => { if (cart.length === 0) { setModal({ isOpen: true, title: 'Cart Empty', message: 'Please add items to the cart before finalizing.', confirmText: 'OK', showCancel: false }); return; } setShowWhatsAppSharePanel(true); setShowPaymentOptions(false); }} className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#5a4fcf] py-2.5 font-bold text-white hover:bg-[#4c42b8] disabled:bg-gray-400 transition-colors shadow-lg text-sm" disabled={cart.length === 0 || !settingsComplete}><CreditCard size={16} /><span>Proceed to Payment</span></button>
//             )}

//             {/* --- CUSTOMER PANEL --- */}
//             {showWhatsAppSharePanel && cart.length > 0 && settingsComplete && (
//               <div className="space-y-2 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-2.5 border-2 border-green-200">
//                 <p className="text-xs font-semibold text-gray-700 text-center">Customer Details & Sharing</p>
//                 <div className="grid grid-cols-2 gap-2">
//                   <div className="col-span-1"><input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer Name (Optional)" className="w-full rounded-lg border-2 border-green-300 p-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200" /></div>
//                   <div className="col-span-1"><input type="tel" value={whatsAppNumber} onChange={(e) => setWhatsAppNumber(e.target.value)} placeholder="91XXXXXXXXXX" className="w-full rounded-lg border-2 border-green-300 p-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200" /></div>
//                 </div>
//                 <button onClick={handleProceedToPayment} disabled={isMessaging} className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 py-2 font-semibold text-white hover:bg-green-700 disabled:bg-gray-400 transition-colors shadow-md text-sm">
//                   {isMessaging ? (
//                     <div className="flex items-center gap-2"><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div><span className="text-xs">Processing...</span></div>
//                   ) : (
//                     <><MessageSquare size={14} /><span className="text-xs">{whatsAppNumber.trim() ? 'Next: Payment' : 'Skip & Continue'}</span></>
//                   )}
//                 </button>
//               </div>
//             )}

//             {showPaymentOptions && cart.length > 0 && settingsComplete && (
//               <div className="space-y-2">
//                 <p className="text-xs font-semibold text-gray-700 text-center">Select Payment Method</p>
//                 <div className="grid grid-cols-2 gap-1.5">{[{ method: 'cash', label: 'Cash', color: 'green' }, { method: 'qr-code', label: 'QR/UPI', color: 'blue' }].map(({ method, label }) => (<button key={method} onClick={() => setSelectedPayment(method)} className={`rounded-lg px-2 py-2 text-xs font-bold capitalize transition-all ${selectedPayment === method ? 'bg-[#5a4fcf] text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{label}</button>))}</div>

//                 {selectedPayment === 'cash' && (
//                   <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-2.5 border-2 border-green-200">
//                     <p className="text-xs text-center font-medium text-gray-700 mb-2">Cash Payment</p>
//                     <div className="grid grid-cols-2 gap-2 mb-2"><input type="number" placeholder="Amount Given" value={amountGiven} onChange={(e) => setAmountGiven(e.target.value === '' ? '' : parseFloat(e.target.value))} className="rounded-lg border-2 border-green-300 p-1.5 text-sm focus:ring-2 focus:ring-green-500 outline-none" /><div className="rounded-lg bg-white border-2 border-green-300 p-1.5 flex flex-col items-center justify-center"><span className="text-xs text-gray-500">Balance</span><span className={`font-bold text-sm ${balance < 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(balance)}</span></div></div>
//                     <div className="flex gap-2">
//                         {/* NFC Button - SAVES + LAUNCHES NFC (NO WHATSAPP) */}
//                         <button onClick={() => handlePaymentSuccess(true)} disabled={isCreatingLink || isMessaging} className="flex-1 rounded-lg bg-indigo-600 py-2 font-bold text-white hover:bg-indigo-700 flex items-center justify-center shadow-md">
//                             {isCreatingLink ? (<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>) : (<div className="flex items-center gap-1"><Nfc size={18}/><span className="text-[10px]">Tap</span></div>)}
//                         </button>
//                         {/* Complete Button - SAVES + WHATSAPP */}
//                         <button onClick={() => handlePaymentSuccess(false)} disabled={isMessaging || isCreatingLink} className="flex-[3] flex items-center justify-center gap-2 rounded-lg bg-green-600 py-2 font-bold text-white disabled:bg-gray-400 hover:bg-green-700 transition-colors shadow-md text-xs">
//                             {isMessaging ? (<div className="flex items-center gap-2"><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div><span>Processing...</span></div>) : (<><DollarSign size={16} /><span>Confirm Cash Payment</span></>)}
//                         </button>
//                     </div>
//                   </div>
//                 )}

//                 {selectedPayment === 'qr-code' && (
//                   <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-2.5 border-2 border-blue-200">
//                     {upiQR ? (<><p className="text-xs text-center font-medium text-gray-700 mb-2">Scan QR to Pay</p><div className="bg-white p-2 rounded-lg mx-auto max-w-[140px] border-2 border-blue-300"><QRCode value={upiQR} style={{ height: 'auto', width: '100%' }} /></div><p className="mt-1.5 text-xs text-center text-gray-600">Pay to: <span className="font-semibold">{merchantUpi}</span></p>
//                     <div className="flex gap-2 mt-2">
//                         {/* NFC Button - SAVES + LAUNCHES NFC (NO WHATSAPP) */}
//                         <button onClick={() => handlePaymentSuccess(true)} disabled={isCreatingLink || isMessaging} className="flex-1 rounded-lg bg-indigo-600 py-2 font-bold text-white hover:bg-indigo-700 flex items-center justify-center shadow-md">
//                             {isCreatingLink ? (<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>) : (<div className="flex items-center gap-1"><Nfc size={18}/><span className="text-[10px]">Tap</span></div>)}
//                         </button>
//                         {/* Complete Button - SAVES + WHATSAPP */}
//                         <button onClick={() => handlePaymentSuccess(false)} disabled={isMessaging || isCreatingLink} className="flex-[3] flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 font-bold text-white disabled:bg-gray-400 hover:bg-blue-700 transition-colors shadow-md text-xs">
//                             {isMessaging ? (<div className="flex items-center gap-2"><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div><span>Processing...</span></div>) : (<><CheckCircle size={16} /><span>Confirm Payment Received</span></>)}
//                         </button>
//                     </div>
//                     </>) : (<p className="text-center text-xs font-semibold text-red-600 py-4">UPI ID not configured. Please update settings.</p>)}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <Modal isOpen={modal.isOpen} onClose={() => setModal({ ...modal, isOpen: false, message: '' })} title={modal.title} onConfirm={modal.onConfirm} confirmText={modal.confirmText} showCancel={modal.showCancel}>{modal.message}</Modal>
//     </>
//   );
// }


  'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import QRCode from 'react-qr-code';
import {
  Scan, Trash2, Edit2, Check, X, AlertTriangle,
  CreditCard, CheckCircle, DollarSign, MessageSquare, 
  Nfc
} from 'lucide-react';

// --- HELPER FUNCTIONS ---
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);
};

const calculateGstDetails = (sellingPrice: number, gstRate: number) => {
  const price = Number(sellingPrice) || 0;
  const rate = Number(gstRate) || 0;
  const gstAmount = (price * rate) / 100;
  const totalPrice = price + gstAmount;
  return { gstAmount, totalPrice };
};

const generateClientId = () => {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// --- TYPE DEFINITIONS ---
type CartItem = {
  id: number;
  productId?: string;
  name: string;
  quantity: number;
  price: number;
  gstRate: number;
  isEditing?: boolean;
};

type InventoryProduct = {
  id: string;
  name: string;
  quantity: number;
  sellingPrice: number;
  gstRate: number;
  image?: string;
  sku?: string;
};

// --- MODAL COMPONENT ---
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  showCancel?: boolean;
};

const Modal = ({ isOpen, onClose, title, children, onConfirm, confirmText = 'OK', showCancel = false }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-md rounded-2xl bg-white p-5 shadow-2xl border border-gray-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-[#5a4fcf]/10">
            <AlertTriangle className="h-5 w-5 text-[#5a4fcf]" />
          </div>
          <div className="ml-3 text-left">
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            <div className="mt-1.5 text-gray-600 text-sm">{children}</div>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          {showCancel && <button onClick={onClose} className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:bg-gray-300">Cancel</button>}
          <button onClick={() => { if (onConfirm) onConfirm(); onClose(); }} className="rounded-lg bg-[#5a4fcf] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#4c42b8]">{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN BILLING COMPONENT ---
export default function BillingPage() {
  const { data: session, status } = useSession();
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [productName, setProductName] = React.useState('');
  const [scanning, setScanning] = React.useState(true);
  const [inventory, setInventory] = React.useState<InventoryProduct[]>([]);
  const [suggestions, setSuggestions] = React.useState<InventoryProduct[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  
  const [showWhatsAppSharePanel, setShowWhatsAppSharePanel] = React.useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState<string>('');
  
  const [merchantUpi, setMerchantUpi] = React.useState('');
  const [merchantName, setMerchantName] = React.useState('Billzzy Lite');
  const [whatsAppNumber, setWhatsAppNumber] = React.useState('');
  const [customerName, setCustomerName] = React.useState('');
  const [amountGiven, setAmountGiven] = React.useState<number | ''>('');
  
  const [isMessaging, setIsMessaging] = React.useState(false);
  const [scannerError, setScannerError] = React.useState<string>('');
  const [modal, setModal] = React.useState<{ isOpen: boolean; title: string; message: string | React.ReactNode; onConfirm?: (() => void); confirmText: string; showCancel: boolean; }>({ isOpen: false, title: '', message: '', confirmText: 'OK', showCancel: false });
  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  
  const [settingsComplete, setSettingsComplete] = React.useState(false);
  const [discountInput, setDiscountInput] = React.useState<string>('');
  const [discountType, setDiscountType] = React.useState<'percentage' | 'fixed'>('percentage');

  // --- UNFREEZE LOGIC: Detect when user comes back to the app ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      // If the app becomes visible again and we are stuck in loading state, reset it
      if (document.visibilityState === 'visible' && isMessaging) {
        console.log("App visible again, clearing loading state...");
        setIsMessaging(false);
        // Optional: If you want to clear the cart immediately upon return:
        setCart([]);
        setSelectedPayment('');
        setShowWhatsAppSharePanel(false);
        setShowPaymentOptions(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isMessaging]);

  const subtotal = React.useMemo(() =>
    cart.reduce((sum, item) => {
      const { totalPrice } = calculateGstDetails(item.price, item.gstRate);
      return sum + totalPrice * item.quantity;
    }, 0),
    [cart]
  );

  const { discountAmount, totalAmount } = React.useMemo(() => {
    const discountValue = parseFloat(discountInput) || 0;
    let calculatedDiscount = 0;
    if (discountType === 'percentage' && discountValue > 0) {
      calculatedDiscount = (subtotal * discountValue) / 100;
    } else if (discountType === 'fixed' && discountValue > 0) {
      calculatedDiscount = Math.min(discountValue, subtotal);
    }
    const finalTotal = Math.max(0, subtotal - calculatedDiscount);
    return { discountAmount: calculatedDiscount, totalAmount: finalTotal };
  }, [subtotal, discountInput, discountType]);

  const balance = React.useMemo(() => {
    const total = totalAmount;
    const given = Number(amountGiven);
    return given > 0 ? given - total : 0;
  }, [totalAmount, amountGiven]);

  const upiQR = merchantUpi ? `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount.toFixed(2)}&cu=INR&tn=Bill%20Payment` : '';

  const checkPhoneNumber = useCallback(() => {
    if (status === 'authenticated' && session?.user?.email) {
      const savedData = localStorage.getItem(`userSettings-${session.user.email}`);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          if (parsedData.phoneNumber && parsedData.phoneNumber.length >= 10) {
            setSettingsComplete(true);
            setMerchantUpi(parsedData.merchantUpiId || '');
            setMerchantName(parsedData.shopName || 'Billzzy Lite');
          }
        } catch (error) { console.error('Error parsing settings', error); }
      }
      setSettingsComplete(false);
      return false;
    }
    return false;
  }, [status, session]);

  React.useEffect(() => { checkPhoneNumber(); }, [checkPhoneNumber]);

  React.useEffect(() => {
    if (status !== 'authenticated') return;
    (async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) { setInventory([]); return; }
        const data: InventoryProduct[] = await res.json();
        const productsWithGst = data.map(p => ({ ...p, gstRate: p.gstRate || 0 }));
        setInventory(productsWithGst);
      } catch (err) { 
        console.error(err);
        setInventory([]); 
      }
    })();
  }, [status]);

  React.useEffect(() => {
    if (!productName.trim()) { setShowSuggestions(false); return; }
    const query = productName.trim().toLowerCase();
    const filtered = inventory.filter(p => p.name.toLowerCase().includes(query) || p.sku?.toLowerCase().includes(query)).slice(0, 5);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [productName, inventory]);

  const handleScanError = (error: unknown) => {
    console.error(error);
    setScannerError('Camera permission error.');
  };

  const sendWhatsAppMessage = useCallback(async (phoneNumber: string, messageType: string) => {
    if (!phoneNumber.trim() || !/^\d{10,15}$/.test(phoneNumber)) return false;
    try {
      const formattedPhone = phoneNumber.startsWith('91') ? phoneNumber : `91${phoneNumber}`;
      const orderId = `INV-${Date.now().toString().slice(-6)}`;
      const itemsList = cart.map((item) => `${item.name} (x${item.quantity})`).join(', ');

      let templateName = '';
      switch (messageType) {
        case 'cashPayment': templateName = 'payment_receipt_cashh'; break;
        case 'qrPayment': templateName = 'payment_receipt_upii'; break;
        case 'cardPayment': templateName = 'payment_receipt_card'; break;
        default: throw new Error(`Invalid message type: ${messageType}`);
      }

      const bodyParameters = [ orderId, merchantName, `₹${subtotal.toFixed(2)}`, itemsList, discountAmount > 0 ? `₹${discountAmount.toFixed(2)}` : '₹0.00' ];

      const messageData = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedPhone,
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'en' },
          components: [{ type: 'body', parameters: bodyParameters.map((text) => ({ type: 'text', text })) }],
        },
      };

      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });

      const result = await response.json();
      return response.ok && result.success;
    } catch (error) {
      console.error('WhatsApp API error:', error);
      return false;
    }
  }, [cart, discountAmount, merchantName, subtotal]);

  const sendWhatsAppReceipt = useCallback(async (paymentMethod: string) => {
    let templateType = '';
    switch (paymentMethod) { 
      case 'cash': templateType = 'cashPayment'; break; 
      case 'qr-code': templateType = 'qrPayment'; break; 
      default: templateType = 'cashPayment'; 
    }
    return await sendWhatsAppMessage(whatsAppNumber, templateType);
  }, [whatsAppNumber, sendWhatsAppMessage]);

  const addToCart = useCallback((name: string, price: number, gstRate: number, productId?: string, isEditing = false) => {
    if (!name || price < 0) return;
    setCart(prev => {
      const existingItem = productId ? prev.find(item => item.productId === productId) : null;
      if (existingItem) { return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item); }
      return [{ id: Date.now(), productId, name, quantity: 1, price, gstRate, isEditing }, ...prev];
    });
    setProductName('');
    setShowSuggestions(false);
  }, []);

  const handleScan = useCallback((results: IDetectedBarcode[]) => {
    if (results && results[0]) {
      const scannedValue = results[0].rawValue;
      const foundProduct = inventory.find(p => p.id === scannedValue || p.sku?.toLowerCase() === scannedValue.toLowerCase() || p.name.toLowerCase() === scannedValue.toLowerCase());
      if (foundProduct) { addToCart(foundProduct.name, foundProduct.sellingPrice, foundProduct.gstRate, foundProduct.id); setScanning(false); } 
      else { addToCart(scannedValue, 0, 0, undefined, true); setScanning(false); }
    }
  }, [inventory, addToCart]);

  const handleManualAdd = useCallback(() => { const name = productName.trim(); if (!name) { setModal({ isOpen: true, title: 'Item Name Required', message: 'Please enter a name for the custom item.', showCancel: false, confirmText: 'OK' }); return; } addToCart(name, 0, 0, undefined, true); }, [productName, addToCart]);
  const deleteCartItem = (id: number) => setCart(prev => prev.filter(item => item.id !== id));
  const toggleEdit = (id: number) => setCart(prev => prev.map(item => item.id === id ? { ...item, isEditing: !item.isEditing } : { ...item, isEditing: false }));
  const updateCartItem = (id: number, updatedValues: Partial<CartItem>) => setCart(prev => prev.map(item => item.id === id ? { ...item, ...updatedValues } : item));
  const handleTransactionDone = useCallback(() => { setCart([]); setSelectedPayment(''); setShowWhatsAppSharePanel(false); setShowPaymentOptions(false); setWhatsAppNumber(''); setAmountGiven(''); setDiscountInput(''); setModal({ ...modal, isOpen: false }); }, [modal]);
  const handleProceedToPayment = useCallback(async () => { if (cart.length === 0) { setModal({ isOpen: true, title: 'Cart Empty', message: 'Please add items to the cart before finalizing.', confirmText: 'OK', showCancel: false }); return; } setShowWhatsAppSharePanel(false); setShowPaymentOptions(true); }, [cart.length]);

  // --- FINAL PAYMENT HANDLER (Fixed for Freezing Issue) ---
  const handlePaymentSuccess = useCallback(async (useNfc: boolean = false) => {
    const clientToken = generateClientId();
    const paymentLabel = selectedPayment === 'cash' ? 'Cash' : 'UPI / QR';

    // Set UI to loading ("Processing...")
    setIsMessaging(true);

    try {
      if (useNfc) {
        // --- 1. FIRE AND FORGET NETWORK REQUESTS ---
        // Use keepalive:true so these survive even if the app switches immediately
        fetch('/api/nfc-link', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           keepalive: true, 
           body: JSON.stringify({ 
               cart, 
               totalAmount,
               paymentMethod: paymentLabel,
               providedToken: clientToken
           }),
        }).catch(e => console.error("NFC Save Error", e));

        cart.forEach(item => {
           if(item.productId) {
             fetch(`/api/products/${item.productId}`, { 
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' }, 
                keepalive: true,
                body: JSON.stringify({ quantityToDecrement: item.quantity }) 
             }).catch(e => console.error(e));
           }
        });

        // --- 2. DELAYED LAUNCH (THE FIX) ---
        // We delay slightly to allow React to render the loading state
        // and allow the browser to queue the fetch request.
        setTimeout(() => {
          const packageName = "com.billzzylite.bridge";
          const bridgeUrl = `intent://nfc/${clientToken}#Intent;scheme=billzzylite;package=${packageName};end`;
          
          window.location.href = bridgeUrl;
          
          // Note: We do NOT turn off setIsMessaging(false) here. 
          // It will be turned off by the 'visibilitychange' useEffect 
          // when the user comes back to the app.
        }, 100); 

        return; 
      }

      // --- STANDARD FLOW (No NFC) ---
      const updatePromises = cart.filter(item => item.productId).map(item => 
        fetch(`/api/products/${item.productId}`, { 
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ quantityToDecrement: item.quantity }) 
        })
      );
      await Promise.all(updatePromises).catch(err => console.error("Inventory update failed:", err));
    
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, paymentMethod: selectedPayment })
      });
      
      if (!response.ok) throw new Error('Failed to save sale');

      if (customerName.trim() && whatsAppNumber.trim()) {
        fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: customerName.trim(), phoneNumber: whatsAppNumber.trim() })
        }).catch(err => console.error("Customer save error", err));
      }
    
      let receiptSent = false;
      if (whatsAppNumber && whatsAppNumber.trim()) {
        receiptSent = await sendWhatsAppReceipt(selectedPayment);
      }
    
      setTimeout(() => {
          setModal({
            isOpen: true,
            title: 'Success!',
            message: receiptSent 
              ? 'Transaction completed! Receipt sent to customer via WhatsApp.' 
              : 'Transaction completed. Ready for a new bill.',
            confirmText: 'New Bill',
            onConfirm: handleTransactionDone,
            showCancel: false
          });
          setIsMessaging(false);
      }, 1000);

    } catch (error) {
      console.error("Payment Process Error:", error);
      setModal({ 
          isOpen: true, 
          title: 'Error', 
          message: 'Transaction saved, but there was a network issue.', 
          confirmText: 'OK', 
          showCancel: false 
      });
      setIsMessaging(false);
    }
  }, [selectedPayment, totalAmount, cart, handleTransactionDone, whatsAppNumber, sendWhatsAppReceipt, customerName, discountAmount, merchantName, subtotal]);

  const toggleScanner = useCallback(() => {
    setScanning(prev => { 
      if (!prev) { setScannerError(''); } 
      return !prev; 
    });
  }, []);

  return (
    <>
      <div className="h-full flex flex-col bg-gray-50">
        {!settingsComplete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-[90%] max-w-md rounded-2xl bg-white p-5 shadow-2xl border border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-[#5a4fcf]/10"><AlertTriangle className="h-5 w-5 text-[#5a4fcf]" /></div>
                <div className="ml-3 text-left"><h3 className="text-base font-semibold text-gray-900">Settings Incomplete</h3><div className="mt-1.5 text-gray-600 text-sm"><p>Please fill in your phone number in the settings to proceed with billing.</p></div></div>
              </div>
              <div className="mt-4 flex justify-end"><button onClick={() => { window.location.assign('/settings'); }} className="rounded-lg bg-[#5a4fcf] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#4c42b8]">Go to Settings</button></div>
            </div>
          </div>
        )}
        
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-2 space-y-2">
            {scanning && settingsComplete && (
              <div className="bg-white rounded-xl p-3 shadow-md border border-indigo-100">
                <div className="max-w-sm mx-auto"><Scanner constraints={{ facingMode: 'environment' }} onScan={handleScan} onError={handleScanError} scanDelay={300} styles={{ container: { width: '100%', height: 180, borderRadius: '12px', overflow: 'hidden' } }} /></div>
                {scannerError && <p className="text-center text-xs text-red-500 mt-2">{scannerError}</p>}
                <button onClick={toggleScanner} className="w-full mt-3 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-semibold hover:bg-red-100"><X size={16} /> Close Scanner</button>
              </div>
            )}

            <div className="bg-white rounded-xl p-3 shadow-md border border-gray-200">
              <div className="flex gap-2">
                <div ref={suggestionsRef} className="relative flex-1">
                  <input type="text" placeholder={settingsComplete ? "Search or add item..." : "Settings required to add items"} className="w-full rounded-lg border-2 border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] outline-none transition-all" value={productName} onChange={(e) => setProductName(e.target.value)} onClick={() => setScanning(false)} onKeyPress={(e) => { if (e.key === 'Enter') { handleManualAdd(); } }} disabled={!settingsComplete} />
                  {showSuggestions && settingsComplete && (
                    <div className="absolute z-10 mt-2 w-full rounded-xl border-2 border-[#5a4fcf] bg-white shadow-xl max-h-48 overflow-y-auto">{suggestions.map((s) => (<div key={s.id} onClick={() => addToCart(s.name, s.sellingPrice, s.gstRate, s.id)} className="cursor-pointer border-b border-gray-100 p-3 hover:bg-indigo-50 transition-colors last:border-b-0"><div className="flex justify-between items-center"><span className="font-semibold text-gray-800 text-sm">{s.name}</span><span className="text-[#5a4fcf] font-bold text-sm">{formatCurrency(s.sellingPrice)}</span></div>{s.sku && <p className="text-xs text-gray-500 mt-0.5">SKU: {s.sku}</p>}</div>))}</div>
                  )}
                </div>
              </div>
              {!scanning && settingsComplete && (<button onClick={toggleScanner} className="w-full mt-2 flex items-center justify-center gap-2 bg-indigo-50 text-[#5a4fcf] py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors"><Scan size={16} /> Scan Barcode</button>)}
            </div>

            {cart.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center shadow-md border border-gray-200"><div className="text-5xl mb-3">🛒</div><p className="text-gray-600 font-medium">{settingsComplete ? "Cart is Empty" : "Settings Required"}</p><p className="text-xs text-gray-500 mt-1">{settingsComplete ? "Add items to get started" : "Please complete your settings to start billing"}</p></div>
            ) : (
              <div className="space-y-2">{cart.map((item) => { const { gstAmount, totalPrice } = calculateGstDetails(item.price, item.gstRate); const totalItemPrice = totalPrice * item.quantity; return (<div key={item.id} className="bg-white rounded-xl p-3 shadow-md border border-gray-200"><div className="flex justify-between items-start gap-2"><div className="flex-1 min-w-0">{item.isEditing ? (<div className="space-y-2"><input type="text" value={item.name} onChange={(e) => updateCartItem(item.id, { name: e.target.value })} className="w-full border-2 border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#5a4fcf] outline-none" placeholder="Item name" disabled={!settingsComplete} /><div className="grid grid-cols-2 gap-2"><input type="number" value={item.quantity} onChange={(e) => updateCartItem(item.id, { quantity: parseInt(e.target.value, 10) || 1 })} className="border-2 border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#5a4fcf] outline-none" placeholder="Qty" disabled={!settingsComplete} /><input type="number" value={item.price} onChange={(e) => updateCartItem(item.id, { price: parseFloat(e.target.value) || 0 })} className="border-2 border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#5a4fcf] outline-none" placeholder="Price" disabled={!settingsComplete} /></div></div>) : (<><p className="font-bold text-gray-900 text-sm truncate">{item.name}</p><p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × {formatCurrency(totalPrice)}</p></>)}</div><div className="flex gap-2 items-start flex-shrink-0"><span className="text-base font-bold text-[#5a4fcf]">{formatCurrency(totalItemPrice)}</span><button onClick={() => toggleEdit(item.id)} className={`p-1.5 rounded-lg ${item.isEditing ? 'bg-green-100 text-green-600' : 'bg-indigo-50 text-[#5a4fcf]'} hover:opacity-80`} disabled={!settingsComplete}>{item.isEditing ? <Check size={16} /> : <Edit2 size={16} />}</button><button onClick={() => deleteCartItem(item.id)} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100" disabled={!settingsComplete}><Trash2 size={16} /></button></div></div>{!item.isEditing && item.gstRate > 0 && (<div className="text-xs text-gray-600 bg-indigo-50 rounded-lg p-2 mt-2 border border-indigo-100">Base: {formatCurrency(item.price)} + GST ({item.gstRate}%): {formatCurrency(gstAmount)}</div>)}</div>); })}</div>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] border-t-2 border-gray-200">
          <div className="p-2.5 space-y-2 max-h-[45vh] overflow-y-auto">
            <div className="space-y-2"><div className="relative"><input type="number" placeholder="Discount" value={discountInput} onChange={(e) => setDiscountInput(e.target.value)} className="w-full rounded-lg border-2 border-gray-300 p-2 text-sm focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] outline-none transition-all pr-12" disabled={cart.length === 0 || !settingsComplete} /><div className="absolute inset-y-0 right-0 flex items-center"><button onClick={() => setDiscountType(discountType === 'percentage' ? 'fixed' : 'percentage')} className="h-full rounded-r-lg px-3 text-sm font-bold text-white bg-[#5a4fcf] hover:bg-[#4c42b8] transition-colors" disabled={cart.length === 0 || !settingsComplete}>{discountType === 'percentage' ? '%' : '₹'}</button></div></div><div className="space-y-1 text-sm rounded-lg bg-gray-50 p-2 border"><div className="flex justify-between items-center text-gray-600"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>{discountAmount > 0 && (<div className="flex justify-between items-center text-green-600"><span>Discount</span><span>- {formatCurrency(discountAmount)}</span></div>)}<div className="flex justify-between items-center text-gray-900 font-bold border-t pt-1 mt-1"><span className="text-base">Total</span><span className="text-xl">{formatCurrency(totalAmount)}</span></div></div></div>

            {!showWhatsAppSharePanel && !showPaymentOptions && (
              <button onClick={() => { if (cart.length === 0) { setModal({ isOpen: true, title: 'Cart Empty', message: 'Please add items to the cart before finalizing.', confirmText: 'OK', showCancel: false }); return; } setShowWhatsAppSharePanel(true); setShowPaymentOptions(false); }} className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#5a4fcf] py-2.5 font-bold text-white hover:bg-[#4c42b8] disabled:bg-gray-400 transition-colors shadow-lg text-sm" disabled={cart.length === 0 || !settingsComplete}><CreditCard size={16} /><span>Proceed to Payment</span></button>
            )}

            {showWhatsAppSharePanel && cart.length > 0 && settingsComplete && (
              <div className="space-y-2 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-2.5 border-2 border-green-200">
                <p className="text-xs font-semibold text-gray-700 text-center">Customer Details & Sharing</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-1"><input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer Name (Optional)" className="w-full rounded-lg border-2 border-green-300 p-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200" /></div>
                  <div className="col-span-1"><input type="tel" value={whatsAppNumber} onChange={(e) => setWhatsAppNumber(e.target.value)} placeholder="91XXXXXXXXXX" className="w-full rounded-lg border-2 border-green-300 p-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200" /></div>
                </div>
                <button onClick={handleProceedToPayment} disabled={isMessaging} className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 py-2 font-semibold text-white hover:bg-green-700 disabled:bg-gray-400 transition-colors shadow-md text-sm">
                  {isMessaging ? (
                    <div className="flex items-center gap-2"><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div><span className="text-xs">Processing...</span></div>
                  ) : (
                    <><MessageSquare size={14} /><span className="text-xs">{whatsAppNumber.trim() ? 'Next: Payment' : 'Skip & Continue'}</span></>
                  )}
                </button>
              </div>
            )}

            {showPaymentOptions && cart.length > 0 && settingsComplete && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-700 text-center">Select Payment Method</p>
                <div className="grid grid-cols-2 gap-1.5">{[{ method: 'cash', label: 'Cash', color: 'green' }, { method: 'qr-code', label: 'QR/UPI', color: 'blue' }].map(({ method, label }) => (<button key={method} onClick={() => setSelectedPayment(method)} className={`rounded-lg px-2 py-2 text-xs font-bold capitalize transition-all ${selectedPayment === method ? 'bg-[#5a4fcf] text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{label}</button>))}</div>

                {selectedPayment === 'cash' && (
                  <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-2.5 border-2 border-green-200">
                    <p className="text-xs text-center font-medium text-gray-700 mb-2">Cash Payment</p>
                    <div className="grid grid-cols-2 gap-2 mb-2"><input type="number" placeholder="Amount Given" value={amountGiven} onChange={(e) => setAmountGiven(e.target.value === '' ? '' : parseFloat(e.target.value))} className="rounded-lg border-2 border-green-300 p-1.5 text-sm focus:ring-2 focus:ring-green-500 outline-none" /><div className="rounded-lg bg-white border-2 border-green-300 p-1.5 flex flex-col items-center justify-center"><span className="text-xs text-gray-500">Balance</span><span className={`font-bold text-sm ${balance < 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(balance)}</span></div></div>
                    <div className="flex gap-2">
                        <button onClick={() => handlePaymentSuccess(true)} disabled={isMessaging} className="flex-1 rounded-lg bg-indigo-600 py-2 font-bold text-white hover:bg-indigo-700 flex items-center justify-center shadow-md">
                            <div className="flex items-center gap-1"><Nfc size={18}/><span className="text-[10px]">Tap</span></div>
                        </button>
                        <button onClick={() => handlePaymentSuccess(false)} disabled={isMessaging} className="flex-[3] flex items-center justify-center gap-2 rounded-lg bg-green-600 py-2 font-bold text-white disabled:bg-gray-400 hover:bg-green-700 transition-colors shadow-md text-xs">
                            {isMessaging ? (<div className="flex items-center gap-2"><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div><span>Processing...</span></div>) : (<><DollarSign size={16} /><span>Confirm Cash Payment</span></>)}
                        </button>
                    </div>
                  </div>
                )}

                {selectedPayment === 'qr-code' && (
                  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-2.5 border-2 border-blue-200">
                    {upiQR ? (<><p className="text-xs text-center font-medium text-gray-700 mb-2">Scan QR to Pay</p><div className="bg-white p-2 rounded-lg mx-auto max-w-[140px] border-2 border-blue-300"><QRCode value={upiQR} style={{ height: 'auto', width: '100%' }} /></div><p className="mt-1.5 text-xs text-center text-gray-600">Pay to: <span className="font-semibold">{merchantUpi}</span></p>
                    <div className="flex gap-2 mt-2">
                        <button onClick={() => handlePaymentSuccess(true)} disabled={isMessaging} className="flex-1 rounded-lg bg-indigo-600 py-2 font-bold text-white hover:bg-indigo-700 flex items-center justify-center shadow-md">
                            <div className="flex items-center gap-1"><Nfc size={18}/><span className="text-[10px]">Tap</span></div>
                        </button>
                        <button onClick={() => handlePaymentSuccess(false)} disabled={isMessaging} className="flex-[3] flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 font-bold text-white disabled:bg-gray-400 hover:bg-blue-700 transition-colors shadow-md text-xs">
                            {isMessaging ? (<div className="flex items-center gap-2"><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div><span>Processing...</span></div>) : (<><CheckCircle size={16} /><span>Confirm Payment Received</span></>)}
                        </button>
                    </div>
                    </>) : (<p className="text-center text-xs font-semibold text-red-600 py-4">UPI ID not configured. Please update settings.</p>)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={modal.isOpen} onClose={() => setModal({ ...modal, isOpen: false, message: '' })} title={modal.title} onConfirm={modal.onConfirm} confirmText={modal.confirmText} showCancel={modal.showCancel}>{modal.message}</Modal>
    </>
  );
}
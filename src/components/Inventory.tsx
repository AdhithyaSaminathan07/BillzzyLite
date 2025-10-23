// // export default Inventory;

// 'use client';

// import React, { useState, useEffect, FC, ChangeEvent, useRef } from "react";
// import { useSession } from "next-auth/react";
// import * as XLSX from "xlsx";
// import { Upload, Edit2, Plus, X, Trash2, Search, Image as ImageIcon, Camera, Loader2, Info, AlertTriangle } from "lucide-react";
// import { motion, useAnimationControls, PanInfo } from "framer-motion";
// import { Html5Qrcode } from "html5-qrcode";
// import Image from "next/image";

// // --- CONFIGURATION ---
// const LOW_STOCK_THRESHOLD = 10;

// // --- INTERFACES AND UTILITIES ---
// export interface Product {
//   id: string;
//   name: string;
//   quantity: number;
//   buyingPrice: number;
//   sellingPrice: number;
//   gstRate: number;
//   image?: string;
//   sku?: string;
//   lowStockThreshold?: number;
// }

// interface ExcelRow {
//   "Product ID"?: string | number;
//   "Product Name"?: string;
//   "Quantity"?: number;
//   "Buying Price"?: number;
//   "Selling Price"?: number;
//   "GST Rate"?: number;
// }

// const formatCurrency = (amount: number): string => {
//   return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
// };

// // --- MOBILE PRODUCT CARD ---
// interface MobileProductCardProps {
//   product: Product;
//   isSwiped: boolean;
//   onSwipe: (id: string | null) => void;
//   onEdit: (product: Product) => void;
//   onDelete: (id: string) => void;
// }

// const MobileProductCard: FC<MobileProductCardProps> = ({ product, isSwiped, onSwipe, onEdit, onDelete }) => {
//   const controls = useAnimationControls();
//   const ACTION_WIDTH = 160;

//   const alertThreshold = product.lowStockThreshold ?? LOW_STOCK_THRESHOLD;
//   const isLowStock = product.quantity <= alertThreshold;

//   useEffect(() => {
//     if (!isSwiped) {
//       controls.start({ x: 0 });
//     }
//   }, [isSwiped, controls]);

//   const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
//     if (info.offset.x < -ACTION_WIDTH / 2) {
//       controls.start({ x: -ACTION_WIDTH });
//       onSwipe(product.id);
//     } else {
//       controls.start({ x: 0 });
//     }
//   };

//   return (
//     <div className={`relative w-full bg-gray-200 rounded-lg overflow-hidden shadow-sm ${isLowStock ? 'ring-2 ring-red-500' : ''}`}>
//       <div className="absolute inset-y-0 right-0 flex" style={{ width: ACTION_WIDTH }}>
//         <button onClick={() => onEdit(product)} className="w-1/2 h-full flex flex-col items-center justify-center bg-indigo-500 text-white transition-colors hover:bg-indigo-600">
//           <Edit2 className="w-5 h-5" /><span className="text-xs mt-1">Edit</span>
//         </button>
//         <button onClick={() => onDelete(product.id)} className="w-1/2 h-full flex flex-col items-center justify-center bg-red-500 text-white transition-colors hover:bg-red-600">
//           <Trash2 className="w-5 h-5" /><span className="text-xs mt-1">Delete</span>
//         </button>
//       </div>
//       <motion.div
//         className="relative bg-white p-3 flex items-center gap-3 w-full cursor-grab"
//         drag="x" dragConstraints={{ right: 0, left: -ACTION_WIDTH }} onDragEnd={handleDragEnd}
//         animate={controls} transition={{ type: "spring", stiffness: 300, damping: 30 }}
//         onClick={() => { if (isSwiped) { controls.start({ x: 0 }); onSwipe(null); } }}
//       >
//         {product.image ? (
//            <Image src={product.image} alt={product.name} width={64} height={64} className="w-16 h-16 object-cover rounded-md bg-gray-100 flex-shrink-0" />
//          ) : (
//            <button onClick={() => onEdit(product)} className="w-16 h-16 flex-shrink-0 flex flex-col items-center justify-center bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
//              <Upload className="w-5 h-5 text-gray-500" />
//              <span className="text-xs mt-1 text-gray-600">Upload</span>
//            </button>
//          )}
//         <div className="flex-1 overflow-hidden">
//           <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
//           <p className="text-sm text-gray-500 truncate">Product ID: {product.sku || 'N/A'}</p>
//           <div className="flex items-center gap-2 mt-1">
//             {isLowStock && (
//                 <div className="flex items-center gap-1 text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
//                     <AlertTriangle className="w-3 h-3" />
//                     <span className="text-xs font-medium">Low Stock</span>
//                 </div>
//             )}
//             <p className="text-sm text-gray-700 font-medium">Qty: {product.quantity}</p>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };


// // --- DESKTOP PRODUCT TABLE ---
// const DesktopProductTable: FC<{ products: Product[]; onEdit: (p: Product) => void; onDelete: (id: string) => void; }> = ({ products, onEdit, onDelete }) => (
//     <div className="hidden md:block overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
//         <table className="min-w-full divide-y divide-gray-300">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Image</th>
//               <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Product Name</th>
//               <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Product ID</th>
//               <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
//               <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Selling Price</th>
//               <th className="px-3 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {products.map((p) => {
//                 const alertThreshold = p.lowStockThreshold ?? LOW_STOCK_THRESHOLD;
//                 const isLowStock = p.quantity <= alertThreshold;
//                 return (
//                 <tr key={p.id} className={isLowStock ? 'bg-red-50' : ''}>
//                   <td className="px-3 py-2">
//                   {p.image ? (
//                       <Image src={p.image} alt={p.name} width={56} height={56} className="w-14 h-14 object-cover rounded-md" />
//                     ) : (
//                       <button onClick={() => onEdit(p)} className="w-14 h-14 flex flex-col items-center justify-center bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border">
//                         <Upload className="w-5 h-5 text-gray-400" />
//                       </button>
//                     )}
//                   </td>
//                   <td className="px-3 py-2 text-sm font-medium text-gray-900">{p.name}</td>
//                   <td className="px-3 py-2 text-sm text-gray-500 truncate max-w-xs">{p.sku || 'N/A'}</td>
//                   <td className="px-3 py-2 text-sm">
//                     <div className="flex items-center gap-2">
//                         {isLowStock && (
//                           <span title={`Alert set for ${alertThreshold}`}>
//                             <AlertTriangle className="w-4 h-4 text-red-500" />
//                           </span>
//                         )}
//                         <span className={isLowStock ? 'text-red-600 font-semibold' : 'text-gray-500'}>{p.quantity}</span>
//                     </div>
//                   </td>
//                   <td className="px-3 py-2 text-sm text-gray-500">{formatCurrency(p.sellingPrice)}</td>
//                   <td className="px-3 py-2 text-right">
//                     <div className="flex justify-end gap-4">
//                       <button onClick={() => onEdit(p)} className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"><Edit2 className="w-4 h-4" /> Edit</button>
//                       <button onClick={() => onDelete(p.id)} className="text-red-600 hover:text-red-900 flex items-center gap-1"><Trash2 className="w-4 h-4" /> Delete</button>
//                     </div>
//                   </td>
//                 </tr>
//                 );
//             })}
//           </tbody>
//         </table>
//       </div>
// );


// // --- MOBILE PRODUCT LIST ---
// const MobileProductList: FC<{ products: Product[]; swipedId: string | null; onSwipe: (id: string | null) => void; onEdit: (p: Product) => void; onDelete: (id: string) => void; }> = ({ products, swipedId, onSwipe, onEdit, onDelete }) => (
//     <div className="md:hidden space-y-3 pb-20">
//         {products.map((p) => (
//           <MobileProductCard key={p.id} product={p} isSwiped={swipedId === p.id} onSwipe={onSwipe} onEdit={onEdit} onDelete={onDelete} />
//         ))}
//     </div>
// );

// // --- PRODUCT FORM MODAL ---
// type ProductFormData = Omit<Product, 'id'> & { id?: string };
// type ProductFormState = Omit<ProductFormData, 'quantity' | 'buyingPrice' | 'sellingPrice' | 'gstRate' | 'lowStockThreshold'> & {
//     quantity?: number | ''; // Allow empty string for input field
//     buyingPrice?: number | '';
//     sellingPrice?: number | '';
//     gstRate?: number | '';
//     lowStockThreshold?: number | '';
// };
// interface ProductFormModalProps {
//     product: ProductFormData | null;
//     onSave: (productData: ProductFormData, imageFile: File | null) => Promise<void>;
//     onClose: () => void;
// }

// const ProductFormModal: FC<ProductFormModalProps> = ({ product, onSave, onClose }) => {
//     const getInitialState = (): ProductFormState => {
//         if (product) {
//             return {
//                 ...product,
//                 quantity: product.quantity ?? '',
//                 buyingPrice: product.buyingPrice ?? '',
//                 sellingPrice: product.sellingPrice ?? '',
//                 gstRate: product.gstRate ?? '',
//                 lowStockThreshold: product.lowStockThreshold ?? ''
//             };
//         }
//         return {
//             name: "", sku: "", quantity: '', buyingPrice: '',
//             sellingPrice: '', gstRate: '', image: '', lowStockThreshold: ''
//         };
//     };

//     const [formData, setFormData] = useState<ProductFormState>(getInitialState);
//     const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
//     const [imageFile, setImageFile] = useState<File | null>(null);
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const [isScannerOpen, setIsScannerOpen] = useState(false);
//     const scannerRef = useRef<Html5Qrcode | null>(null);
//     const readerId = "qr-reader-modal";

//     useEffect(() => {
//         if (isScannerOpen) {
//             const scanner = new Html5Qrcode(readerId);
//             scannerRef.current = scanner;
//             const config = { fps: 10, qrbox: { width: 250, height: 250 } };

//             scanner.start({ facingMode: "environment" }, config, (decodedText) => {
//                 setFormData(prev => ({ ...prev, sku: decodedText }));
//                 setIsScannerOpen(false);
//             }, () => {}).catch(err => console.error("Unable to start scanning.", err));
//         }

//         return () => {
//             if (scannerRef.current?.isScanning) {
//                 scannerRef.current.stop().catch(err => console.error("Failed to stop scanner.", err));
//             }
//         };
//     }, [isScannerOpen]);

//     const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//         const { name, value, type } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
//         }));
//     };

//     const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             setImageFile(file);
//             setImagePreview(URL.createObjectURL(file));
//         }
//     };

//     const handleFormSubmit = () => {
//         const dataToSave: ProductFormData = {
//             ...formData,
//             quantity: Number(formData.quantity) || 0,
//             sellingPrice: Number(formData.sellingPrice) || 0,
//             gstRate: Number(formData.gstRate) || 0,
//             buyingPrice: Number(formData.buyingPrice) || 0,
//             lowStockThreshold: Number(formData.lowStockThreshold) || undefined,
//         };
//         onSave(dataToSave, imageFile);
//     };

//     return (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
//             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.3 }} className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
//                 <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 flex justify-between items-center">
//                     <div>
//                         <h2 className="text-xl font-bold text-white">{product?.id ? 'Edit Product' : 'Add New Product'}</h2>
//                         <p className="text-indigo-100 text-sm mt-0.5">{product?.id ? 'Update product information' : 'Fill in the details below'}</p>
//                     </div>
//                     <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"><X className="w-5 h-5" /></button>
//                 </div>

//                 <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
//                     {isScannerOpen ? (
//                         <div className="space-y-4">
//                             <div id={readerId} className="w-full rounded-xl overflow-hidden border-2 border-gray-200" />
//                             <button onClick={() => setIsScannerOpen(false)} className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-medium transition-colors">Cancel Scan</button>
//                         </div>
//                     ) : (
//                         <>
//                             <div className="space-y-2">
//                                 <label className="text-sm font-medium text-gray-700">Product Image</label>
//                                 <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors" onClick={() => fileInputRef.current?.click()}>
//                                     <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
//                                     {imagePreview ? (
//                                         <div className="relative w-full h-full"><Image src={imagePreview} alt="Product Preview" layout="fill" objectFit="contain" className="p-2" /></div>
//                                     ) : (
//                                         <div className="text-center text-gray-500"><ImageIcon className="w-10 h-10 mx-auto mb-2" /><p>Click to upload an image</p></div>
//                                     )}
//                                 </div>
//                             </div>
//                             <div className="space-y-2">
//                                 <label className="text-sm font-medium text-gray-700">Product Name</label>
//                                 <input type="text" name="name" placeholder="Enter product name" className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none" value={formData.name} onChange={handleInputChange} />
//                             </div>
//                             <div className="space-y-2">
//                                 <label className="text-sm font-medium text-gray-700">Product ID (SKU)</label>
//                                 <div className="relative">
//                                     <input type="text" name="sku" placeholder="SKU, Barcode, or custom ID" className="w-full border-2 border-gray-200 px-4 py-3 pr-14 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none font-mono text-sm" value={formData.sku || ''} onChange={handleInputChange} />
//                                     <button type="button" onClick={() => setIsScannerOpen(true)} className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-500/20 transition-all active:scale-95" aria-label="Scan barcode"><Camera className="w-5 h-5" /></button>
//                                 </div>
//                             </div>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <div className="space-y-2">
//                                     <label className="text-sm font-medium text-gray-700">Quantity</label>
//                                     <input type="number" name="quantity" placeholder="e.g., 50" className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none" value={formData.quantity} onChange={handleInputChange} />
//                                 </div>
//                                 <div className="space-y-2">
//                                     <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5" title="Set a custom alert when quantity falls to this level. Leave blank to use the global setting.">
//                                         Low Stock Alert
//                                         <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
//                                     </label>
//                                     <input
//                                         type="number"
//                                         name="lowStockThreshold"
//                                         placeholder={`Default: ${LOW_STOCK_THRESHOLD}`}
//                                         className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none"
//                                         value={formData.lowStockThreshold}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>
//                             </div>
//                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                <div className="space-y-2">
//                                     <label className="text-sm font-medium text-gray-700">Selling Price</label>
//                                     <div className="relative">
//                                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
//                                         <input type="number" name="sellingPrice" placeholder="e.g., 199.99" className="w-full border-2 border-gray-200 pl-8 pr-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" value={formData.sellingPrice} onChange={handleInputChange} />
//                                     </div>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <label className="text-sm font-medium text-gray-700">GST Rate</label>
//                                     <div className="relative">
//                                         <input type="number" name="gstRate" placeholder="e.g., 18" className="w-full border-2 border-gray-200 px-4 py-3 pr-12 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none" value={formData.gstRate} onChange={handleInputChange} />
//                                         <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </>
//                     )}
//                 </div>

//                 <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
//                     <button onClick={onClose} className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors">Cancel</button>
//                     <button onClick={handleFormSubmit} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-medium shadow-lg shadow-indigo-500/30 transition-all">{product?.id ? 'Save Changes' : 'Add Product'}</button>
//                 </div>
//             </motion.div>
//         </div>
//     );
// };


// // --- MAIN INVENTORY COMPONENT ---
// const Inventory: FC = () => {
//     // FIX 1: Removed unused 'session' variable. Only 'sessionStatus' is needed.
//     const { status: sessionStatus } = useSession();
//     const [products, setProducts] = useState<Product[]>([]);
//     const [fetchStatus, setFetchStatus] = useState<'loading' | 'succeeded' | 'failed'>('loading');
//     const [error, setError] = useState<string | null>(null);
//     const [modalState, setModalState] = useState<{ isOpen: boolean; product: ProductFormData | null }>({ isOpen: false, product: null });
//     const [swipedProductId, setSwipedProductId] = useState<string | null>(null);
//     const [searchQuery, setSearchQuery] = useState<string>("");

//     useEffect(() => {
//         if (sessionStatus === 'authenticated') {
//             const fetchProducts = async () => {
//                 setFetchStatus('loading');
//                 try {
//                     const response = await fetch('/api/products');
//                     if (!response.ok) {
//                       const errorData = await response.json().catch(() => ({ message: 'Failed to fetch products' }));
//                       throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//                     }
//                     const data = await response.json();
//                     setProducts(Array.isArray(data) ? data : []);
//                     setFetchStatus('succeeded');
//                 // FIX 2: Replaced 'any' with 'unknown' for type-safe error handling.
//                 } catch (err: unknown) {
//                     const message = err instanceof Error ? err.message : String(err);
//                     console.error("Error fetching products:", message);
//                     setError(message);
//                     setFetchStatus('failed');
//                 }
//             };
//             fetchProducts();
//         } else if (sessionStatus === 'unauthenticated') {
//             setProducts([]);
//             setFetchStatus('succeeded');
//         }
//     }, [sessionStatus]);

//     const filteredProducts = products.filter(product =>
//         product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()))
//     );

//     const handleExcelUpload = async (e: ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;
//         const reader = new FileReader();
//         reader.onload = async (event: ProgressEvent<FileReader>) => {
//             if (!event.target?.result) return;
//             try {
//                 const data = new Uint8Array(event.target.result as ArrayBuffer);
//                 const workbook = XLSX.read(data, { type: "array" });
//                 const sheetName = workbook.SheetNames[0];
//                 const sheet = workbook.Sheets[sheetName];
//                 const rows: ExcelRow[] = XLSX.utils.sheet_to_json(sheet);

//                 const uploadedProducts = rows.map((row) => ({
//                     sku: String(row["Product ID"] || ""),
//                     name: String(row["Product Name"] || ""),
//                     quantity: Number(row["Quantity"]) || 0,
//                     buyingPrice: Number(row["Buying Price"]) || 0,
//                     sellingPrice: Number(row["Selling Price"]) || 0,
//                     gstRate: Number(row["GST Rate"]) || 0,
//                 }));

//                 const response = await fetch('/api/products', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(uploadedProducts),
//                 });

//                 if (!response.ok) {
//                     const errorData = await response.json();
//                     throw new Error(errorData.message || 'Failed to upload products');
//                 }
//                 const allProducts: Product[] = await response.json();
                
//                 if (Array.isArray(allProducts)) {
//                     setProducts(allProducts);
//                     alert('Products uploaded successfully!');
//                 } else {
//                      console.error("Error: Bulk upload API did not return an array.", allProducts);
//                 }
//             // FIX 3: Replaced 'any' with 'unknown'.
//             } catch (err: unknown) {
//                 const message = err instanceof Error ? err.message : String(err);
//                 console.error("Error uploading products:", message);
//                 alert(`An error occurred during the upload: ${message}`);
//             }
//         };
//         reader.readAsArrayBuffer(file);
//     };

//     const handleSaveProduct = async (productData: ProductFormData, imageFile: File | null) => {
//         try {
//             let imageUrl = productData.image || '';
//             if (imageFile) {
//                 const formData = new FormData();
//                 formData.append('file', imageFile);
//                 const uploadResponse = await fetch('/api/upload', { method: 'POST', body: formData });
//                 const uploadData = await uploadResponse.json();
//                 if (!uploadResponse.ok || !uploadData.success) {
//                     throw new Error(uploadData.message || 'Image upload failed');
//                 }
//                 imageUrl = uploadData.path;
//             }

//             const productToSave = { ...productData, image: imageUrl };
//             const isEditing = !!productData.id;
//             const url = isEditing ? `/api/products/${productData.id}` : '/api/products';
//             const method = isEditing ? 'PUT' : 'POST';

//             const response = await fetch(url, {
//                 method,
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(productToSave),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'create'} product`);
//             }
            
//             const savedData = await response.json();

//             // After a POST, the response might be the full list or the single new product.
//             // This logic handles both cases gracefully.
//             if (isEditing) {
//                 const savedProduct: Product = savedData;
//                 setProducts(prevProducts => 
//                     prevProducts.map(p => 
//                         p.id === savedProduct.id ? savedProduct : p
//                     )
//                 );
//             } else {
//                 // If the POST returns the new single product, add it.
//                 // If it returns the full list, replace the list.
//                 if (Array.isArray(savedData)) {
//                     setProducts(savedData);
//                 } else {
//                     const newProduct: Product = savedData;
//                     setProducts(prevProducts => [...prevProducts, newProduct]);
//                 }
//             }

//             setModalState({ isOpen: false, product: null });
//         // FIX 4: Replaced 'any' with 'unknown'.
//         } catch (err: unknown) {
//             const message = err instanceof Error ? err.message : String(err);
//             console.error("Error saving product:", message);
//             alert(`Failed to save product: ${message}`);
//         }
//     };

//     const handleDeleteProduct = async (id: string) => {
//         if (window.confirm('Are you sure you want to delete this product?')) {
//             try {
//                 const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
//                 if (response.status !== 204) {
//                   const errorData = await response.json().catch(() => ({ message: 'Failed to delete product' }));
//                   throw new Error(errorData.message);
//                 }
//                 setProducts(products.filter((p) => p.id !== id));
//             // FIX 5: Replaced 'any' with 'unknown'.
//             } catch (err: unknown) {
//                 const message = err instanceof Error ? err.message : String(err);
//                 console.error("Error deleting product:", message);
//                 alert(`Error deleting product: ${message}`);
//             }
//         }
//         setSwipedProductId(null);
//     };
    
//     const renderContent = () => {
//         if (sessionStatus === 'loading' || fetchStatus === 'loading') {
//             return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /> <span className="ml-2">Loading Products...</span></div>;
//         }

//         if (sessionStatus === 'unauthenticated') {
//             return <div className="text-center h-64 flex flex-col justify-center items-center bg-gray-50 rounded-lg"><Info className="w-8 h-8 mb-2 text-gray-400" /> <h3 className="font-semibold">Please Log In</h3><p className="text-gray-500">Log in to manage your inventory.</p></div>
//         }

//         if (fetchStatus === 'failed') {
//             return <div className="flex flex-col items-center justify-center h-64 bg-red-50 text-red-700 rounded-lg p-4"><Info className="w-8 h-8 mb-2" /><strong>Error:</strong> {error}</div>;
//         }

//         if (products.length === 0) {
//             return <div className="text-center h-64 flex flex-col justify-center items-center bg-gray-50 rounded-lg"><Info className="w-8 h-8 mb-2 text-gray-400" /> <h3 className="font-semibold">No Products Found</h3><p className="text-gray-500">Click &quot;Add Product&quot; to get started.</p></div>
//         }
        
//         if (filteredProducts.length === 0) {
//             return <div className="text-center h-64 flex flex-col justify-center items-center bg-gray-50 rounded-lg"><Search className="w-8 h-8 mb-2 text-gray-400" /> <h3 className="font-semibold">No Matching Products</h3><p className="text-gray-500">Try a different search query.</p></div>
//         }

//         return (
//             <>
//                 <DesktopProductTable products={filteredProducts} onEdit={(p) => setModalState({ isOpen: true, product: p })} onDelete={handleDeleteProduct} />
//                 <MobileProductList products={filteredProducts} swipedId={swipedProductId} onSwipe={setSwipedProductId} onEdit={(p) => setModalState({ isOpen: true, product: p })} onDelete={handleDeleteProduct} />
//             </>
//         );
//     };

//     return (
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
//             <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
//                 <div>
//                     <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Inventory</h1>
//                     <p className="hidden md:block text-sm text-gray-600">Search, upload, or manage products manually.</p>
//                 </div>
//                 <div className="relative w-full md:w-auto order-first md:order-none">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input type="text" placeholder="Search by name or Product ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
//                 </div>
//                 <div className="hidden sm:flex items-center gap-3">
//                     <label className="flex items-center cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
//                         <Upload className="w-4 h-4 mr-2" /> Upload Excel
//                         <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
//                     </label>
//                     <button onClick={() => setModalState({ isOpen: true, product: null })} className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm">
//                         <Plus className="w-4 h-4" /> Add Product
//                     </button>
//                 </div>
//             </div>

//             {renderContent()}

//             <div className="sm:hidden fixed bottom-20 right-4 flex flex-col items-center gap-3 z-40">
//                 <label className="w-14 h-14 flex items-center justify-center cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg">
//                     <Upload className="w-6 h-6" /><input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
//                 </label>
//                 <button onClick={() => setModalState({ isOpen: true, product: null })} className="w-14 h-14 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg">
//                     <Plus className="w-6 h-6" />
//                 </button>
//             </div>

//             {modalState.isOpen && (
//                 <ProductFormModal
//                     product={modalState.product}
//                     onSave={handleSaveProduct}
//                     onClose={() => setModalState({ isOpen: false, product: null })}
//                 />
//             )}
//         </div>
//     );
// };

// export default Inventory;



// src/components/Inventory.tsx

'use client';

import React, { useState, useEffect, FC, ChangeEvent, useRef } from "react";
import { useSession } from "next-auth/react";
import * as XLSX from "xlsx";
import { Upload, Edit2, Plus, X, Trash2, Search, Image as ImageIcon, Camera, Loader2, Info, AlertTriangle, Package } from "lucide-react";
import { motion, useAnimationControls, PanInfo } from "framer-motion";
import { Html5Qrcode } from "html5-qrcode";
import Image from "next/image";

// --- CONFIGURATION ---
const LOW_STOCK_THRESHOLD = 10;

// --- INTERFACES AND UTILITIES ---
export interface Product {
  id: string;
  name: string;
  quantity: number;
  buyingPrice: number;
  sellingPrice: number;
  gstRate: number;
  image?: string;
  sku?: string;
  lowStockThreshold?: number;
}

interface ExcelRow {
  "Product ID"?: string | number;
  "Product Name"?: string;
  "Quantity"?: number;
  "Buying Price"?: number;
  "Selling Price"?: number;
  "GST Rate"?: number;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
};

// --- MOBILE PRODUCT CARD ---
interface MobileProductCardProps {
  product: Product;
  isSwiped: boolean;
  onSwipe: (id: string | null) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const MobileProductCard: FC<MobileProductCardProps> = ({ product, isSwiped, onSwipe, onEdit, onDelete }) => {
  const controls = useAnimationControls();
  const ACTION_WIDTH = 160;

  const alertThreshold = product.lowStockThreshold ?? LOW_STOCK_THRESHOLD;
  const isLowStock = product.quantity <= alertThreshold;

  useEffect(() => {
    if (!isSwiped) {
      controls.start({ x: 0 });
    }
  }, [isSwiped, controls]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    if (info.offset.x < -ACTION_WIDTH / 2) {
      controls.start({ x: -ACTION_WIDTH });
      onSwipe(product.id);
    } else {
      controls.start({ x: 0 });
    }
  };

  return (
    <div className={`relative w-full bg-gray-100 rounded-2xl overflow-hidden shadow-md ${isLowStock ? 'ring-2 ring-red-400' : ''}`}>
      <div className="absolute inset-y-0 right-0 flex" style={{ width: ACTION_WIDTH }}>
        <button onClick={() => onEdit(product)} className="w-1/2 h-full flex flex-col items-center justify-center bg-[#5a4fcf] text-white transition-colors hover:bg-[#4a3fbf]">
          <Edit2 className="w-5 h-5" /><span className="text-xs mt-1 font-medium">Edit</span>
        </button>
        <button onClick={() => onDelete(product.id)} className="w-1/2 h-full flex flex-col items-center justify-center bg-red-500 text-white transition-colors hover:bg-red-600">
          <Trash2 className="w-5 h-5" /><span className="text-xs mt-1 font-medium">Delete</span>
        </button>
      </div>
      <motion.div
        className="relative bg-white p-4 flex items-center gap-4 w-full cursor-grab"
        drag="x" dragConstraints={{ right: 0, left: -ACTION_WIDTH }} onDragEnd={handleDragEnd}
        animate={controls} transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={() => { if (isSwiped) { controls.start({ x: 0 }); onSwipe(null); } }}
      >
        {product.image ? (
           <Image src={product.image} alt={product.name} width={72} height={72} className="w-18 h-18 object-cover rounded-xl bg-gray-50 flex-shrink-0 border-2 border-gray-100" />
         ) : (
           <button onClick={() => onEdit(product)} className="w-18 h-18 flex-shrink-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-[#5a4fcf]/10 hover:to-[#5a4fcf]/5 transition-all border-2 border-dashed border-gray-300">
             <Upload className="w-5 h-5 text-gray-400" />
             <span className="text-xs mt-1 text-gray-500 font-medium">Add</span>
           </button>
         )}
        <div className="flex-1 overflow-hidden">
          <h3 className="font-bold text-gray-900 truncate text-lg">{product.name}</h3>
          <p className="text-sm text-gray-500 truncate font-mono">ID: {product.sku || 'N/A'}</p>
          <div className="flex items-center gap-3 mt-2">
            {isLowStock && (
                <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">Low Stock</span>
                </div>
            )}
            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full">
              <Package className="w-3.5 h-3.5 text-gray-600" />
              <span className="text-sm text-gray-700 font-semibold">{product.quantity}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- DESKTOP PRODUCT TABLE ---
const DesktopProductTable: FC<{ products: Product[]; onEdit: (p: Product) => void; onDelete: (id: string) => void; }> = ({ products, onEdit, onDelete }) => (
    <div className="hidden md:block overflow-hidden rounded-2xl shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-[#5a4fcf] to-[#7c6fdd]">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Image</th>
              <th className="px-4 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Product Name</th>
              <th className="px-4 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Product ID</th>
              <th className="px-4 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Price</th>
              <th className="px-4 py-4 text-right text-sm font-bold text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {products.map((p, index) => {
                const alertThreshold = p.lowStockThreshold ?? LOW_STOCK_THRESHOLD;
                const isLowStock = p.quantity <= alertThreshold;
                return (
                <tr key={p.id} className={`${isLowStock ? 'bg-red-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-[#5a4fcf]/5 transition-colors`}>
                  <td className="px-4 py-3">
                  {p.image ? (
                      <Image src={p.image} alt={p.name} width={64} height={64} className="w-16 h-16 object-cover rounded-xl border-2 border-gray-200" />
                    ) : (
                      <button onClick={() => onEdit(p)} className="w-16 h-16 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-[#5a4fcf]/10 hover:to-[#5a4fcf]/5 transition-all border-2 border-dashed border-gray-300">
                        <Upload className="w-5 h-5 text-gray-400" />
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">{p.sku || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                        {isLowStock && (
                          <span title={`Alert set for ${alertThreshold}`}>
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          </span>
                        )}
                        <span className={`font-semibold ${isLowStock ? 'text-red-600' : 'text-gray-700'}`}>{p.quantity}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatCurrency(p.sellingPrice)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => onEdit(p)} className="text-[#5a4fcf] hover:text-[#4a3fbf] flex items-center gap-1 font-medium transition-colors">
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button onClick={() => onDelete(p.id)} className="text-red-600 hover:text-red-700 flex items-center gap-1 font-medium transition-colors">
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
                );
            })}
          </tbody>
        </table>
      </div>
);

// --- MOBILE PRODUCT LIST ---
const MobileProductList: FC<{ products: Product[]; swipedId: string | null; onSwipe: (id: string | null) => void; onEdit: (p: Product) => void; onDelete: (id: string) => void; }> = ({ products, swipedId, onSwipe, onEdit, onDelete }) => (
    <div className="md:hidden space-y-4 pb-24">
        {products.map((p) => (
          <MobileProductCard key={p.id} product={p} isSwiped={swipedId === p.id} onSwipe={onSwipe} onEdit={onEdit} onDelete={onDelete} />
        ))}
    </div>
);

// --- PRODUCT FORM MODAL ---
type ProductFormData = Omit<Product, 'id'> & { id?: string };
type ProductFormState = Omit<ProductFormData, 'quantity' | 'buyingPrice' | 'sellingPrice' | 'gstRate' | 'lowStockThreshold'> & {
    quantity?: number | '';
    buyingPrice?: number | '';
    sellingPrice?: number | '';
    gstRate?: number | '';
    lowStockThreshold?: number | '';
};
interface ProductFormModalProps {
    product: ProductFormData | null;
    onSave: (productData: ProductFormData, imageFile: File | null) => Promise<void>;
    onClose: () => void;
}

const ProductFormModal: FC<ProductFormModalProps> = ({ product, onSave, onClose }) => {
    const getInitialState = (): ProductFormState => {
        if (product) {
            return {
                ...product,
                quantity: product.quantity ?? '',
                buyingPrice: product.buyingPrice ?? '',
                sellingPrice: product.sellingPrice ?? '',
                gstRate: product.gstRate ?? '',
                lowStockThreshold: product.lowStockThreshold ?? ''
            };
        }
        return {
            name: "", sku: "", quantity: '', buyingPrice: '',
            sellingPrice: '', gstRate: '', image: '', lowStockThreshold: ''
        };
    };

    const [formData, setFormData] = useState<ProductFormState>(getInitialState);
    const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const readerId = "qr-reader-modal";

    useEffect(() => {
        if (isScannerOpen) {
            const scanner = new Html5Qrcode(readerId);
            scannerRef.current = scanner;
            const config = { fps: 10, qrbox: { width: 250, height: 250 } };

            scanner.start({ facingMode: "environment" }, config, (decodedText) => {
                setFormData(prev => ({ ...prev, sku: decodedText }));
                setIsScannerOpen(false);
            }, () => {}).catch(err => console.error("Unable to start scanning.", err));
        }

        return () => {
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop().catch(err => console.error("Failed to stop scanner.", err));
            }
        };
    }, [isScannerOpen]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
        }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleFormSubmit = () => {
        const dataToSave: ProductFormData = {
            ...formData,
            quantity: Number(formData.quantity) || 0,
            sellingPrice: Number(formData.sellingPrice) || 0,
            gstRate: Number(formData.gstRate) || 0,
            buyingPrice: Number(formData.buyingPrice) || 0,
            lowStockThreshold: Number(formData.lowStockThreshold) || undefined,
        };
        onSave(dataToSave, imageFile);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.3 }} className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#5a4fcf] to-[#7c6fdd] px-6 py-5 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{product?.id ? 'Edit Product' : 'Add New Product'}</h2>
                        <p className="text-purple-100 text-sm mt-0.5">{product?.id ? 'Update product details' : 'Fill in the information below'}</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
                      <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                    {isScannerOpen ? (
                        <div className="space-y-4">
                            <div id={readerId} className="w-full rounded-2xl overflow-hidden border-2 border-gray-200" />
                            <button onClick={() => setIsScannerOpen(false)} className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-colors">
                              Cancel Scan
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Product Image</label>
                                <div className="w-full h-44 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center cursor-pointer hover:border-[#5a4fcf] hover:bg-[#5a4fcf]/5 transition-all" onClick={() => fileInputRef.current?.click()}>
                                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                                    {imagePreview ? (
                                        <div className="relative w-full h-full"><Image src={imagePreview} alt="Product Preview" layout="fill" objectFit="contain" className="p-3 rounded-2xl" /></div>
                                    ) : (
                                        <div className="text-center text-gray-500">
                                          <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                          <p className="font-medium">Click to upload image</p>
                                          <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Product Name</label>
                                <input type="text" name="name" placeholder="Enter product name" className="w-full border-2 border-gray-200 px-4 py-3.5 rounded-xl focus:border-[#5a4fcf] focus:ring-4 focus:ring-[#5a4fcf]/10 transition-all outline-none font-medium" value={formData.name} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Product ID (SKU)</label>
                                <div className="relative">
                                    <input type="text" name="sku" placeholder="SKU, Barcode, or custom ID" className="w-full border-2 border-gray-200 px-4 py-3.5 pr-14 rounded-xl focus:border-[#5a4fcf] focus:ring-4 focus:ring-[#5a4fcf]/10 transition-all outline-none font-mono text-sm" value={formData.sku || ''} onChange={handleInputChange} />
                                    <button type="button" onClick={() => setIsScannerOpen(true)} className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#5a4fcf] to-[#7c6fdd] text-white rounded-xl hover:shadow-lg transition-all active:scale-95" aria-label="Scan barcode">
                                      <Camera className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Quantity</label>
                                    <input type="number" name="quantity" placeholder="e.g., 50" className="w-full border-2 border-gray-200 px-4 py-3.5 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none font-medium" value={formData.quantity} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5" title="Set a custom alert when quantity falls to this level. Leave blank to use the global setting.">
                                        Low Stock Alert
                                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                                    </label>
                                    <input
                                        type="number"
                                        name="lowStockThreshold"
                                        placeholder={`Default: ${LOW_STOCK_THRESHOLD}`}
                                        className="w-full border-2 border-gray-200 px-4 py-3.5 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none font-medium"
                                        value={formData.lowStockThreshold}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Selling Price</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-bold">₹</span>
                                        <input type="number" name="sellingPrice" placeholder="e.g., 199.99" className="w-full border-2 border-gray-200 pl-9 pr-4 py-3.5 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium" value={formData.sellingPrice} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">GST Rate</label>
                                    <div className="relative">
                                        <input type="number" name="gstRate" placeholder="e.g., 18" className="w-full border-2 border-gray-200 px-4 py-3.5 pr-12 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none font-medium" value={formData.gstRate} onChange={handleInputChange} />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 font-bold">%</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
                    <button onClick={onClose} className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleFormSubmit} className="px-6 py-3 bg-gradient-to-r from-[#5a4fcf] to-[#7c6fdd] text-white rounded-xl hover:shadow-lg font-semibold transition-all">
                      {product?.id ? 'Save Changes' : 'Add Product'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// --- MAIN INVENTORY COMPONENT ---
const Inventory: FC = () => {
    const { status: sessionStatus } = useSession();
    const [products, setProducts] = useState<Product[]>([]);
    const [fetchStatus, setFetchStatus] = useState<'loading' | 'succeeded' | 'failed'>('loading');
    const [error, setError] = useState<string | null>(null);
    const [modalState, setModalState] = useState<{ isOpen: boolean; product: ProductFormData | null }>({ isOpen: false, product: null });
    const [swipedProductId, setSwipedProductId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        if (sessionStatus === 'authenticated') {
            const fetchProducts = async () => {
                setFetchStatus('loading');
                try {
                    const response = await fetch('/api/products');
                    if (!response.ok) {
                      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch products' }));
                      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setProducts(Array.isArray(data) ? data : []);
                    setFetchStatus('succeeded');
                } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : String(err);
                    console.error("Error fetching products:", message);
                    setError(message);
                    setFetchStatus('failed');
                }
            };
            fetchProducts();
        } else if (sessionStatus === 'unauthenticated') {
            setProducts([]);
            setFetchStatus('succeeded');
        }
    }, [sessionStatus]);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleExcelUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event: ProgressEvent<FileReader>) => {
            if (!event.target?.result) return;
            try {
                const data = new Uint8Array(event.target.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const rows: ExcelRow[] = XLSX.utils.sheet_to_json(sheet);

                const uploadedProducts = rows.map((row) => ({
                    sku: String(row["Product ID"] || ""),
                    name: String(row["Product Name"] || ""),
                    quantity: Number(row["Quantity"]) || 0,
                    buyingPrice: Number(row["Buying Price"]) || 0,
                    sellingPrice: Number(row["Selling Price"]) || 0,
                    gstRate: Number(row["GST Rate"]) || 0,
                }));

                const response = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(uploadedProducts),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to upload products');
                }
                const allProducts: Product[] = await response.json();
                
                if (Array.isArray(allProducts)) {
                    setProducts(allProducts);
                    alert('Products uploaded successfully!');
                } else {
                     console.error("Error: Bulk upload API did not return an array.", allProducts);
                }
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : String(err);
                console.error("Error uploading products:", message);
                alert(`An error occurred during the upload: ${message}`);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleSaveProduct = async (productData: ProductFormData, imageFile: File | null) => {
        try {
            let imageUrl = productData.image || '';
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                const uploadResponse = await fetch('/api/upload', { method: 'POST', body: formData });
                const uploadData = await uploadResponse.json();
                if (!uploadResponse.ok || !uploadData.success) {
                    throw new Error(uploadData.message || 'Image upload failed');
                }
                imageUrl = uploadData.path;
            }

            const productToSave = { ...productData, image: imageUrl };
            const isEditing = !!productData.id;
            const url = isEditing ? `/api/products/${productData.id}` : '/api/products';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productToSave),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'create'} product`);
            }
            
            const savedData = await response.json();

            if (isEditing) {
                const savedProduct: Product = savedData;
                setProducts(prevProducts => 
                    prevProducts.map(p => 
                        p.id === savedProduct.id ? savedProduct : p
                    )
                );
            } else {
                if (Array.isArray(savedData)) {
                    setProducts(savedData);
                } else {
                    const newProduct: Product = savedData;
                    setProducts(prevProducts => [...prevProducts, newProduct]);
                }
            }

            setModalState({ isOpen: false, product: null });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error("Error saving product:", message);
            alert(`Failed to save product: ${message}`);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
                if (response.status !== 204) {
                  const errorData = await response.json().catch(() => ({ message: 'Failed to delete product' }));
                  throw new Error(errorData.message);
                }
                setProducts(products.filter((p) => p.id !== id));
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : String(err);
                console.error("Error deleting product:", message);
                alert(`Error deleting product: ${message}`);
            }
        }
        setSwipedProductId(null);
    };
    
    const renderContent = () => {
        if (sessionStatus === 'loading' || fetchStatus === 'loading') {
            return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#5a4fcf]" /> <span className="ml-2 text-gray-600 font-medium">Loading Products...</span></div>;
        }

        if (sessionStatus === 'unauthenticated') {
            return <div className="text-center h-64 flex flex-col justify-center items-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300"><Info className="w-10 h-10 mb-3 text-gray-400" /> <h3 className="font-bold text-lg text-gray-800">Please Log In</h3><p className="text-gray-500 mt-1">Log in to manage your inventory.</p></div>
        }

        if (fetchStatus === 'failed') {
            return <div className="flex flex-col items-center justify-center h-64 bg-red-50 text-red-700 rounded-2xl p-6 border-2 border-red-200"><AlertTriangle className="w-10 h-10 mb-3" /><strong className="text-lg">Error Loading Products</strong><p className="text-sm mt-1">{error}</p></div>;
        }

        if (products.length === 0) {
            return <div className="text-center h-64 flex flex-col justify-center items-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300"><Package className="w-10 h-10 mb-3 text-gray-400" /> <h3 className="font-bold text-lg text-gray-800">No Products Found</h3><p className="text-gray-500 mt-1">Click &quot;Add Product&quot; to get started.</p></div>
        }
        
        if (filteredProducts.length === 0) {
            return <div className="text-center h-64 flex flex-col justify-center items-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300"><Search className="w-10 h-10 mb-3 text-gray-400" /> <h3 className="font-bold text-lg text-gray-800">No Matching Products</h3><p className="text-gray-500 mt-1">Try a different search query.</p></div>
        }

        return (
            <>
                <DesktopProductTable products={filteredProducts} onEdit={(p) => setModalState({ isOpen: true, product: p })} onDelete={handleDeleteProduct} />
                <MobileProductList products={filteredProducts} swipedId={swipedProductId} onSwipe={setSwipedProductId} onEdit={(p) => setModalState({ isOpen: true, product: p })} onDelete={handleDeleteProduct} />
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                {/* Header Section */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-sm text-gray-600 mt-1">Search, upload, or manage your products</p>
                </div>

                {/* Search and Actions Bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by name or Product ID..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#5a4fcf]/10 focus:border-[#5a4fcf] outline-none font-medium transition-all" 
                        />
                    </div>
                    
                    {/* Desktop Action Buttons */}
                    <div className="hidden sm:flex items-center gap-3">
                        <label className="flex items-center cursor-pointer bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-md transition-all whitespace-nowrap">
                            <Upload className="w-4 h-4 mr-2" /> Upload Excel
                            <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
                        </label>
                        <button 
                            onClick={() => setModalState({ isOpen: true, product: null })} 
                            className="flex items-center gap-2 bg-gradient-to-r from-[#5a4fcf] to-[#7c6fdd] hover:shadow-lg text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" /> Add Product
                        </button>
                    </div>

                    {/* Mobile Action Buttons */}
                    <div className="flex sm:hidden gap-3">
                        <label className="flex-1 flex items-center justify-center cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-md transition-all">
                            <Upload className="w-4 h-4 mr-2" /> Excel
                            <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
                        </label>
                        <button 
                            onClick={() => setModalState({ isOpen: true, product: null })} 
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#5a4fcf] to-[#7c6fdd] hover:shadow-lg text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                        >
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="pb-6">
                    {renderContent()}
                </div>

                {/* Modal */}
                {modalState.isOpen && (
                    <ProductFormModal
                        product={modalState.product}
                        onSave={handleSaveProduct}
                        onClose={() => setModalState({ isOpen: false, product: null })}
                    />
                )}
            </div>
        </div>
    );
};

export default Inventory;


import connectMongoDB from '@/lib/mongodb';
import Sale from '@/models/Sales';

// Force dynamic rendering so it checks the DB every time (no caching)
export const dynamic = 'force-dynamic';

// ✅ FIX 1: Update PageProps to use Promise
interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

interface BillItem {
  name: string;
  quantity: number;
  price: number;
}

interface SaleData {
  _id: string;
  billId: string;
  amount: number;
  paymentMethod: string;
  createdAt: Date;
  expiresAt?: Date;
  items: BillItem[];
  publicToken?: string;
}

export default async function PublicBillPage(props: PageProps) {
  // ✅ FIX 2: Await the params before accessing them
  const params = await props.params;
  const { token } = params;

  await connectMongoDB();

  // Explicitly cast the result to 'SaleData | null'
  const sale = (await Sale.findOne({ publicToken: token }).lean()) as unknown as SaleData | null;

  // 2. Scenario: Bill Not Found
  if (!sale) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-sm w-full">
          <div className="text-red-500 mb-2 mx-auto h-12 w-12 flex items-center justify-center bg-red-50 rounded-full">
            ❌
          </div>
          <h1 className="text-xl font-bold text-gray-900">Bill Not Found</h1>
          <p className="text-gray-500 mt-2 text-sm">This bill does not exist or the link is invalid.</p>
        </div>
      </div>
    );
  }

  // 3. Scenario: Link Expired
  if (sale.expiresAt && new Date() > new Date(sale.expiresAt)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-sm w-full">
          <div className="text-orange-500 mb-4 mx-auto h-12 w-12 flex items-center justify-center bg-orange-50 rounded-full">
            ⚠️
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Link Expired</h1>
          <p className="text-gray-600 mt-2 text-sm">This receipt link has expired for security.</p>
        </div>
      </div>
    );
  }

  // Helper for Currency
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  // 4. Scenario: Success - Render the Receipt
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 flex justify-center items-start">
      <div className="w-full max-w-sm bg-white shadow-2xl overflow-hidden relative">
        
        {/* Top Decoration */}
        <div className="h-2 bg-[#5a4fcf] w-full"></div>

        <div className="p-6 relative">
          
          {/* Header */}
          <div className="text-center mb-8 border-b border-dashed border-gray-200 pb-6">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-50 text-[#5a4fcf] mb-3 text-xl">
              🧾
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Payment Receipt</h2>
            <p className="text-sm text-gray-500 mt-1">Order #{sale.billId}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(sale.createdAt).toLocaleString()}</p>
          </div>

          {/* --- LIST OF ITEMS --- */}
          <div className="mb-8">
            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">
              <span>Item Description</span>
              <span>Amount</span>
            </div>

            <div className="space-y-4">
              {sale.items && sale.items.length > 0 ? (
                sale.items.map((item: BillItem, i: number) => (
                  <div key={i} className="flex justify-between items-start text-sm">
                    <div className="pr-4">
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} x {formatMoney(item.price)}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900 whitespace-nowrap">
                      {formatMoney(item.price * item.quantity)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 text-sm py-4">No items found in this bill.</p>
              )}
            </div>
          </div>

          {/* Totals Section */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 border border-gray-100">
            <div className="flex justify-between items-center text-gray-600 text-sm">
              <span>Payment Method</span>
              <span className="font-medium capitalize">{sale.paymentMethod === 'qr-code' ? 'UPI / QR' : sale.paymentMethod}</span>
            </div>
            
            <div className="border-t border-gray-200 my-2"></div>

            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">Total Paid</span>
              <span className="text-2xl font-bold text-[#5a4fcf]">
                {formatMoney(sale.amount)}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 mb-2">Thank you for your business!</p>
            {sale.expiresAt && (
              <div className="inline-block bg-yellow-50 text-yellow-700 text-[10px] px-2 py-1 rounded border border-yellow-100">
                Link expires: {new Date(sale.expiresAt).toLocaleTimeString()}
              </div>
            )}
          </div>

        </div>

        {/* Bottom Jagged Edge Effect */}
        <div 
          className="h-4 w-full bg-gray-100"
          style={{
            backgroundImage: 'linear-gradient(45deg, #ffffff 25%, transparent 25%), linear-gradient(-45deg, #ffffff 25%, transparent 25%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0'
          }}
        ></div>
      </div>
    </div>
  );
}
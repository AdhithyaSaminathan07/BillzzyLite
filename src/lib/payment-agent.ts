// import PaytmChecksum from "paytmchecksum";

// // 🛡️ INTERNAL CONFIG (We use Paytm for now, but we can swap this function later)
// const PAYTM_ENV = "TEST"; 
// const URL = PAYTM_ENV === "PROD" 
//   ? "https://securegw.paytm.in/theia/api/v1/initiateTransaction" 
//   : "https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction";

// interface PaymentOrderParams {
//   orderId: string;
//   amount: number;
//   customerId: string;
//   merchantId: string;    // Common Name (MID)
//   merchantKey: string;   // Common Name (Secret Key)
//   callbackUrl: string;
// }

// // 🧠 THE AGENT FUNCTION
// // This function takes generic inputs and handles the specific provider logic
// export async function createPaymentOrder(params: PaymentOrderParams) {
//   try {
//     const { orderId, amount, customerId, merchantId, merchantKey, callbackUrl } = params;

//     // 1. Prepare the Provider Specific Data (Paytm style here)
//     const paytmParams: any = {};
//     paytmParams.body = {
//       requestType: "Payment",
//       mid: merchantId,
//       websiteName: "DEFAULT",
//       orderId: orderId,
//       callbackUrl: callbackUrl,
//       txnAmount: {
//         value: amount.toString(),
//         currency: "INR",
//       },
//       userInfo: {
//         custId: customerId,
//       },
//     };

//     // 2. Generate Security Signature
//     const checksum = await PaytmChecksum.generateSignature(
//       JSON.stringify(paytmParams.body),
//       merchantKey
//     );

//     paytmParams.head = {
//       signature: checksum,
//     };

//     // 3. Talk to the Provider
//     const response = await fetch(`${URL}?mid=${merchantId}&orderId=${orderId}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(paytmParams),
//     });

//     const data = await response.json();

//     // 4. Return a COMMON result structure
//     // We normalize the response so your frontend doesn't care it's Paytm
//     if (data.body.resultInfo.resultStatus === "S") {
//       return {
//         success: true,
//         token: data.body.txnToken, // The crucial token
//         provider: "paytm",
//         orderId: orderId
//       };
//     } else {
//       return {
//         success: false,
//         error: data.body.resultInfo.resultMsg
//       };
//     }

//   } catch (error: any) {
//     return { success: false, error: error.message };
//   }
// }



// // 🛡️ MOCK PAYMENT AGENT

// // Define the shape of our response so TypeScript stays happy
// interface PaymentResponse {
//   success: boolean;
//   token?: string;
//   provider?: string;
//   orderId?: string;
//   isMock?: boolean;
//   error?: string; // 👈 This fixes the "Property 'error' does not exist" issue
// }

// export async function createPaymentOrder(params: any): Promise<PaymentResponse> {
//   console.log("⚠️ [MOCK MODE] Simulating Payment Initiation...");
//   console.log("   Order ID:", params.orderId);

//   // Return a Fake Success Response
//   return {
//     success: true,
//     token: "MOCK_TOKEN_" + Math.random().toString(36).substring(7),
//     provider: "paytm",
//     orderId: params.orderId,
//     isMock: true 
//   };
// }

// 🛡️ MOCK PAYMENT AGENT

// Define the shape of our response so TypeScript stays happy
interface PaymentResponse {
  success: boolean;
  token?: string;
  provider?: string;
  orderId?: string;
  isMock?: boolean;
  error?: string; // 👈 This fixes the "Property 'error' does not exist" issue
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createPaymentOrder(params: any): Promise<PaymentResponse> {
  console.log("⚠️ [MOCK MODE] Simulating Payment Initiation...");
  console.log("   Order ID:", params.orderId);

  // Return a Fake Success Response
  return {
    success: true,
    token: "MOCK_TOKEN_" + Math.random().toString(36).substring(7),
    provider: "paytm",
    orderId: params.orderId,
    isMock: true 
  };
}
import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";

const PROCESSING_MS = 2800;
const CONFIRMING_MS = 1400;

const formatPaymentMethodLabel = (value) => {
  const map = {
    gcash: "GCash",
    card: "Credit / Debit Card",
    bank: "Bank Transfer",
  };
  const key = String(value || "").toLowerCase();
  return map[key] || "Online Payment";
};

export default function PaymentProcessing({ cartCount }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [stage, setStage] = useState("processing");

  const flowState = location.state || {};
  const isValidFlow = Boolean(flowState.fromCheckout);

  const orderData = useMemo(() => flowState.orderData || null, [flowState.orderData]);
  const paymentMethod = useMemo(() => flowState.paymentMethod || "gcash", [flowState.paymentMethod]);
  const orderTotal = useMemo(() => Number(flowState.orderTotal || 0), [flowState.orderTotal]);
  const itemCount = useMemo(() => Number(flowState.itemCount || 0), [flowState.itemCount]);

  useEffect(() => {
    if (!isValidFlow) return;

    const toConfirmed = window.setTimeout(() => {
      setStage("confirmed");
    }, PROCESSING_MS);

    const toCheckout = window.setTimeout(() => {
      const confirmedOrder = {
        ...(orderData || {}),
        payment_method: paymentMethod,
        payment_status: "completed",
        order_status: "online_payment_processed",
      };

      navigate("/Checkout", {
        replace: true,
        state: {
          checkoutSuccess: true,
          paymentConfirmed: true,
          orderData: confirmedOrder,
          orderTotal,
          itemCount,
        },
      });
    }, PROCESSING_MS + CONFIRMING_MS);

    return () => {
      window.clearTimeout(toConfirmed);
      window.clearTimeout(toCheckout);
    };
  }, [isValidFlow, itemCount, navigate, orderData, orderTotal, paymentMethod]);

  if (!isValidFlow) {
    return <Navigate to="/Checkout" replace />;
  }

  return (
    <div className="soucul-app checkout-page">
      <Navbar cartCount={cartCount} />
      <div className="checkout-processing-shell">
        <div className="checkout-processing-card">
          {stage === "processing" ? (
            <>
              <div className="checkout-processing-spinner" aria-hidden="true" />
              <h2>Payment is being processed...</h2>
              <p>Please wait while we confirm your online payment.</p>
            </>
          ) : (
            <>
              <div className="checkout-processing-confirmed-icon" aria-hidden="true">
                <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m8 12 2.5 2.5L16 9" />
                </svg>
              </div>
              <h2>Payment confirmed!</h2>
              <p>Redirecting you back to checkout...</p>
            </>
          )}

          <div className="checkout-processing-meta">
            <span>Payment Method: <strong>{formatPaymentMethodLabel(paymentMethod)}</strong></span>
            {itemCount > 0 && <span>Items: <strong>{itemCount}</strong></span>}
            {orderTotal > 0 && <span>Total: <strong>₱{orderTotal.toLocaleString()}</strong></span>}
            <span>Order #: <strong>{orderData?.order_number || "Pending"}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

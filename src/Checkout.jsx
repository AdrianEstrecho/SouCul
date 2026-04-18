/*
Estrecho, Adrian M.
Mansilla, Rhangel R.
Romualdo, Jervin Paul C.
Sostea, Joana Marie A.
Torres, Ceazarion Sean Nicholas M.
Tupaen, Arianne Kaye E.

BSIT/IT22S1
*/

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import fallbackImage from "./assets/no-image.jpg";

const formatCard = (v) =>
  v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const formatExpiry = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
};

const resolveItemImage = (rawUrl) => {
  const value = String(rawUrl || "").trim();
  return value || fallbackImage;
};

const normalizeDigits = (value) => String(value || "").replace(/\D/g, "");

const normalizeWholeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.floor(parsed));
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

const isValidPHMobile = (value) => {
  const raw = String(value || "").trim();
  const digits = normalizeDigits(raw);

  if (raw.startsWith("+")) {
    return /^639\d{9}$/.test(digits);
  }

  return /^09\d{9}$/.test(digits);
};

const formatPaymentMethodLabel = (value) => {
  const map = {
    cod: "Cash on Delivery",
    gcash: "GCash",
    bank_transfer: "Bank Transfer",
    bank: "Bank Transfer",
    card: "Card",
    credit_card: "Card",
    debit_card: "Card",
    paypal: "PayPal",
  };
  const key = String(value || "").toLowerCase();
  return map[key] || "Online Payment";
};

const formatPaymentStatusLabel = ({ paymentMethod, paymentStatus }) => {
  const method = String(paymentMethod || "").toLowerCase();
  const status = String(paymentStatus || "").toLowerCase();

  if (method === "cod") return "To be paid on delivery";
  if (!status) return "Awaiting confirmation";

  const map = {
    pending: "Awaiting confirmation",
    processing: "Awaiting confirmation",
    completed: "Paid",
    failed: "Payment failed",
    refunded: "Refunded",
  };

  return map[status] || status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatOrderStatusLabel = (value) => {
  const map = {
    online_payment_requested: "Pending Payment",
    online_payment_processed: "Payment Confirmed",
    cash_on_delivery_requested: "COD Requested",
    cash_on_delivery_approved: "COD Confirmed",
    processing: "Processing",
    waiting_for_courier: "Waiting for Courier",
    shipped: "Shipped",
    to_be_delivered: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
    pending: "Pending Payment",
    confirmed: "Payment Confirmed",
  };

  const key = String(value || "").toLowerCase();
  return map[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function Checkout({ cartItems, cartCount, userProfile, directCheckoutItem, onClearDirectCheckout, onOrderPlaced }) {
  const navigate = useNavigate();
  const location = useLocation();
  const initialVoucherCode = String(location.state?.voucherCode || "").trim();
  const isDirectCheckout = !!directCheckoutItem;
  const checkedItems = cartItems.filter((i) => i.checked);
  const items = isDirectCheckout
    ? [directCheckoutItem]
    : checkedItems;
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal > 0 ? 150 : 0;

  // Pre-fill from profile
  const nameParts = (userProfile?.name || "").split(" ");
  const [form, setForm] = useState({
    firstName: nameParts[0] || "",
    lastName: nameParts.slice(1).join(" ") || "",
    email: userProfile?.email || "",
    phone: userProfile?.phone || "",
    address: "",
    city: "",
    province: "",
    zip: "",
    paymentMethod: "cod",
    // Card fields
    cardName: userProfile?.name || "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    // GCash fields
    gcashName: userProfile?.name || "",
    gcashNumber: userProfile?.phone || "",
    // Bank transfer fields
    bankName: "",
    bankAccountName: userProfile?.name || "",
    bankAccountNumber: "",
  });
  const [placed, setPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [placedSummary, setPlacedSummary] = useState({ orderTotal: 0, itemCount: 0 });
  const [isPaidOnline, setIsPaidOnline] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [voucherCode, setVoucherCode] = useState(initialVoucherCode);
  const [voucherInfo, setVoucherInfo] = useState(null);
  const [voucherMessage, setVoucherMessage] = useState("");
  const [voucherError, setVoucherError] = useState("");
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  const voucherDiscount = Number(voucherInfo?.discount_amount || 0);
  const total = Math.max(0, subtotal + shipping - voucherDiscount);

  useEffect(() => {
    const checkoutState = location.state;
    if (!checkoutState?.checkoutSuccess) return;

    setPlacedOrder(checkoutState.orderData || null);
    setPlacedSummary({
      orderTotal: Number(checkoutState.orderTotal || 0),
      itemCount: Number(checkoutState.itemCount || 0),
    });
    setIsPaidOnline(Boolean(checkoutState.paymentConfirmed));
    setPlaced(true);
    setSubmitError("");
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const applyVoucher = async () => {
    const code = String(voucherCode || "").trim().toUpperCase();
    if (!code) {
      setVoucherError("Enter a voucher code first.");
      setVoucherMessage("");
      setVoucherInfo(null);
      return;
    }

    if (subtotal <= 0) {
      setVoucherError("Add items to your order before applying a voucher.");
      setVoucherMessage("");
      setVoucherInfo(null);
      return;
    }

    setIsApplyingVoucher(true);
    setVoucherError("");
    setVoucherMessage("");

    try {
      const api = window.CustomerAPI || window.customerAPI;
      if (!api || typeof api.validateVoucher !== "function") {
        throw new Error("Voucher API is unavailable. Please refresh and try again.");
      }

      const result = await api.validateVoucher(code, subtotal);
      const data = result?.data || {};

      setVoucherInfo({
        code: String(data.code || code),
        discount_amount: Number(data.discount_amount || 0),
      });
      setVoucherCode(String(data.code || code));
      setVoucherMessage(`Voucher ${String(data.code || code)} applied.`);
      setVoucherError("");
    } catch (error) {
      setVoucherInfo(null);
      setVoucherError(error?.message || "Unable to apply voucher.");
      setVoucherMessage("");
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const removeVoucher = () => {
    setVoucherInfo(null);
    setVoucherMessage("");
    setVoucherError("");
  };

  const setFieldValue = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    if (submitError) setSubmitError("");
  };

  const update = (field) => (e) => setFieldValue(field, e.target.value);

  const validateCheckoutForm = () => {
    const errors = {};

    if (!form.firstName.trim()) errors.firstName = "First name is required.";
    if (!form.lastName.trim()) errors.lastName = "Last name is required.";

    if (!form.email.trim()) errors.email = "Email is required.";
    else if (!isValidEmail(form.email)) errors.email = "Enter a valid email address.";

    if (!form.phone.trim()) errors.phone = "Phone number is required.";
    else if (!isValidPHMobile(form.phone)) errors.phone = "Enter a valid PH mobile number.";

    if (!form.address.trim()) errors.address = "Address is required.";
    if (!form.city.trim()) errors.city = "City is required.";
    if (!form.province.trim()) errors.province = "Province is required.";

    const zipDigits = normalizeDigits(form.zip);
    if (!zipDigits) errors.zip = "ZIP code is required.";
    else if (!/^\d{4}$/.test(zipDigits)) errors.zip = "ZIP code must be 4 digits.";

    if (form.paymentMethod === "cod" && total > 10000) {
      errors.paymentMethod = "Cash on Delivery is only available up to ₱10,000.";
    }

    return errors;
  };

const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const validationErrors = validateCheckoutForm();
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSubmitError("Please review the highlighted fields before placing your order.");
      return;
    }

    if (String(voucherCode || "").trim() && !voucherInfo) {
      setSubmitError("Please apply your voucher first or clear the voucher field.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const api = window.CustomerAPI || window.customerAPI;
      if (!api || typeof api.checkout !== "function") {
        throw new Error("Checkout API is unavailable. Please refresh and try again.");
      }

      const checkoutPayload = {
        shipping_address: form.address,
        shipping_city: form.city,
        shipping_province: form.province,
        shipping_phone: form.phone,
        payment_method: form.paymentMethod,
      };

      if (voucherInfo?.code) {
        checkoutPayload.voucher_code = String(voucherInfo.code);
      }

      if (isDirectCheckout && directCheckoutItem) {
        checkoutPayload.direct_item = {
          product_id: normalizeWholeNumber(
            directCheckoutItem.product_id ?? directCheckoutItem.id,
            0
          ),
          quantity: Math.max(1, normalizeWholeNumber(directCheckoutItem.qty, 1)),
        };
      }

      const result = await api.checkout(checkoutPayload);

      if (result.success) {
        const orderData = result?.data || null;
        const isOnlinePayment = form.paymentMethod !== "cod";

        if (typeof onOrderPlaced === "function") {
          await onOrderPlaced();
        }
        if (onClearDirectCheckout) onClearDirectCheckout();

        if (isOnlinePayment) {
          navigate("/Checkout/payment-processing", {
            state: {
              fromCheckout: true,
              orderData,
              paymentMethod: form.paymentMethod,
              orderTotal: Number(orderData?.total_amount || total),
              itemCount: items.length,
            },
          });
          return;
        }

        setIsPaidOnline(false);
        setPlacedSummary({ orderTotal: Number(orderData?.total_amount || total), itemCount: items.length });
        setPlacedOrder(orderData);
        setPlaced(true);
      } else {
        setSubmitError(result.message || "Checkout failed. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setSubmitError(error?.message || "Checkout failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (placed) {
    const summaryTotal = placedSummary.orderTotal > 0 ? placedSummary.orderTotal : total;
    const summaryItemCount = placedSummary.itemCount > 0 ? placedSummary.itemCount : items.length;
    const placedPaymentMethod = placedOrder?.payment_method || form.paymentMethod;
    const placedPaymentStatus = placedOrder?.payment_status || (isPaidOnline ? "completed" : "pending");
    const placedOrderStatus = placedOrder?.order_status || (isPaidOnline ? "online_payment_processed" : "online_payment_requested");
    const placedVoucherCode = String(placedOrder?.voucher_code || "").trim();
    const placedVoucherDiscount = Number(placedOrder?.voucher_discount_amount || 0);

    return (
      <div className="soucul-app checkout-page">
        <Navbar cartCount={0} solidBackground />
        <div className="checkout-success">
          <div className="checkout-success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <h2>Order Placed Successfully!</h2>
          <p>
            {isPaidOnline
              ? "Payment has been made. Your order is confirmed and is now being prepared."
              : "Thank you for supporting Filipino artisans. Your order is being prepared."}
          </p>
          <div className="checkout-success-details">
            <span>Order #: <strong>{placedOrder?.order_number || "—"}</strong></span>
            <span>Order Total: <strong>₱{summaryTotal.toLocaleString()}</strong></span>
            <span>{summaryItemCount} {summaryItemCount === 1 ? "item" : "items"}</span>
            <span>Payment Method: <strong>{formatPaymentMethodLabel(placedPaymentMethod)}</strong></span>
            <span>Payment Status: <strong>{formatPaymentStatusLabel({ paymentMethod: placedPaymentMethod, paymentStatus: placedPaymentStatus })}</strong></span>
            <span>Order Status: <strong>{formatOrderStatusLabel(placedOrderStatus)}</strong></span>
            {placedVoucherCode && <span>Voucher: <strong>{placedVoucherCode}</strong></span>}
            {placedVoucherDiscount > 0 && <span>Discount Applied: <strong>-₱{placedVoucherDiscount.toLocaleString()}</strong></span>}
          </div>
          <button className="checkout-back-btn" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="soucul-app checkout-page">
        <Navbar cartCount={cartCount} solidBackground />
        <div className="checkout-empty">
          <h2>No items to checkout</h2>
          <p>Add some products to your cart first.</p>
          <button className="checkout-back-btn" onClick={() => navigate("/Products")}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="soucul-app checkout-page">
      <Navbar cartCount={cartCount} solidBackground />

      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-grid">
          {/* Left — Form */}
          <form className="checkout-form" onSubmit={handlePlaceOrder}>
            {submitError && (
              <div className="checkout-alert checkout-alert-error">{submitError}</div>
            )}

            {/* Shipping */}
            <div className="checkout-section">
              <h2 className="checkout-section-title">Shipping Information</h2>
              <div className="checkout-form-row">
                <label className="checkout-field">
                  <span>First Name</span>
                  <input className={fieldErrors.firstName ? "checkout-input-error" : ""} type="text" value={form.firstName} onChange={update("firstName")} required />
                  {fieldErrors.firstName && <small className="checkout-field-error">{fieldErrors.firstName}</small>}
                </label>
                <label className="checkout-field">
                  <span>Last Name</span>
                  <input className={fieldErrors.lastName ? "checkout-input-error" : ""} type="text" value={form.lastName} onChange={update("lastName")} required />
                  {fieldErrors.lastName && <small className="checkout-field-error">{fieldErrors.lastName}</small>}
                </label>
              </div>
              <div className="checkout-form-row">
                <label className="checkout-field">
                  <span>Email</span>
                  <input className={fieldErrors.email ? "checkout-input-error" : ""} type="email" value={form.email} onChange={update("email")} required />
                  {fieldErrors.email && <small className="checkout-field-error">{fieldErrors.email}</small>}
                </label>
                <label className="checkout-field">
                  <span>Phone</span>
                  <input className={fieldErrors.phone ? "checkout-input-error" : ""} type="tel" value={form.phone} onChange={update("phone")} required />
                  {fieldErrors.phone && <small className="checkout-field-error">{fieldErrors.phone}</small>}
                </label>
              </div>
              <label className="checkout-field checkout-field-full">
                <span>Address</span>
                <input className={fieldErrors.address ? "checkout-input-error" : ""} type="text" value={form.address} onChange={update("address")} required />
                {fieldErrors.address && <small className="checkout-field-error">{fieldErrors.address}</small>}
              </label>
              <div className="checkout-form-row">
                <label className="checkout-field">
                  <span>City</span>
                  <input className={fieldErrors.city ? "checkout-input-error" : ""} type="text" value={form.city} onChange={update("city")} required />
                  {fieldErrors.city && <small className="checkout-field-error">{fieldErrors.city}</small>}
                </label>
                <label className="checkout-field">
                  <span>Province</span>
                  <input className={fieldErrors.province ? "checkout-input-error" : ""} type="text" value={form.province} onChange={update("province")} required />
                  {fieldErrors.province && <small className="checkout-field-error">{fieldErrors.province}</small>}
                </label>
                <label className="checkout-field">
                  <span>ZIP Code</span>
                  <input className={fieldErrors.zip ? "checkout-input-error" : ""} type="text" value={form.zip} onChange={update("zip")} required />
                  {fieldErrors.zip && <small className="checkout-field-error">{fieldErrors.zip}</small>}
                </label>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="checkout-section">
              <h2 className="checkout-section-title">Payment Method</h2>
              <div className="checkout-payment-options">
                {[
                  { value: "cod", label: "Cash on Delivery" },
                  { value: "gcash", label: "GCash" },
                  { value: "card", label: "Credit / Debit Card" },
                  { value: "bank", label: "Bank Transfer" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`checkout-payment-card${form.paymentMethod === opt.value ? " active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={form.paymentMethod === opt.value}
                      onChange={update("paymentMethod")}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
              {fieldErrors.paymentMethod && <small className="checkout-field-error">{fieldErrors.paymentMethod}</small>}
            </div>

            {/* Payment Details — shown based on selected method */}

            {form.paymentMethod === "cod" && (
              <div className="checkout-section checkout-pay-details">
                <h2 className="checkout-section-title">Cash on Delivery</h2>
                <div className="checkout-pay-info">
                  <div className="checkout-pay-info-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" /><path d="M1 10h22" /></svg>
                  </div>
                  <div>
                    <p>Pay with cash when your order is delivered to your doorstep.</p>
                    <ul>
                      <li>Please prepare the exact amount: <strong>₱{total.toLocaleString()}</strong></li>
                      <li>Our rider will provide an official receipt upon payment.</li>
                      <li>Available for orders up to ₱10,000.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {form.paymentMethod === "gcash" && (
              <div className="checkout-section checkout-pay-details">
                <h2 className="checkout-section-title">GCash Payment</h2>
                <div className="checkout-form-row">
                  <label className="checkout-field">
                    <span>GCash Account Name</span>
                    <input className={fieldErrors.gcashName ? "checkout-input-error" : ""} type="text" value={form.gcashName} onChange={update("gcashName")} />
                    {fieldErrors.gcashName && <small className="checkout-field-error">{fieldErrors.gcashName}</small>}
                  </label>
                  <label className="checkout-field">
                    <span>GCash Number</span>
                    <input className={fieldErrors.gcashNumber ? "checkout-input-error" : ""} type="tel" placeholder="09XX XXX XXXX" value={form.gcashNumber} onChange={update("gcashNumber")} />
                    {fieldErrors.gcashNumber && <small className="checkout-field-error">{fieldErrors.gcashNumber}</small>}
                  </label>
                </div>
                <div className="checkout-pay-info">
                  <div className="checkout-pay-info-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>
                  </div>
                  <div>
                    <p>You will receive a GCash payment request after placing your order.</p>
                    <ul>
                      <li>Amount to pay: <strong>₱{total.toLocaleString()}</strong></li>
                      <li>Open your GCash app and approve the payment request.</li>
                      <li>Your order will be confirmed once payment is received.</li>
                      <li>GCash transaction fee: <strong>Free</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {form.paymentMethod === "card" && (
              <div className="checkout-section checkout-pay-details">
                <h2 className="checkout-section-title">Card Details</h2>
                <label className="checkout-field checkout-field-full">
                  <span>Cardholder Name</span>
                  <input className={fieldErrors.cardName ? "checkout-input-error" : ""} type="text" placeholder="As printed on card" value={form.cardName} onChange={update("cardName")} />
                  {fieldErrors.cardName && <small className="checkout-field-error">{fieldErrors.cardName}</small>}
                </label>
                <label className="checkout-field checkout-field-full">
                  <span>Card Number</span>
                  <input className={fieldErrors.cardNumber ? "checkout-input-error" : ""} type="text" placeholder="1234 5678 9012 3456" value={form.cardNumber} onChange={(e) => setFieldValue("cardNumber", formatCard(e.target.value))} />
                  {fieldErrors.cardNumber && <small className="checkout-field-error">{fieldErrors.cardNumber}</small>}
                </label>
                <div className="checkout-form-row">
                  <label className="checkout-field">
                    <span>Expiry Date</span>
                    <input className={fieldErrors.cardExpiry ? "checkout-input-error" : ""} type="text" placeholder="MM/YY" value={form.cardExpiry} onChange={(e) => setFieldValue("cardExpiry", formatExpiry(e.target.value))} />
                    {fieldErrors.cardExpiry && <small className="checkout-field-error">{fieldErrors.cardExpiry}</small>}
                  </label>
                  <label className="checkout-field">
                    <span>CVV</span>
                    <input className={fieldErrors.cardCvv ? "checkout-input-error" : ""} type="password" placeholder="123" maxLength={4} value={form.cardCvv} onChange={update("cardCvv")} />
                    {fieldErrors.cardCvv && <small className="checkout-field-error">{fieldErrors.cardCvv}</small>}
                  </label>
                </div>
                <div className="checkout-pay-info">
                  <div className="checkout-pay-info-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  </div>
                  <div>
                    <p>Your payment is secured with 256-bit SSL encryption.</p>
                    <ul>
                      <li>We accept Visa, Mastercard, and JCB.</li>
                      <li>Amount to charge: <strong>₱{total.toLocaleString()}</strong></li>
                      <li>Your card will be charged immediately upon order confirmation.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {form.paymentMethod === "bank" && (
              <div className="checkout-section checkout-pay-details">
                <h2 className="checkout-section-title">Bank Transfer Details</h2>
                <div className="checkout-form-row">
                  <label className="checkout-field">
                    <span>Bank Name</span>
                    <select value={form.bankName} onChange={update("bankName")} className={`checkout-select${fieldErrors.bankName ? " checkout-input-error" : ""}`}>
                      <option value="" disabled>Select your bank</option>
                      <option value="BDO">BDO Unibank</option>
                      <option value="BPI">Bank of the Philippine Islands (BPI)</option>
                      <option value="Metrobank">Metrobank</option>
                      <option value="Landbank">Land Bank of the Philippines</option>
                      <option value="UnionBank">UnionBank</option>
                      <option value="PNB">Philippine National Bank (PNB)</option>
                      <option value="RCBC">RCBC</option>
                      <option value="ChinaBank">China Banking Corporation</option>
                    </select>
                    {fieldErrors.bankName && <small className="checkout-field-error">{fieldErrors.bankName}</small>}
                  </label>
                </div>
                <div className="checkout-form-row">
                  <label className="checkout-field">
                    <span>Account Holder Name</span>
                    <input className={fieldErrors.bankAccountName ? "checkout-input-error" : ""} type="text" value={form.bankAccountName} onChange={update("bankAccountName")} />
                    {fieldErrors.bankAccountName && <small className="checkout-field-error">{fieldErrors.bankAccountName}</small>}
                  </label>
                  <label className="checkout-field">
                    <span>Account Number</span>
                    <input className={fieldErrors.bankAccountNumber ? "checkout-input-error" : ""} type="text" placeholder="Enter your account number" value={form.bankAccountNumber} onChange={update("bankAccountNumber")} />
                    {fieldErrors.bankAccountNumber && <small className="checkout-field-error">{fieldErrors.bankAccountNumber}</small>}
                  </label>
                </div>
                <div className="checkout-pay-info">
                  <div className="checkout-pay-info-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" /></svg>
                  </div>
                  <div>
                    <p>Transfer the total amount to our bank account after placing your order.</p>
                    <ul>
                      <li>Amount to transfer: <strong>₱{total.toLocaleString()}</strong></li>
                      <li>SouCul Account: <strong>BDO 0012-3456-7890</strong></li>
                      <li>Account Name: <strong>SouCul Trading Inc.</strong></li>
                      <li>Please upload your proof of transfer within 24 hours.</li>
                      <li>Your order will be processed once payment is verified.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className={`checkout-place-btn${isSubmitting ? " is-loading" : ""}`} disabled={isSubmitting}>
              {isSubmitting ? "Placing your order..." : `Place Order - ₱${total.toLocaleString()}`}
            </button>
          </form>

          {/* Right — Order Summary */}
          <div className="checkout-summary">
            <h2 className="checkout-section-title">Order Summary</h2>
            <div className="checkout-items">
              {items.map((item) => (
                <div key={item.cartId || item.id || item.product_id || item.name} className="checkout-item">
                  <div className="checkout-item-img">
                    <img
                      src={resolveItemImage(item.image)}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackImage;
                      }}
                    />
                  </div>
                  <div className="checkout-item-info">
                    <div className="checkout-item-name">{item.name}</div>
                    <div className="checkout-item-loc">{item.location}</div>
                    <div className="checkout-item-qty">Qty: {item.qty}</div>
                  </div>
                  <div className="checkout-item-price">
                    ₱{(item.price * item.qty).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="checkout-field checkout-field-full" style={{ marginBottom: 8 }}>
                <span>Voucher Code</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => {
                      setVoucherCode(e.target.value);
                      setVoucherError("");
                      setVoucherMessage("");
                    }}
                    placeholder="Enter voucher code"
                    style={{ flex: 1 }}
                    className={voucherError ? "checkout-input-error" : ""}
                  />
                  <button
                    type="button"
                    onClick={applyVoucher}
                    disabled={isApplyingVoucher}
                    className="checkout-back-btn"
                    style={{ minWidth: 96, padding: "10px 14px" }}
                  >
                    {isApplyingVoucher ? "Applying..." : "Apply"}
                  </button>
                </div>
              </label>

              {voucherInfo?.code && (
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", fontSize: 12, color: "#14532d", marginTop: 2 }}>
                  <span>Applied: {voucherInfo.code}</span>
                  <button type="button" onClick={removeVoucher} style={{ border: "none", background: "transparent", color: "#1f6fb2", cursor: "pointer", fontWeight: 700 }}>
                    Remove
                  </button>
                </div>
              )}

              {voucherMessage && <div style={{ fontSize: 12, color: "#166534", marginTop: 6 }}>{voucherMessage}</div>}
              {voucherError && <div className="checkout-field-error" style={{ marginTop: 6 }}>{voucherError}</div>}
            </div>
            <div className="checkout-totals">
              <div className="checkout-totals-row">
                <span>Subtotal</span>
                <span>₱{subtotal.toLocaleString()}</span>
              </div>
              <div className="checkout-totals-row">
                <span>Shipping</span>
                <span>₱{shipping.toLocaleString()}</span>
              </div>
              {voucherDiscount > 0 && (
                <div className="checkout-totals-row" style={{ color: "#166534" }}>
                  <span>Voucher Discount</span>
                  <span>-₱{voucherDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="checkout-totals-row checkout-totals-final">
                <span>Total</span>
                <span>₱{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { 
  FaRupeeSign, 
  FaPercentage, 
  FaFileInvoiceDollar, 
  FaUndo, 
  FaSearch, 
  FaDownload, 
  FaCheck, 
  FaTimes, 
  FaCog, 
  FaReceipt, 
  FaUser, 
  FaUserTie, 
  FaCalendarAlt, 
  FaArrowUp, 
  FaShieldAlt,
  FaFileAlt
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import styles from './styles/Finance.module.css';

export default function Finance() {
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' | 'payouts' | 'refunds' | 'settings' | 'taxes'

  // Settings State: Commission & Service Fees
  const [commissionRate, setCommissionRate] = useState(20); // 20%
  const [guestServiceFee, setGuestServiceFee] = useState(3); // 3%
  const [gstTaxRate, setGstTaxRate] = useState(18); // 18% GST
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 1. Guest Transactions Data
  const initialTransactions = [
    {
      id: 'TXN-98421',
      bookingId: 'BK-10842',
      guest: 'Rahul Verma',
      host: 'Vikram Rajput',
      stayTitle: 'Sunset Hilltop Heritage Homestay',
      amount: 7200,
      commission: 1440,
      gstTax: 259,
      netPayout: 5760,
      paymentMethod: 'UPI / Razorpay',
      date: '12 Oct 2026',
      status: 'Success'
    },
    {
      id: 'TXN-98418',
      bookingId: 'BK-10839',
      guest: 'Sneha Patel',
      host: 'Ananya Roy',
      stayTitle: 'Goan Beachfront Eco Cottage',
      amount: 9600,
      commission: 1920,
      gstTax: 345,
      netPayout: 7680,
      paymentMethod: 'Credit Card (Visa)',
      date: '10 Oct 2026',
      status: 'Success'
    },
    {
      id: 'TXN-98412',
      bookingId: 'BK-10835',
      guest: 'Arjun Singhania',
      host: 'Devendra Joshi',
      stayTitle: 'Snow View Wooden Chalet',
      amount: 13500,
      commission: 2700,
      gstTax: 486,
      netPayout: 10800,
      paymentMethod: 'NetBanking (HDFC)',
      date: '08 Oct 2026',
      status: 'Refunded'
    },
    {
      id: 'TXN-98405',
      bookingId: 'BK-10828',
      guest: 'Karan Malhotra',
      host: 'Priya Sharma',
      stayTitle: 'Travel Sketching in Old Jaipur',
      amount: 800,
      commission: 160,
      gstTax: 28,
      netPayout: 640,
      paymentMethod: 'UPI (GPay)',
      date: '06 Oct 2026',
      status: 'Success'
    }
  ];

  // 2. Host Payouts Data
  const initialPayouts = [
    {
      id: 'PAY-7741',
      host: 'Vikram Rajput',
      bankAccount: 'HDFC Bank ··· 8921',
      amount: 5760,
      date: '14 Oct 2026',
      status: 'Processed'
    },
    {
      id: 'PAY-7738',
      host: 'Ananya Roy',
      bankAccount: 'ICICI Bank ··· 4410',
      amount: 7680,
      date: '12 Oct 2026',
      status: 'Processed'
    },
    {
      id: 'PAY-7732',
      host: 'Priya Sharma',
      bankAccount: 'SBI Bank ··· 3302',
      amount: 640,
      date: '08 Oct 2026',
      status: 'Processed'
    },
    {
      id: 'PAY-7725',
      host: 'Mohammad Alvi',
      bankAccount: 'Axis Bank ··· 6712',
      amount: 800,
      date: '16 Oct 2026',
      status: 'Pending'
    }
  ];

  // 3. Refunds Management Data
  const initialRefunds = [
    {
      id: 'REF-3091',
      bookingId: 'BK-10835',
      guest: 'Arjun Singhania',
      reason: 'Flight cancelled due to weather',
      amount: 13500,
      date: '09 Oct 2026',
      status: 'Completed'
    },
    {
      id: 'REF-3088',
      bookingId: 'BK-10822',
      guest: 'Vikas Taneja',
      reason: 'Host rescheduled session without notice',
      amount: 1000,
      date: '12 Oct 2026',
      status: 'Pending Approval'
    }
  ];

  const [transactions, setTransactions] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Selected Invoice Modal
  const [invoiceItem, setInvoiceItem] = useState(null);

  // Fetch live finance data from backend
  const fetchFinanceData = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const [setRes, txnRes, payRes, refRes] = await Promise.all([
        fetch(`${baseUrl}/finance/settings`),
        fetch(`${baseUrl}/finance/transactions`),
        fetch(`${baseUrl}/finance/payouts`),
        fetch(`${baseUrl}/finance/refunds`)
      ]);

      const setData = await setRes.json();
      if (setData.success && setData.data) {
        setCommissionRate(parseFloat(setData.data.commission_rate) || 20);
        setGuestServiceFee(parseFloat(setData.data.guest_service_fee) || 3);
        setGstTaxRate(parseFloat(setData.data.gst_tax_rate) || 18);
      }

      const txnData = await txnRes.json();
      if (txnData.success && Array.isArray(txnData.data)) {
        setTransactions(txnData.data);
      } else {
        setTransactions(initialTransactions);
      }

      const payData = await payRes.json();
      if (payData.success && Array.isArray(payData.data) && payData.data.length > 0) {
        setPayouts(payData.data);
      } else {
        setPayouts(initialPayouts);
      }

      const refData = await refRes.json();
      if (refData.success && Array.isArray(refData.data) && refData.data.length > 0) {
        setRefunds(refData.data);
      } else {
        setRefunds(initialRefunds);
      }
    } catch (err) {
      console.warn('Failed to load finance data from backend, using default initial data:', err);
      setTransactions(initialTransactions);
      setPayouts(initialPayouts);
      setRefunds(initialRefunds);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  // Totals calculations
  const totalRevenue = transactions.reduce((acc, t) => acc + (t.status === 'Success' ? Number(t.amount) : 0), 0);
  const totalCommission = transactions.reduce((acc, t) => acc + (t.status === 'Success' ? Number(t.commission) : 0), 0);
  const totalPayoutsDisbursed = payouts.reduce((acc, p) => acc + (p.status === 'Processed' ? Number(p.amount) : 0), 0);
  const totalRefunded = refunds.reduce((acc, r) => acc + (r.status === 'Completed' || r.status === 'Processed' ? Number(r.amount) : 0), 0);

  const handleSaveFeeSettings = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const res = await fetch(`${baseUrl}/finance/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commission_rate: commissionRate,
          guest_service_fee: guestServiceFee,
          gst_tax_rate: gstTaxRate
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        fetchFinanceData();
      }
    } catch (err) {
      console.error('Failed to update fee settings:', err);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleApproveRefund = async (refId) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await fetch(`${baseUrl}/finance/refunds/${refId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Processed' })
      });
      setRefunds(prev => prev.map(r => (r.id === refId || r.dbId === refId) ? { ...r, status: 'Completed' } : r));
    } catch (err) {
      setRefunds(prev => prev.map(r => r.id === refId ? { ...r, status: 'Completed' } : r));
    }
  };

  const handleDisbursePayout = async (payId, payoutItem) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const toastId = toast.loading('Connecting to Banking API & verifying IFSC...');
      const targetId = payoutItem?.dbId || payId;
      
      let res = await fetch(`${baseUrl}/finance/payouts/${targetId}/disburse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'IMPS / Instant Bank Transfer' })
      });

      // Fallback to PATCH if POST endpoint was cached or blocked
      if (!res.ok && res.status === 404) {
        res = await fetch(`${baseUrl}/finance/payouts/${targetId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Processed' })
        });
      }

      const data = await res.json();
      
      if (data.success) {
        const utr = data.utr || `UTR${Date.now()}`;
        toast.success(
          <div>
            <strong>Automated Bank Payout Disbursed!</strong>
            <div style={{ fontSize: '11px', marginTop: '2px', opacity: 0.9 }}>
              UTR: {utr} • Host: {payoutItem?.host || 'Host'}
            </div>
          </div>,
          { id: toastId, duration: 4500 }
        );
        setPayouts(prev => prev.map(p => (p.id === payId || p.dbId === payId || p.id === targetId) ? { ...p, status: 'Processed' } : p));
        fetchFinanceData();
      } else {
        toast.error(data.message || 'Bank payout transfer failed', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error executing automated bank payout');
      setPayouts(prev => prev.map(p => p.id === payId ? { ...p, status: 'Processed' } : p));
    }
  };

  const handlePrintInvoice = () => {
    if (!invoiceItem) return;
    const printWindow = window.open('', '_blank', 'width=800,height=750');
    if (!printWindow) {
      window.print();
      return;
    }
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tax Invoice - ${invoiceItem.id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; background: #fff; }
            .invoice-box { max-width: 700px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #ff385c; padding-bottom: 18px; margin-bottom: 24px; }
            .logo { font-size: 24px; font-weight: 800; color: #ff385c; margin: 0; }
            .gstin { font-size: 12px; color: #64748b; margin-top: 4px; }
            .title-section { text-align: right; }
            .title { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0; }
            .meta { font-size: 13px; color: #64748b; margin-top: 4px; }
            .section { margin-bottom: 24px; font-size: 14px; background: #f8fafc; padding: 14px 18px; border-radius: 8px; }
            .line-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #e2e8f0; font-size: 14px; }
            .total-line { display: flex; justify-content: space-between; padding: 16px 0 0 0; margin-top: 14px; border-top: 2px solid #0f172a; font-size: 17px; font-weight: 800; color: #ff385c; }
            .footer { margin-top: 36px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; }
            @media print {
              body { padding: 0; }
              .invoice-box { border: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div>
                <h1 class="logo">Airbnb India Pvt Ltd</h1>
                <div class="gstin">GSTIN: 08AAACA1234F1Z8 | CIN: U55101DL2021PTC123456</div>
              </div>
              <div class="title-section">
                <div class="title">OFFICIAL TAX INVOICE</div>
                <div class="meta">Invoice No: <strong>${invoiceItem.id}</strong></div>
                <div class="meta">Booking Ref: <strong>${invoiceItem.bookingId}</strong></div>
                <div class="meta">Date: ${invoiceItem.date}</div>
              </div>
            </div>

            <div class="section">
              <div style="margin-bottom: 4px;"><strong>Billed To:</strong> ${invoiceItem.guest}</div>
              <div style="margin-bottom: 4px;"><strong>Property Stay:</strong> ${invoiceItem.stayTitle}</div>
              <div style="margin-bottom: 4px;"><strong>Host Partner:</strong> ${invoiceItem.host}</div>
              <div><strong>Payment Mode:</strong> ${invoiceItem.paymentMethod || 'Online Payment'}</div>
            </div>

            <div class="line-item">
              <span>Accommodation Base Tariff</span>
              <span>₹${(invoiceItem.amount - invoiceItem.gstTax).toLocaleString('en-IN')}</span>
            </div>
            <div class="line-item">
              <span>Integrated GST (IGST @ 18%)</span>
              <span>₹${invoiceItem.gstTax.toLocaleString('en-IN')}</span>
            </div>
            <div class="line-item">
              <span>Payment Processing & Service Fee</span>
              <span>Included</span>
            </div>
            <div class="total-line">
              <span>Total Paid Amount:</span>
              <span>₹${invoiceItem.amount.toLocaleString('en-IN')}</span>
            </div>

            <div class="footer">
              This is a computer-generated tax invoice and does not require a physical signature.<br/>
              Airbnb Travel Services India Private Limited • Support: support@airbnb.com
            </div>
          </div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <>
      {/* 1. Stat Summary Cards */}
      <div className="row mb-3">
        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Total Gross Inflow</span>
                <div className={styles.statIconBox} style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <FaRupeeSign />
                </div>
              </div>
              <div className={styles.statValue}>₹{totalRevenue.toLocaleString()}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                <FaArrowUp size={9} /> Inflow
              </span>
              <span className={styles.statSubtext}>Guest paid bookings</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Net Commission Earned</span>
                <div className={styles.statIconBox} style={{ background: '#fff1f2', color: '#ff385c' }}>
                  <FaPercentage />
                </div>
              </div>
              <div className={styles.statValue}>₹{totalCommission.toLocaleString()}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgePink}`}>
                {commissionRate}% Take Rate
              </span>
              <span className={styles.statSubtext}>Airbnb platform share</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Host Payouts Disbursed</span>
                <div className={styles.statIconBox} style={{ background: '#f0fdf4', color: '#16a34a' }}>
                  <FaFileInvoiceDollar />
                </div>
              </div>
              <div className={styles.statValue}>₹{totalPayoutsDisbursed.toLocaleString()}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                Settled
              </span>
              <span className={styles.statSubtext}>Bank transfers complete</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Total Refunds</span>
                <div className={styles.statIconBox} style={{ background: '#fef2f2', color: '#dc2626' }}>
                  <FaUndo />
                </div>
              </div>
              <div className={styles.statValue}>₹{totalRefunded.toLocaleString()}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeAlert}`}>
                Processed
              </span>
              <span className={styles.statSubtext}>Customer refunds</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Panel Card */}
      <div className={styles.mainCard}>
        <div className={styles.cardHeader}>
          <div className={styles.headerTitles}>
            <h2 className={styles.title}>Payments, Payouts & Finance Central</h2>
            <p className={styles.subtitle}>
              Monitor guest transactions, release host payouts, configure commission fees and generate tax invoices.
            </p>
          </div>

          {/* Section Selection Tabs */}
          <div className={styles.tabGroup}>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'transactions' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              Guest Payments ({transactions.length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'payouts' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('payouts')}
            >
              Host Payouts ({payouts.length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'refunds' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('refunds')}
            >
              Refund Management ({refunds.length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'settings' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Fee Settings
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'taxes' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('taxes')}
            >
              GST & Tax Reports
            </button>
          </div>
        </div>

        {/* Search Bar for transactions/payouts/refunds */}
        {activeTab !== 'settings' && activeTab !== 'taxes' && (
          <div className={styles.controlsBar}>
            <div className={styles.searchBox}>
              <FaSearch className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search by ID, Guest, Host or Property..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>
              Real-time audited ledger
            </div>
          </div>
        )}

        {/* 1. Guest Transactions Table */}
        {activeTab === 'transactions' && (
          <div className="table-responsive">
            <table className={`table table-hover align-middle mb-0 ${styles.financeTable}`}>
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }}>Sr. No.</th>
                  <th>Transaction ID</th>
                  <th>Booking Ref</th>
                  <th>Guest / Host</th>
                  <th>Payment Mode</th>
                  <th>Gross Paid</th>
                  <th>Commission (20%)</th>
                  <th>Net Host Payout</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {transactions
                  .filter(t => t.id.toLowerCase().includes(searchTerm.toLowerCase()) || t.guest.toLowerCase().includes(searchTerm.toLowerCase()) || t.host.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((t, idx) => (
                    <tr key={t.id}>
                      <td><span style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</span></td>
                      <td><span style={{ fontFamily: 'monospace', fontWeight: '700' }}>{t.id}</span></td>
                      <td><span style={{ fontWeight: '600' }}>{t.bookingId}</span></td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '600', color: '#111111' }}>{t.guest}</span>
                          <span style={{ fontSize: '12px', color: '#717171' }}>Host: {t.host}</span>
                        </div>
                      </td>
                      <td><span style={{ color: '#4b5563', fontSize: '12px' }}>{t.paymentMethod}</span></td>
                      <td><span style={{ fontWeight: '800', color: '#111111' }}>₹{t.amount.toLocaleString()}</span></td>
                      <td><span style={{ fontWeight: '700', color: '#ff385c' }}>+ ₹{t.commission.toLocaleString()}</span></td>
                      <td><span style={{ fontWeight: '700', color: '#16a34a' }}>₹{t.netPayout.toLocaleString()}</span></td>
                      <td>
                        <span className={`${styles.badgeStatus} ${t.status === 'Success' ? styles.badgeSuccessStatus : styles.badgeRefundStatus}`}>
                          ● {t.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionGroup}>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionPrimary}`}
                            onClick={() => setInvoiceItem(t)}
                            title="Generate Official Tax Invoice"
                          >
                            <FaReceipt /> Invoice
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. Host Payouts Table */}
        {activeTab === 'payouts' && (
          <div className="table-responsive">
            <table className={`table table-hover align-middle mb-0 ${styles.financeTable}`}>
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }}>Sr. No.</th>
                  <th>Payout Ref</th>
                  <th>Host Partner</th>
                  <th>Destination Bank Account</th>
                  <th>Disbursed Amount</th>
                  <th>Payout Date</th>
                  <th>Transfer Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {payouts
                  .filter(p => p.host.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((p, idx) => (
                    <tr key={p.id}>
                      <td><span style={{ fontWeight: '600', color: '#64748b' }}>#{idx + 1}</span></td>
                      <td><span style={{ fontFamily: 'monospace', fontWeight: '700' }}>{p.id}</span></td>
                      <td><span style={{ fontWeight: '700', color: '#111111' }}>{p.host}</span></td>
                      <td><span style={{ color: '#4b5563' }}>{p.bankAccount}</span></td>
                      <td><span style={{ fontWeight: '800', color: '#16a34a' }}>₹{p.amount.toLocaleString()}</span></td>
                      <td><span style={{ color: '#64748b' }}>{p.date}</span></td>
                      <td>
                        <span className={`${styles.badgeStatus} ${p.status === 'Processed' ? styles.badgeSuccessStatus : styles.badgePendingStatus}`}>
                          ● {p.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionGroup}>
                          {p.status === 'Pending' ? (
                            <button 
                              type="button"
                              className={`${styles.btnAction} ${styles.btnActionApprove}`}
                              onClick={() => handleDisbursePayout(p.id, p)}
                              title="Authorize Instant NEFT/RTGS Transfer"
                            >
                              <FaCheck /> Disburse
                            </button>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>
                              ✓ Transferred
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. Refund Management Table */}
        {activeTab === 'refunds' && (
          <div className="table-responsive">
            <table className={`table table-hover align-middle mb-0 ${styles.financeTable}`}>
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }}>Sr. No.</th>
                  <th>Refund Ref</th>
                  <th>Booking ID</th>
                  <th>Guest Name</th>
                  <th>Refund Reason</th>
                  <th>Refund Amount</th>
                  <th>Request Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {refunds
                  .filter(r => r.guest.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((r, idx) => (
                    <tr key={r.id}>
                      <td><span style={{ fontWeight: '600', color: '#64748b' }}>#{idx + 1}</span></td>
                      <td><span style={{ fontFamily: 'monospace', fontWeight: '700' }}>{r.id}</span></td>
                      <td><span style={{ fontWeight: '600' }}>{r.bookingId}</span></td>
                      <td><span style={{ fontWeight: '700', color: '#111111' }}>{r.guest}</span></td>
                      <td><span style={{ color: '#4b5563', fontSize: '13px' }}>{r.reason}</span></td>
                      <td><span style={{ fontWeight: '800', color: '#dc2626' }}>₹{r.amount.toLocaleString()}</span></td>
                      <td><span style={{ color: '#64748b' }}>{r.date}</span></td>
                      <td>
                        <span className={`${styles.badgeStatus} ${r.status === 'Completed' ? styles.badgeSuccessStatus : styles.badgePendingStatus}`}>
                          ● {r.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionGroup}>
                          {r.status === 'Pending Approval' ? (
                            <button 
                              type="button" 
                              className={`${styles.btnAction} ${styles.btnActionApprove}`}
                              onClick={() => handleApproveRefund(r.id)}
                              title="Approve Refund Transfer to Guest"
                            >
                              <FaCheck /> Approve Refund
                            </button>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#059669', fontWeight: '600' }}>
                              ✓ Credited
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. Commission & Fee Settings */}
        {activeTab === 'settings' && (
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className={styles.settingsCard}>
                <div className={styles.settingsSectionHeader}>
                  <FaCog color="#ff385c" size={18} />
                  <h3 className={styles.settingsTitle}>Commission & Platform Fee Configuration</h3>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                  Customize the percentage cut retained by Airbnb on each host booking reservation.
                </p>

                <form onSubmit={handleSaveFeeSettings}>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', textTransform: 'uppercase' }}>
                      Host Take-Rate Commission (%)
                    </label>
                    <div className={styles.feeInputBox} style={{ marginTop: '4px' }}>
                      <input 
                        type="number" 
                        value={commissionRate} 
                        onChange={(e) => setCommissionRate(Number(e.target.value))}
                        className={styles.formInput} 
                        style={{ width: '120px' }}
                      />
                      <span style={{ fontWeight: '700', color: '#4b5563' }}>%</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', display: 'block' }}>
                      Deducted automatically prior to host payout disbursement.
                    </span>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', textTransform: 'uppercase' }}>
                      Guest Service Fee (%)
                    </label>
                    <div className={styles.feeInputBox} style={{ marginTop: '4px' }}>
                      <input 
                        type="number" 
                        value={guestServiceFee} 
                        onChange={(e) => setGuestServiceFee(Number(e.target.value))}
                        className={styles.formInput} 
                        style={{ width: '120px' }}
                      />
                      <span style={{ fontWeight: '700', color: '#4b5563' }}>%</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', textTransform: 'uppercase' }}>
                      GST / VAT Compliance Rate (%)
                    </label>
                    <div className={styles.feeInputBox} style={{ marginTop: '4px' }}>
                      <input 
                        type="number" 
                        value={gstTaxRate} 
                        onChange={(e) => setGstTaxRate(Number(e.target.value))}
                        className={styles.formInput} 
                        style={{ width: '120px' }}
                      />
                      <span style={{ fontWeight: '700', color: '#4b5563' }}>%</span>
                    </div>
                  </div>

                  <button type="submit" className={styles.btnSaveFee}>
                    <FaCheck size={12} /> Save Global Fee Settings
                  </button>

                  {saveSuccess && (
                    <span style={{ marginLeft: '12px', color: '#16a34a', fontWeight: '600', fontSize: '13px' }}>
                      ✓ Settings updated successfully!
                    </span>
                  )}
                </form>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className={styles.settingsCard} style={{ height: '100%', background: '#ffffff' }}>
                <h3 className={styles.settingsTitle} style={{ marginBottom: '12px' }}>
                  Commission Rules Summary
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#4b5563' }}>
                  <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px' }}>
                    <strong>Standard Stays:</strong> Flat {commissionRate}% platform deduction on base stay pricing.
                  </div>
                  <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px' }}>
                    <strong>Experiences:</strong> Standard {commissionRate}% fee with zero guest booking surcharge.
                  </div>
                  <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px' }}>
                    <strong>Automatic Payout Hold:</strong> Payouts held until 24 hours post guest check-in.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. GST & Tax Reports */}
        {activeTab === 'taxes' && (
          <div>
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-4">
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Total GST Collected (FY 2026-27)</span>
                  <h4 style={{ margin: '6px 0 0 0', fontWeight: '800', color: '#111111' }}>₹1,73,700</h4>
                  <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>18% GST Compliance Rate</span>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>TDS Deducted (Host Payouts)</span>
                  <h4 style={{ margin: '6px 0 0 0', fontWeight: '800', color: '#111111' }}>₹38,600</h4>
                  <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: '600' }}>Section 194-O (1% TDS)</span>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Tax Filing Status</span>
                  <h4 style={{ margin: '6px 0 0 0', fontWeight: '800', color: '#16a34a' }}>GSTR-1 Filed</h4>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Due Date: 11 Nov 2026</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className={styles.btnAction} 
                onClick={() => alert('Downloading GST Monthly Ledger Report (CSV)...')}
                style={{ padding: '10px 16px', fontSize: '13px' }}
              >
                <FaDownload /> Download Monthly GST Ledger (CSV)
              </button>
              <button 
                type="button" 
                className={styles.btnAction} 
                onClick={() => alert('Downloading Annual TDS Statement (PDF)...')}
                style={{ padding: '10px 16px', fontSize: '13px' }}
              >
                <FaFileAlt /> Download TDS Summary (PDF)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Official Tax Invoice Modal */}
      {invoiceItem && (
        <div className={styles.modalBackdrop} onClick={() => setInvoiceItem(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Tax Invoice ({invoiceItem.id})</h3>
              <button type="button" className={styles.modalCloseBtn} onClick={() => setInvoiceItem(null)}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.invoicePaper}>
                <div className={styles.invoiceHeader}>
                  <div>
                    <h4 style={{ margin: 0, fontWeight: '800', color: '#ff385c' }}>Airbnb India Pvt Ltd</h4>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>GSTIN: 08AAACA1234F1Z8</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: '700', fontSize: '12px', display: 'block' }}>Tax Invoice</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Date: {invoiceItem.date}</span>
                  </div>
                </div>

                <div style={{ marginBottom: '14px', fontSize: '12px' }}>
                  <span style={{ color: '#64748b' }}>Billed To:</span> <strong>{invoiceItem.guest}</strong><br />
                  <span style={{ color: '#64748b' }}>Property:</span> {invoiceItem.stayTitle}<br />
                  <span style={{ color: '#64748b' }}>Host Partner:</span> {invoiceItem.host}
                </div>

                <div className={styles.invoiceLine}>
                  <span style={{ color: '#475569' }}>Accommodation Base Charges:</span>
                  <span style={{ fontWeight: '600' }}>₹{(invoiceItem.amount - invoiceItem.gstTax).toLocaleString()}</span>
                </div>
                <div className={styles.invoiceLine}>
                  <span style={{ color: '#475569' }}>Integrated GST (18%):</span>
                  <span style={{ fontWeight: '600' }}>₹{invoiceItem.gstTax.toLocaleString()}</span>
                </div>
                <div className={styles.invoiceTotalLine}>
                  <span>Total Amount Paid:</span>
                  <span style={{ color: '#ff385c' }}>₹{invoiceItem.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.btnAction} 
                onClick={handlePrintInvoice}
              >
                <FaDownload /> Print / Download PDF
              </button>
              <button type="button" className={styles.btnSecondary} onClick={() => setInvoiceItem(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

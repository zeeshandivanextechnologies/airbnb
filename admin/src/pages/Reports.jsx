import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { 
  FaChartLine, 
  FaRupeeSign, 
  FaCalendarCheck, 
  FaUserPlus, 
  FaFileExcel, 
  FaFilePdf, 
  FaCalendarAlt, 
  FaArrowUp, 
  FaDownload, 
  FaFilter, 
  FaCheck, 
  FaInfoCircle, 
  FaEye, 
  FaHome, 
  FaClock 
} from 'react-icons/fa';
import styles from './styles/Reports.module.css';

// Monthly Financial Revenue Report Data
const REVENUE_DATA = [
  { id: 1, month: 'October 2026 (MTD)', grossVolume: 4280000, hostPayouts: 3638000, platformCommission: 428000, gstCollected: 77040, netProfit: 350960, growth: '+18.4%' },
  { id: 2, month: 'September 2026', grossVolume: 3950000, hostPayouts: 3357500, platformCommission: 395000, gstCollected: 71100, netProfit: 323900, growth: '+14.2%' },
  { id: 3, month: 'August 2026', grossVolume: 3720000, hostPayouts: 3162000, platformCommission: 372000, gstCollected: 66960, netProfit: 305040, growth: '+12.1%' },
  { id: 4, month: 'July 2026', grossVolume: 3410000, hostPayouts: 2898500, platformCommission: 341000, gstCollected: 61380, netProfit: 279620, growth: '+9.8%' },
  { id: 5, month: 'June 2026', grossVolume: 3150000, hostPayouts: 2677500, platformCommission: 315000, gstCollected: 56700, netProfit: 258300, growth: '+11.5%' },
  { id: 6, month: 'May 2026', grossVolume: 2890000, hostPayouts: 2456500, platformCommission: 289000, gstCollected: 52020, netProfit: 236980, growth: '+8.2%' }
];

// Booking Trends Report Data
const BOOKINGS_DATA = [
  { id: 1, period: 'Oct 2026 (MTD)', totalBookings: 842, completedStays: 620, upcomingStays: 198, cancellations: 24, avgNightsPerStay: 3.4, avgOrderValue: 5083, disputeRate: '0.4%' },
  { id: 2, period: 'Sep 2026', totalBookings: 790, completedStays: 742, upcomingStays: 12, cancellations: 36, avgNightsPerStay: 3.2, avgOrderValue: 5000, disputeRate: '0.6%' },
  { id: 3, period: 'Aug 2026', totalBookings: 745, completedStays: 702, upcomingStays: 8, cancellations: 35, avgNightsPerStay: 3.1, avgOrderValue: 4993, disputeRate: '0.5%' },
  { id: 4, period: 'Jul 2026', totalBookings: 692, completedStays: 651, upcomingStays: 5, cancellations: 36, avgNightsPerStay: 3.0, avgOrderValue: 4927, disputeRate: '0.7%' },
  { id: 5, period: 'Jun 2026', totalBookings: 640, completedStays: 605, upcomingStays: 3, cancellations: 32, avgNightsPerStay: 2.9, avgOrderValue: 4921, disputeRate: '0.6%' },
  { id: 6, period: 'May 2026', totalBookings: 590, completedStays: 558, upcomingStays: 2, cancellations: 30, avgNightsPerStay: 2.8, avgOrderValue: 4898, disputeRate: '0.8%' }
];

// User & Host Growth Report Data
const USER_GROWTH_DATA = [
  { id: 1, period: 'Oct 2026 (MTD)', newGuests: 1420, newHosts: 86, totalActiveUsers: 28450, kycVerificationRate: '94.2%', repeatGuestShare: '36.8%', growthRate: '+19.2%' },
  { id: 2, period: 'Sep 2026', newGuests: 1280, newHosts: 74, totalActiveUsers: 26944, kycVerificationRate: '93.5%', repeatGuestShare: '34.2%', growthRate: '+16.5%' },
  { id: 3, period: 'Aug 2026', newGuests: 1190, newHosts: 68, totalActiveUsers: 25590, kycVerificationRate: '92.8%', repeatGuestShare: '33.1%', growthRate: '+15.1%' },
  { id: 4, period: 'Jul 2026', newGuests: 1080, newHosts: 61, totalActiveUsers: 24332, kycVerificationRate: '92.0%', repeatGuestShare: '31.5%', growthRate: '+13.8%' },
  { id: 5, period: 'Jun 2026', newGuests: 980, newHosts: 55, totalActiveUsers: 23191, kycVerificationRate: '91.4%', repeatGuestShare: '30.2%', growthRate: '+12.4%' },
  { id: 6, period: 'May 2026', newGuests: 890, newHosts: 49, totalActiveUsers: 22156, kycVerificationRate: '90.8%', repeatGuestShare: '29.1%', growthRate: '+10.9%' }
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('revenue'); // 'revenue' | 'bookings' | 'users'
  const [selectedTimeframe, setSelectedTimeframe] = useState('6M');
  const [exportNotice, setExportNotice] = useState(null);

  // Trigger Mock Export (Excel or PDF)
  const handleExport = (format) => {
    const filename = `Airbnb_${activeTab.toUpperCase()}_Report_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
    setExportNotice({
      format: format.toUpperCase(),
      filename: filename
    });

    // Auto-dismiss after 4.5 seconds
    setTimeout(() => {
      setExportNotice(null);
    }, 4500);
  };

  // ApexCharts Configuration Generator based on activeTab
  const getChartConfig = () => {
    const months = ['May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026'];

    if (activeTab === 'revenue') {
      return {
        series: [
          {
            name: 'Gross Booking Volume (₹)',
            data: [2890000, 3150000, 3410000, 3720000, 3950000, 4280000]
          },
          {
            name: 'Host Payouts Disbursed (₹)',
            data: [2456500, 2677500, 2898500, 3162000, 3357500, 3638000]
          },
          {
            name: 'Platform Commission (₹)',
            data: [289000, 315000, 341000, 372000, 395000, 428000]
          }
        ],
        options: {
          chart: {
            type: 'area',
            height: 290,
            fontFamily: 'inherit',
            toolbar: { show: false },
            zoom: { enabled: false }
          },
          colors: ['#ff385c', '#2563eb', '#10b981'],
          dataLabels: { enabled: false },
          stroke: {
            curve: 'smooth',
            width: [3, 2, 2]
          },
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.35,
              opacityTo: 0.04,
              stops: [0, 95, 100]
            }
          },
          xaxis: {
            categories: months,
            labels: {
              style: { colors: '#64748b', fontSize: '12px', fontWeight: 500 }
            },
            axisBorder: { color: '#e2e8f0' },
            axisTicks: { color: '#e2e8f0' }
          },
          yaxis: {
            labels: {
              formatter: (val) => `₹${(val / 100000).toFixed(1)}L`,
              style: { colors: '#64748b', fontSize: '12px' }
            }
          },
          tooltip: {
            theme: 'light',
            y: {
              formatter: (val) => `₹${val.toLocaleString('en-IN')}`
            }
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '12.5px',
            labels: { colors: '#334155' }
          },
          grid: {
            borderColor: '#f1f5f9',
            strokeDashArray: 3
          }
        }
      };
    }

    if (activeTab === 'bookings') {
      return {
        series: [
          {
            name: 'Total Reservations',
            data: [590, 640, 692, 745, 790, 842]
          },
          {
            name: 'Completed Stays',
            data: [558, 605, 651, 702, 742, 620]
          },
          {
            name: 'Cancellations',
            data: [30, 32, 36, 35, 36, 24]
          }
        ],
        options: {
          chart: {
            type: 'area',
            height: 290,
            fontFamily: 'inherit',
            toolbar: { show: false },
            zoom: { enabled: false }
          },
          colors: ['#ff385c', '#10b981', '#dc2626'],
          dataLabels: { enabled: false },
          stroke: {
            curve: 'smooth',
            width: [3, 2, 2]
          },
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.35,
              opacityTo: 0.04,
              stops: [0, 95, 100]
            }
          },
          xaxis: {
            categories: months,
            labels: {
              style: { colors: '#64748b', fontSize: '12px', fontWeight: 500 }
            },
            axisBorder: { color: '#e2e8f0' }
          },
          yaxis: {
            labels: {
              formatter: (val) => `${val}`,
              style: { colors: '#64748b', fontSize: '12px' }
            }
          },
          tooltip: {
            theme: 'light',
            y: {
              formatter: (val) => `${val} bookings`
            }
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '12.5px',
            labels: { colors: '#334155' }
          },
          grid: {
            borderColor: '#f1f5f9',
            strokeDashArray: 3
          }
        }
      };
    }

    // User & Host Growth Tab
    return {
      series: [
        {
          name: 'New Registered Guests',
          data: [890, 980, 1080, 1190, 1280, 1420]
        },
        {
          name: 'New Verified Hosts',
          data: [49, 55, 61, 68, 74, 86]
        }
      ],
      options: {
        chart: {
          type: 'area',
          height: 290,
          fontFamily: 'inherit',
          toolbar: { show: false },
          zoom: { enabled: false }
        },
        colors: ['#2563eb', '#7c3aed'],
        dataLabels: { enabled: false },
        stroke: {
          curve: 'smooth',
          width: [3, 3]
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.35,
            opacityTo: 0.04,
            stops: [0, 95, 100]
          }
        },
        xaxis: {
          categories: months,
          labels: {
            style: { colors: '#64748b', fontSize: '12px', fontWeight: 500 }
          },
          axisBorder: { color: '#e2e8f0' }
        },
        yaxis: {
          labels: {
            formatter: (val) => `${val}`,
            style: { colors: '#64748b', fontSize: '12px' }
          }
        },
        tooltip: {
          theme: 'light',
          y: {
            formatter: (val) => `${val} users`
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          fontSize: '12.5px',
          labels: { colors: '#334155' }
        },
        grid: {
          borderColor: '#f1f5f9',
          strokeDashArray: 3
        }
      }
    };
  };

  const chartConfig = getChartConfig();

  return (
    <div className="container-fluid p-0">
      {/* 4 Summary Stat Cards with Bootstrap Grid */}
      <div className="row g-3 mb-4">
        {/* Card 1: Gross Platform Revenue */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Gross Booking Volume</span>
              <div className={styles.statIconBox} style={{ background: '#eaf8ee', color: '#16a34a' }}>
                <FaRupeeSign />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>₹42.8L</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                  <FaArrowUp size={8} /> +18.4% MoM
                </span>
                <span className={styles.statSubtext}>Current Month MTD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Total Completed Bookings */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Total Reservations</span>
              <div className={styles.statIconBox} style={{ background: '#eff6ff', color: '#2563eb' }}>
                <FaCalendarCheck />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>842</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgeBlue}`}>
                  97.1% Fulfillment
                </span>
                <span className={styles.statSubtext}>Low 0.4% Dispute</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: User & Host Growth */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>New Guests & Hosts</span>
              <div className={styles.statIconBox} style={{ background: '#fff1f2', color: '#ff385c' }}>
                <FaUserPlus />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>1,506</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgePink}`}>
                  +19.2% Growth
                </span>
                <span className={styles.statSubtext}>1,420 Guests / 86 Hosts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Platform Net Take Rate */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Net Commission Earned</span>
              <div className={styles.statIconBox} style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                <FaChartLine />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>₹4.28L</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgePurple}`}>
                  10.0% Take Rate
                </span>
                <span className={styles.statSubtext}>Post Host Settlement</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel Card */}
      <div className={styles.mainCard}>
        {/* Card Header & Tabs */}
        <div className={styles.cardHeader}>
          <div className={styles.headerTitles}>
            <h2 className={styles.title}>
              <FaChartLine style={{ color: '#ff385c', fontSize: '20px' }} />
              Reports & Platform Analytics
            </h2>
            <p className={styles.subtitle}>
              Monthly revenue, booking fulfillment aur user acquisition reports analyze karein aur Excel ya PDF mein export karein.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className={styles.tabGroup}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'revenue' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('revenue')}
            >
              <FaRupeeSign size={12} />
              Revenue & Financials
              <span className={styles.tabCount}>{REVENUE_DATA.length}M</span>
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'bookings' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <FaCalendarCheck size={12} />
              Booking Fulfillment
              <span className={styles.tabCount}>{BOOKINGS_DATA.length}M</span>
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'users' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <FaUserPlus size={12} />
              User & Host Growth
              <span className={styles.tabCount}>{USER_GROWTH_DATA.length}M</span>
            </button>
          </div>
        </div>

        {/* Export Notification Banner */}
        {exportNotice && (
          <div className={styles.toastNotice}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaCheck />
              <span>
                <strong>{exportNotice.format} Generated Successfully:</strong> File prepared as <code>{exportNotice.filename}</code>. Download started.
              </span>
            </div>
            <button 
              type="button" 
              style={{ background: 'transparent', border: 'none', color: '#065f46', cursor: 'pointer' }}
              onClick={() => setExportNotice(null)}
            >
              ✕
            </button>
          </div>
        )}

        {/* Visual Analytics ApexCharts Box */}
        <div className={styles.chartContainerBox}>
          <div className={styles.chartHeader}>
            <h4 className={styles.chartTitle}>
              <FaChartLine style={{ color: '#ff385c' }} />
              {activeTab === 'revenue' && 'Revenue & Commission Trajectory (ApexCharts Live Trend)'}
              {activeTab === 'bookings' && 'Booking Volume & Stay Fulfillment (ApexCharts Trend)'}
              {activeTab === 'users' && 'New Guest & Host Acquisition Trajectory (ApexCharts Trend)'}
            </h4>
          </div>

          {/* Modern Interactive ApexChart */}
          <div style={{ minHeight: '290px' }}>
            <Chart 
              options={chartConfig.options} 
              series={chartConfig.series} 
              type="area" 
              height={290} 
            />
          </div>
        </div>

        {/* Controls & Export Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.filterControls}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>Reporting Window:</span>
            <select 
              className={styles.filterSelect}
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
            >
              <option value="6M">Last 6 Months (FY 2026-27)</option>
              <option value="3M">Quarter 2 (Jul - Sep 2026)</option>
              <option value="1Y">Full Year (FY 2025-26)</option>
            </select>
          </div>

          {/* Export Action Buttons */}
          <div className={styles.exportButtonsGroup}>
            <button 
              className={styles.btnExportExcel}
              onClick={() => handleExport('excel')}
              title="Download structured spreadsheet report"
            >
              <FaFileExcel size={14} /> Export to Excel (.xlsx)
            </button>
            <button 
              className={styles.btnExportPdf}
              onClick={() => handleExport('pdf')}
              title="Download printable PDF summary report"
            >
              <FaFilePdf size={14} /> Export to PDF (.pdf)
            </button>
          </div>
        </div>

        {/* =========================================================
            TAB 1: REVENUE & FINANCIALS REPORT TABLE
            ========================================================= */}
        {activeTab === 'revenue' && (
          <div className={styles.tableResponsive}>
            <table className={`table table-hover align-middle mb-0 ${styles.customTable}`}>
              <thead>
                <tr>
                  <th className={styles.srNoCol}>Sr. No.</th>
                  <th>Month / Period</th>
                  <th>Gross Booking Value (GMV)</th>
                  <th>Host Payouts Disbursed</th>
                  <th>Platform Fee (Commission)</th>
                  <th>GST / Taxes (18%)</th>
                  <th>Net Platform Revenue</th>
                  <th>Growth Rate</th>
                </tr>
              </thead>
              <tbody>
                {REVENUE_DATA.map((row, idx) => (
                  <tr key={row.id}>
                    {/* Sr. No. */}
                    <td className={styles.srNoCol}>{idx + 1}</td>

                    {/* Month */}
                    <td>
                      <span className={styles.periodBadge}>
                        <FaCalendarAlt size={10} style={{ marginRight: '5px', color: '#64748b' }} />
                        {row.month}
                      </span>
                    </td>

                    {/* Gross Volume */}
                    <td className={styles.numberCol}>
                      ₹{row.grossVolume.toLocaleString('en-IN')}
                    </td>

                    {/* Host Payouts */}
                    <td style={{ color: '#4b5563' }}>
                      ₹{row.hostPayouts.toLocaleString('en-IN')}
                    </td>

                    {/* Platform Commission */}
                    <td style={{ fontWeight: '700', color: '#16a34a' }}>
                      ₹{row.platformCommission.toLocaleString('en-IN')}
                    </td>

                    {/* GST Collected */}
                    <td style={{ color: '#6b7280' }}>
                      ₹{row.gstCollected.toLocaleString('en-IN')}
                    </td>

                    {/* Net Profit */}
                    <td className={styles.numberCol} style={{ color: '#ff385c' }}>
                      ₹{row.netProfit.toLocaleString('en-IN')}
                    </td>

                    {/* Growth */}
                    <td>
                      <span className={styles.positiveDelta}>
                        <FaArrowUp size={9} style={{ marginRight: '3px' }} />
                        {row.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* =========================================================
            TAB 2: BOOKINGS FULFILLMENT REPORT TABLE
            ========================================================= */}
        {activeTab === 'bookings' && (
          <div className={styles.tableResponsive}>
            <table className={`table table-hover align-middle mb-0 ${styles.customTable}`}>
              <thead>
                <tr>
                  <th className={styles.srNoCol}>Sr. No.</th>
                  <th>Reporting Period</th>
                  <th>Total Reservations</th>
                  <th>Completed Stays</th>
                  <th>Upcoming Bookings</th>
                  <th>Cancellations</th>
                  <th>Avg Length of Stay</th>
                  <th>Average Booking Value</th>
                  <th>Dispute Rate</th>
                </tr>
              </thead>
              <tbody>
                {BOOKINGS_DATA.map((row, idx) => (
                  <tr key={row.id}>
                    {/* Sr. No. */}
                    <td className={styles.srNoCol}>{idx + 1}</td>

                    {/* Period */}
                    <td>
                      <span className={styles.periodBadge}>
                        <FaCalendarCheck size={10} style={{ marginRight: '5px', color: '#2563eb' }} />
                        {row.period}
                      </span>
                    </td>

                    {/* Total Bookings */}
                    <td className={styles.numberCol}>
                      {row.totalBookings}
                    </td>

                    {/* Completed */}
                    <td style={{ fontWeight: '600', color: '#16a34a' }}>
                      {row.completedStays}
                    </td>

                    {/* Upcoming */}
                    <td style={{ color: '#2563eb', fontWeight: '500' }}>
                      {row.upcomingStays}
                    </td>

                    {/* Cancellations */}
                    <td style={{ color: '#dc2626' }}>
                      {row.cancellations}
                    </td>

                    {/* Avg Nights */}
                    <td style={{ color: '#374151' }}>
                      {row.avgNightsPerStay} nights
                    </td>

                    {/* Avg Order Value */}
                    <td className={styles.numberCol}>
                      ₹{row.avgOrderValue.toLocaleString('en-IN')}
                    </td>

                    {/* Dispute Rate */}
                    <td>
                      <span className={styles.positiveDelta} style={{ color: '#059669' }}>
                        {row.disputeRate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* =========================================================
            TAB 3: USER & HOST GROWTH REPORT TABLE
            ========================================================= */}
        {activeTab === 'users' && (
          <div className={styles.tableResponsive}>
            <table className={`table table-hover align-middle mb-0 ${styles.customTable}`}>
              <thead>
                <tr>
                  <th className={styles.srNoCol}>Sr. No.</th>
                  <th>Period</th>
                  <th>New Guests Registered</th>
                  <th>New Verified Hosts</th>
                  <th>Total Active Platform Users</th>
                  <th>KYC Verification Rate</th>
                  <th>Repeat Guest Share</th>
                  <th>MoM Acquisition Growth</th>
                </tr>
              </thead>
              <tbody>
                {USER_GROWTH_DATA.map((row, idx) => (
                  <tr key={row.id}>
                    {/* Sr. No. */}
                    <td className={styles.srNoCol}>{idx + 1}</td>

                    {/* Period */}
                    <td>
                      <span className={styles.periodBadge}>
                        <FaUserPlus size={10} style={{ marginRight: '5px', color: '#7c3aed' }} />
                        {row.period}
                      </span>
                    </td>

                    {/* New Guests */}
                    <td className={styles.numberCol}>
                      +{row.newGuests.toLocaleString('en-IN')}
                    </td>

                    {/* New Hosts */}
                    <td style={{ fontWeight: '700', color: '#ff385c' }}>
                      +{row.newHosts}
                    </td>

                    {/* Total Active Users */}
                    <td style={{ fontWeight: '600', color: '#1e293b' }}>
                      {row.totalActiveUsers.toLocaleString('en-IN')}
                    </td>

                    {/* KYC Rate */}
                    <td style={{ color: '#16a34a', fontWeight: '600' }}>
                      {row.kycVerificationRate}
                    </td>

                    {/* Repeat Guest Share */}
                    <td style={{ color: '#2563eb', fontWeight: '500' }}>
                      {row.repeatGuestShare}
                    </td>

                    {/* Growth Rate */}
                    <td>
                      <span className={styles.positiveDelta}>
                        <FaArrowUp size={9} style={{ marginRight: '3px' }} />
                        {row.growthRate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

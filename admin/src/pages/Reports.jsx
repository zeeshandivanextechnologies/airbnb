import React, { useState, useEffect } from 'react';
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
import { adminApiRequest } from '../services/api';
import styles from './styles/Reports.module.css';

export default function Reports() {
  const [activeTab, setActiveTab] = useState('revenue'); // 'revenue' | 'bookings' | 'users'
  const [selectedTimeframe, setSelectedTimeframe] = useState('6M');
  const [exportNotice, setExportNotice] = useState(null);

  // Dynamic state loaded strictly from backend DB
  const [revenueData, setRevenueData] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [summaryCards, setSummaryCards] = useState({
    grossVolume: { formatted: '₹0', trend: '0.0% MoM', subtext: 'Current Real Volume' },
    totalReservations: { formatted: '0', fulfillment: '0% Fulfillment', subtext: '0 Completed / 0 Total' },
    newUsers: { formatted: '0', growth: '0.0%', subtext: '0 Guests / 0 Hosts' },
    netCommission: { formatted: '₹0', takeRate: '10.0% Take Rate', subtext: 'Post Host Settlement' }
  });
  const [chartCategories, setChartCategories] = useState([]);
  const [dynamicChartSeries, setDynamicChartSeries] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch dynamic reports from backend
  const fetchReports = async (timeframe) => {
    try {
      setLoading(true);
      const res = await adminApiRequest(`/admin/auth/reports?timeframe=${timeframe || '6M'}`);
      if (res && res.success && res.data) {
        if (res.data.revenueData?.length) setRevenueData(res.data.revenueData);
        if (res.data.bookingsData?.length) setBookingsData(res.data.bookingsData);
        if (res.data.userGrowthData?.length) setUserGrowthData(res.data.userGrowthData);
        if (res.data.summaryCards) setSummaryCards(res.data.summaryCards);
        if (res.data.chartCategories?.length) setChartCategories(res.data.chartCategories);
        if (res.data.chartSeries) setDynamicChartSeries(res.data.chartSeries);
      }
    } catch (err) {
      console.error('Failed to load dynamic reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(selectedTimeframe);
  }, [selectedTimeframe]);

  // Trigger Real Dynamic Export (Excel or PDF Printable)
  const handleExport = (format) => {
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `Airbnb_${activeTab.toUpperCase()}_Report_${dateStr}.${format === 'excel' ? 'xls' : 'pdf'}`;
    
    try {
      if (format === 'excel') {
        // Build clean formatted HTML Table for Excel (.xls / .xlsx readable)
        let tableHtml = `
          <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
          <head>
            <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Airbnb ${activeTab.toUpperCase()} Report</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
            <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
            <style>
              th { background-color: #ff385c; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #ddd; }
              td { padding: 8px; border: 1px solid #ddd; font-family: Arial, sans-serif; }
              .title { font-size: 18px; font-weight: bold; margin-bottom: 12px; }
            </style>
          </head>
          <body>
            <div class="title">Airbnb Platform Report - ${activeTab.toUpperCase()} (${dateStr})</div>
            <table>
        `;

        if (activeTab === 'revenue') {
          tableHtml += `
            <thead>
              <tr>
                <th>Sr. No.</th>
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
              ${revenueData.map((row, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${row.month}</td>
                  <td>₹${Number(row.grossVolume).toLocaleString('en-IN')}</td>
                  <td>₹${Number(row.hostPayouts).toLocaleString('en-IN')}</td>
                  <td>₹${Number(row.platformCommission).toLocaleString('en-IN')}</td>
                  <td>₹${Number(row.gstCollected).toLocaleString('en-IN')}</td>
                  <td>₹${Number(row.netProfit).toLocaleString('en-IN')}</td>
                  <td>${row.growth}</td>
                </tr>
              `).join('')}
            </tbody>
          `;
        } else if (activeTab === 'bookings') {
          tableHtml += `
            <thead>
              <tr>
                <th>Sr. No.</th>
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
              ${bookingsData.map((row, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${row.period}</td>
                  <td>${row.totalBookings}</td>
                  <td>${row.completedStays}</td>
                  <td>${row.upcomingStays}</td>
                  <td>${row.cancellations}</td>
                  <td>${row.avgNightsPerStay} nights</td>
                  <td>₹${Number(row.avgOrderValue).toLocaleString('en-IN')}</td>
                  <td>${row.disputeRate}</td>
                </tr>
              `).join('')}
            </tbody>
          `;
        } else {
          tableHtml += `
            <thead>
              <tr>
                <th>Sr. No.</th>
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
              ${userGrowthData.map((row, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${row.period}</td>
                  <td>+${Number(row.newGuests).toLocaleString('en-IN')}</td>
                  <td>+${row.newHosts}</td>
                  <td>${Number(row.totalActiveUsers).toLocaleString('en-IN')}</td>
                  <td>${row.kycVerificationRate}</td>
                  <td>${row.repeatGuestShare}</td>
                  <td>${row.growthRate}</td>
                </tr>
              `).join('')}
            </tbody>
          `;
        }

        tableHtml += `
            </table>
          </body>
          </html>
        `;

        const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Airbnb_${activeTab.toUpperCase()}_Report_${dateStr}.xls`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // PDF: Open a clean, beautifully styled printable report window dedicated only to the report content
        const printWindow = window.open('', '_blank', 'width=1000,height=750');
        if (!printWindow) {
          window.print();
          return;
        }

        let reportHeaderTitle = 'Revenue & Financials Report';
        let reportThead = '';
        let reportTbody = '';

        if (activeTab === 'revenue') {
          reportHeaderTitle = 'Revenue & Financials Performance Report';
          reportThead = `
            <tr>
              <th style="width: 50px;">#</th>
              <th>Month / Period</th>
              <th>Gross Booking Value (GMV)</th>
              <th>Host Payouts Disbursed</th>
              <th>Platform Commission</th>
              <th>GST (18%)</th>
              <th>Net Platform Revenue</th>
              <th>Growth</th>
            </tr>
          `;
          reportTbody = revenueData.map((r, i) => `
            <tr>
              <td>${i + 1}</td>
              <td style="font-weight: 600;">${r.month}</td>
              <td>₹${Number(r.grossVolume).toLocaleString('en-IN')}</td>
              <td>₹${Number(r.hostPayouts).toLocaleString('en-IN')}</td>
              <td style="color: #16a34a; font-weight: 600;">₹${Number(r.platformCommission).toLocaleString('en-IN')}</td>
              <td>₹${Number(r.gstCollected).toLocaleString('en-IN')}</td>
              <td style="color: #ff385c; font-weight: 700;">₹${Number(r.netProfit).toLocaleString('en-IN')}</td>
              <td style="color: #16a34a; font-weight: 600;">${r.growth}</td>
            </tr>
          `).join('');
        } else if (activeTab === 'bookings') {
          reportHeaderTitle = 'Booking Fulfillment & Reservations Report';
          reportThead = `
            <tr>
              <th style="width: 50px;">#</th>
              <th>Reporting Period</th>
              <th>Total Reservations</th>
              <th>Completed Stays</th>
              <th>Upcoming Bookings</th>
              <th>Cancellations</th>
              <th>Avg Stay Length</th>
              <th>Avg Order Value</th>
              <th>Dispute Rate</th>
            </tr>
          `;
          reportTbody = bookingsData.map((b, i) => `
            <tr>
              <td>${i + 1}</td>
              <td style="font-weight: 600;">${b.period}</td>
              <td style="font-weight: 700;">${b.totalBookings}</td>
              <td style="color: #16a34a; font-weight: 600;">${b.completedStays}</td>
              <td style="color: #2563eb;">${b.upcomingStays}</td>
              <td style="color: #dc2626;">${b.cancellations}</td>
              <td>${b.avgNightsPerStay} nights</td>
              <td style="font-weight: 600;">₹${Number(b.avgOrderValue).toLocaleString('en-IN')}</td>
              <td style="color: #059669;">${b.disputeRate}</td>
            </tr>
          `).join('');
        } else {
          reportHeaderTitle = 'User Acquisition & Host Growth Report';
          reportThead = `
            <tr>
              <th style="width: 50px;">#</th>
              <th>Period</th>
              <th>New Guests</th>
              <th>New Verified Hosts</th>
              <th>Active Platform Users</th>
              <th>KYC Verification Rate</th>
              <th>Repeat Guest Share</th>
              <th>Growth Rate</th>
            </tr>
          `;
          reportTbody = userGrowthData.map((u, i) => `
            <tr>
              <td>${i + 1}</td>
              <td style="font-weight: 600;">${u.period}</td>
              <td style="color: #2563eb; font-weight: 600;">+${Number(u.newGuests).toLocaleString('en-IN')}</td>
              <td style="color: #ff385c; font-weight: 700;">+${u.newHosts}</td>
              <td style="font-weight: 600;">${Number(u.totalActiveUsers).toLocaleString('en-IN')}</td>
              <td style="color: #16a34a;">${u.kycVerificationRate}</td>
              <td>${u.repeatGuestShare}</td>
              <td style="color: #16a34a; font-weight: 600;">${u.growthRate}</td>
            </tr>
          `).join('');
        }

        const printableDoc = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>${reportHeaderTitle}</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                margin: 20px;
                color: #1e293b;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 0;
                font-size: 13px;
              }
              th {
                background: #f1f5f9;
                color: #334155;
                font-weight: 700;
                text-align: left;
                padding: 10px 12px;
                border: 1px solid #cbd5e1;
              }
              td {
                padding: 10px 12px;
                border: 1px solid #e2e8f0;
              }
              tr:nth-child(even) td {
                background: #fafafa;
              }
              @media print {
                body { margin: 10mm; }
                @page { size: landscape; margin: 8mm; }
              }
            </style>
          </head>
          <body>
            <table>
              <thead>
                ${reportThead}
              </thead>
              <tbody>
                ${reportTbody}
              </tbody>
            </table>

            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 250);
              };
            </script>
          </body>
          </html>
        `;

        printWindow.document.open();
        printWindow.document.write(printableDoc);
        printWindow.document.close();
      }
    } catch (e) {
      console.warn('Export trigger error:', e);
    }

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
    const months = chartCategories;

    if (activeTab === 'revenue') {
      const series = dynamicChartSeries?.revenue || [
        {
          name: 'Gross Booking Volume (₹)',
          data: [...revenueData].reverse().map(r => r.grossVolume)
        },
        {
          name: 'Host Payouts Disbursed (₹)',
          data: [...revenueData].reverse().map(r => r.hostPayouts)
        },
        {
          name: 'Platform Commission (₹)',
          data: [...revenueData].reverse().map(r => r.platformCommission)
        }
      ];

      return {
        series,
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
      const series = dynamicChartSeries?.bookings || [
        {
          name: 'Total Reservations',
          data: [...bookingsData].reverse().map(b => b.totalBookings)
        },
        {
          name: 'Completed Stays',
          data: [...bookingsData].reverse().map(b => b.completedStays)
        },
        {
          name: 'Cancellations',
          data: [...bookingsData].reverse().map(b => b.cancellations)
        }
      ];

      return {
        series,
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
    const series = dynamicChartSeries?.users || [
      {
        name: 'New Registered Guests',
        data: [...userGrowthData].reverse().map(u => u.newGuests)
      },
      {
        name: 'New Verified Hosts',
        data: [...userGrowthData].reverse().map(u => u.newHosts)
      }
    ];

    return {
      series,
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
              <div className={styles.statValue}>{summaryCards.grossVolume?.formatted || '₹0'}</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                  <FaArrowUp size={8} /> {summaryCards.grossVolume?.trend || '+0.0% MoM'}
                </span>
                <span className={styles.statSubtext}>{summaryCards.grossVolume?.subtext || 'Current Real Volume'}</span>
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
              <div className={styles.statValue}>{summaryCards.totalReservations?.formatted || '0'}</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgeBlue}`}>
                  {summaryCards.totalReservations?.fulfillment || '0% Fulfillment'}
                </span>
                <span className={styles.statSubtext}>{summaryCards.totalReservations?.subtext || '0 Completed / 0 Total'}</span>
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
              <div className={styles.statValue}>{summaryCards.newUsers?.formatted || '0'}</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgePink}`}>
                  {summaryCards.newUsers?.growth || '+0.0% Growth'}
                </span>
                <span className={styles.statSubtext}>{summaryCards.newUsers?.subtext || '0 Guests / 0 Hosts'}</span>
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
              <div className={styles.statValue}>{summaryCards.netCommission?.formatted || '₹0'}</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgePurple}`}>
                  {summaryCards.netCommission?.takeRate || '0.0% Take Rate'}
                </span>
                <span className={styles.statSubtext}>{summaryCards.netCommission?.subtext || 'Post Host Settlement'}</span>
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
              <span className={styles.tabCount}>{revenueData.length}M</span>
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'bookings' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <FaCalendarCheck size={12} />
              Booking Fulfillment
              <span className={styles.tabCount}>{bookingsData.length}M</span>
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'users' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <FaUserPlus size={12} />
              User & Host Growth
              <span className={styles.tabCount}>{userGrowthData.length}M</span>
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
                {revenueData.map((row, idx) => (
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
                      ₹{Number(row.grossVolume).toLocaleString('en-IN')}
                    </td>

                    {/* Host Payouts */}
                    <td style={{ color: '#4b5563' }}>
                      ₹{Number(row.hostPayouts).toLocaleString('en-IN')}
                    </td>

                    {/* Platform Commission */}
                    <td style={{ fontWeight: '700', color: '#16a34a' }}>
                      ₹{Number(row.platformCommission).toLocaleString('en-IN')}
                    </td>

                    {/* GST Collected */}
                    <td style={{ color: '#6b7280' }}>
                      ₹{Number(row.gstCollected).toLocaleString('en-IN')}
                    </td>

                    {/* Net Profit */}
                    <td className={styles.numberCol} style={{ color: '#ff385c' }}>
                      ₹{Number(row.netProfit).toLocaleString('en-IN')}
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
                {bookingsData.map((row, idx) => (
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
                      ₹{Number(row.avgOrderValue).toLocaleString('en-IN')}
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
                {userGrowthData.map((row, idx) => (
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
                      +{Number(row.newGuests).toLocaleString('en-IN')}
                    </td>

                    {/* New Hosts */}
                    <td style={{ fontWeight: '700', color: '#ff385c' }}>
                      +{row.newHosts}
                    </td>

                    {/* Total Active Users */}
                    <td style={{ fontWeight: '600', color: '#1e293b' }}>
                      {Number(row.totalActiveUsers).toLocaleString('en-IN')}
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

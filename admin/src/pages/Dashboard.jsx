import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { 
  FaUsers, 
  FaUserTie, 
  FaHome, 
  FaCalendarCheck, 
  FaRupeeSign, 
  FaPercentage, 
  FaArrowUp, 
  FaArrowDown, 
  FaCheckCircle,
  FaPlusCircle,
  FaDollarSign,
  FaStar,
  FaChartLine
} from 'react-icons/fa';
import styles from './styles/Dashboard.module.css';

export default function Dashboard() {
  const [reportRange, setReportRange] = useState('daily'); // 'daily' | 'monthly'

  // 1. Total Users, Hosts, Listings, Bookings
  const coreStats = [
    {
      title: 'Total Users',
      value: '24,850',
      trend: '+12.5%',
      isUp: true,
      subtext: 'vs last month',
      bg: '#eff6ff',
      color: '#2563eb',
      icon: <FaUsers />
    },
    {
      title: 'Total Hosts',
      value: '1,420',
      trend: '+8.1%',
      isUp: true,
      subtext: 'Verified hosts',
      bg: '#f0fdf4',
      color: '#16a34a',
      icon: <FaUserTie />
    },
    {
      title: 'Total Listings',
      value: '3,840',
      trend: '+15.3%',
      isUp: true,
      subtext: 'Stays & Experiences',
      bg: '#fff1f2',
      color: '#ff385c',
      icon: <FaHome />
    },
    {
      title: 'Total Bookings',
      value: '8,920',
      trend: '+22.4%',
      isUp: true,
      subtext: 'Confirmed reservations',
      bg: '#fefce8',
      color: '#ca8a04',
      icon: <FaCalendarCheck />
    }
  ];

  // 2. Revenue, Commission & Host Payouts
  const revenueData = {
    totalRevenue: '₹48,25,000',
    revenueGrowth: '+18.6% this month',
    airbnbCommission: '₹9,65,000',
    commissionRate: '20% platform fee',
    hostPayouts: '₹38,60,000',
    payoutsStatus: 'Disbursed to hosts'
  };

  // 3. Daily & Monthly Reports Data
  const dailyData = [
    { label: 'Mon', revenue: 45000, bookings: 32 },
    { label: 'Tue', revenue: 62000, bookings: 44 },
    { label: 'Wed', revenue: 58000, bookings: 39 },
    { label: 'Thu', revenue: 78000, bookings: 55 },
    { label: 'Fri', revenue: 95000, bookings: 72 },
    { label: 'Sat', revenue: 120000, bookings: 94 },
    { label: 'Sun', revenue: 105000, bookings: 86 }
  ];

  const monthlyData = [
    { label: 'May', revenue: 2800000, bookings: 2100 },
    { label: 'Jun', revenue: 3200000, bookings: 2450 },
    { label: 'Jul', revenue: 3600000, bookings: 2780 },
    { label: 'Aug', revenue: 4100000, bookings: 3120 },
    { label: 'Sep', revenue: 4450000, bookings: 3410 },
    { label: 'Oct', revenue: 4825000, bookings: 3680 }
  ];

  // ApexCharts Configuration for Daily / Monthly Revenue & Bookings
  const getApexChartConfig = () => {
    const isDaily = reportRange === 'daily';
    const categories = isDaily 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    
    const revenueValues = isDaily 
      ? [45000, 62000, 58000, 78000, 95000, 120000, 105000]
      : [2800000, 3200000, 3600000, 4100000, 4450000, 4825000];

    const bookingsValues = isDaily
      ? [32, 44, 39, 55, 72, 94, 86]
      : [2100, 2450, 2780, 3120, 3410, 3680];

    return {
      series: [
        {
          name: 'Platform Revenue (₹)',
          type: 'column',
          data: revenueValues
        },
        {
          name: 'Reservations Count',
          type: 'line',
          data: bookingsValues
        }
      ],
      options: {
        chart: {
          height: 270,
          type: 'line',
          fontFamily: 'inherit',
          toolbar: { show: false },
          zoom: { enabled: false }
        },
        stroke: {
          width: [0, 3],
          curve: 'smooth'
        },
        plotOptions: {
          bar: {
            columnWidth: isDaily ? '42%' : '48%',
            borderRadius: 6,
            borderRadiusApplication: 'end'
          }
        },
        fill: {
          opacity: [0.92, 1],
          gradient: {
            inverseColors: false,
            shade: 'light',
            type: 'vertical',
            opacityFrom: 0.95,
            opacityTo: 0.85,
            stops: [0, 100]
          }
        },
        colors: ['#ff385c', '#10b981'],
        labels: categories,
        xaxis: {
          categories: categories,
          labels: {
            style: { colors: '#64748b', fontSize: '12px', fontWeight: 600 }
          },
          axisBorder: { color: '#e2e8f0' },
          axisTicks: { color: '#e2e8f0' }
        },
        yaxis: [
          {
            title: {
              text: 'Revenue (₹)',
              style: { color: '#64748b', fontSize: '11px', fontWeight: 600 }
            },
            labels: {
              formatter: (val) => isDaily ? `₹${(val / 1000).toFixed(0)}k` : `₹${(val / 100000).toFixed(1)}L`,
              style: { colors: '#64748b', fontSize: '11px' }
            }
          },
          {
            opposite: true,
            title: {
              text: 'Bookings',
              style: { color: '#64748b', fontSize: '11px', fontWeight: 600 }
            },
            labels: {
              formatter: (val) => `${val}`,
              style: { colors: '#64748b', fontSize: '11px' }
            }
          }
        ],
        tooltip: {
          theme: 'light',
          shared: true,
          intersect: false,
          y: {
            formatter: (y, { seriesIndex }) => {
              if (typeof y !== 'undefined') {
                return seriesIndex === 0 ? `₹${y.toLocaleString('en-IN')}` : `${y} bookings`;
              }
              return y;
            }
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          fontSize: '12px',
          labels: { colors: '#334155' }
        },
        grid: {
          borderColor: '#f1f5f9',
          strokeDashArray: 3
        }
      }
    };
  };

  const chartConfig = getApexChartConfig();

  // 4. Recent Realtime Activity
  const recentActivities = [
    {
      id: 1,
      title: 'New booking confirmed for "Sunset Hilltop Heritage"',
      sub: 'Guest: Rahul Verma • 3 Nights • Total: ₹17,200',
      time: '12 mins ago',
      icon: <FaCalendarCheck />,
      bg: '#fefce8',
      color: '#ca8a04'
    },
    {
      id: 2,
      title: 'New listing submitted: "Goan Beachfront Eco Cottage"',
      sub: 'Host: Ananya Roy • North Goa • Needs Quality Approval',
      time: '35 mins ago',
      icon: <FaPlusCircle />,
      bg: '#fff1f2',
      color: '#ff385c'
    },
    {
      id: 3,
      title: 'Commission credited: ₹11,440 (20% platform fee)',
      sub: 'Transaction Ref #TXN-99824 • Automated payout settlement',
      time: '1 hour ago',
      icon: <FaPercentage />,
      bg: '#f0fdf4',
      color: '#16a34a'
    },
    {
      id: 4,
      title: 'Host verified: Priya Sharma (Jaipur)',
      sub: 'KYC documents verified • Government ID verified',
      time: '2 hours ago',
      icon: <FaCheckCircle />,
      bg: '#eff6ff',
      color: '#2563eb'
    },
    {
      id: 5,
      title: '5-star guest review published for Mohammad Art Stay',
      sub: '"Incredible hospitality and memorable sketches"',
      time: '3 hours ago',
      icon: <FaStar />,
      bg: '#fdf2f8',
      color: '#db2777'
    }
  ];

  return (
    <>
      {/* 1. Core Platform Stats (Users, Hosts, Listings, Bookings) */}
      <div className="row">
        {coreStats.map((stat, i) => (
          <div key={i} className="col-sm-12 col-lg-3 col-md-6 mb-3">
            <div className={styles.statCard}>
              <div>
                <div className={styles.statHeader}>
                  <span className={styles.statTitle}>{stat.title}</span>
                  <div 
                    className={styles.iconBox}
                    style={{ backgroundColor: stat.bg, color: stat.color }}
                  >
                    {stat.icon}
                  </div>
                </div>
                <div className={styles.statValue}>{stat.value}</div>
              </div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${stat.isUp ? styles.badgeSuccess : styles.badgeAlert}`}>
                  {stat.isUp ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                  {stat.trend}
                </span>
                <span className={styles.statSubtext}>{stat.subtext}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Revenue & Commission Banner */}
      <div className={" mb-3 " + styles.revenueBanner}>
        <div className={styles.revenueBannerHeader}>
          <h3 className={styles.revenueBannerTitle}>
            Financial Overview & Earnings
          </h3>
          <div className={styles.revenueBadge}>
            <span>● 20% Standard Take-Rate</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span>Realtime Settlement</span>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4 col-sm-12 col-md-4 mb-3 mb-lg-0">
            <div className={styles.revenueCardItem}>
              <div 
                className={styles.revIconBox} 
                style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}
              >
                <FaRupeeSign />
              </div>
              <div className={styles.revInfo}>
                <span className={styles.revLabel}>Total Platform Revenue</span>
                <span className={styles.revAmount}>{revenueData.totalRevenue}</span>
                <span className={styles.revSubPill} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                  <FaArrowUp size={9} /> {revenueData.revenueGrowth}
                </span>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-sm-12 col-md-4 mb-3 mb-lg-0">
            <div className={styles.revenueCardItem}>
              <div 
                className={styles.revIconBox} 
                style={{ background: 'rgba(255, 56, 92, 0.15)', color: '#ff385c', border: '1px solid rgba(255, 56, 92, 0.3)' }}
              >
                <FaPercentage />
              </div>
              <div className={styles.revInfo}>
                <span className={styles.revLabel}>Airbnb Commission (Earned)</span>
                <span className={styles.revAmount}>{revenueData.airbnbCommission}</span>
                <span className={styles.revSubPill} style={{ background: 'rgba(255, 56, 92, 0.15)', color: '#ff385c' }}>
                  {revenueData.commissionRate}
                </span>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-sm-12 col-md-4 mb-3 mb-lg-0">
            <div className={styles.revenueCardItem}>
              <div 
                className={styles.revIconBox} 
                style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' }}
              >
                <FaDollarSign />
              </div>
              <div className={styles.revInfo}>
                <span className={styles.revLabel}>Host Payouts Disbursed</span>
                <span className={styles.revAmount}>{revenueData.hostPayouts}</span>
                <span className={styles.revSubPill} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd' }}>
                  ✓ {revenueData.payoutsStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Revenue & Booking Chart + Category Share */}
      <div className="row">
        {/* Main Revenue ApexChart */}
        <div className="col-lg-8 col-md-12 col-sm-12 mb-3">
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div>
                <h3 className={styles.sectionTitle}>Revenue & Booking Reports</h3>
                <p className={styles.sectionSubtitle}>
                  Analyze performance with daily and monthly financial breakdown.
                </p>
              </div>

              {/* Daily / Monthly Toggle */}
              <div className={styles.timeFilterGroup}>
                <button
                  type="button"
                  className={`${styles.filterBtn} ${reportRange === 'daily' ? styles.filterBtnActive : ''}`}
                  onClick={() => setReportRange('daily')}
                >
                  Daily Report
                </button>
                <button
                  type="button"
                  className={`${styles.filterBtn} ${reportRange === 'monthly' ? styles.filterBtnActive : ''}`}
                  onClick={() => setReportRange('monthly')}
                >
                  Monthly Report
                </button>
              </div>
            </div>

            {/* ApexCharts Live Chart Box */}
            <div style={{ minHeight: '270px' }}>
              <Chart 
                options={chartConfig.options} 
                series={chartConfig.series} 
                type="line" 
                height={270} 
              />
            </div>
          </div>
        </div>

        {/* Category Breakdown & Performance Metrics */}
        <div className="col-lg-4 col-md-12 col-sm-12 mb-3">
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div>
                <h3 className={styles.sectionTitle}>Category Share</h3>
                <p className={styles.sectionSubtitle}>Bookings contribution by stay type</p>
              </div>
            </div>

            <div className={styles.metricBarsList}>
              <div className={styles.metricBarRow}>
                <div className={styles.metricBarHeader}>
                  <span className={styles.metricBarLabel}>Villas & Luxury Stays</span>
                  <span className={styles.metricBarValue}>₹22.5L (46%)</span>
                </div>
                <div className={styles.metricProgressTrack}>
                  <div className={styles.metricProgressBar} style={{ width: '46%', background: '#ff385c' }} />
                </div>
              </div>

              <div className={styles.metricBarRow}>
                <div className={styles.metricBarHeader}>
                  <span className={styles.metricBarLabel}>Homestays & Heritage</span>
                  <span className={styles.metricBarValue}>₹14.2L (30%)</span>
                </div>
                <div className={styles.metricProgressTrack}>
                  <div className={styles.metricProgressBar} style={{ width: '30%', background: '#2563eb' }} />
                </div>
              </div>

              <div className={styles.metricBarRow}>
                <div className={styles.metricBarHeader}>
                  <span className={styles.metricBarLabel}>Experiences & Workshops</span>
                  <span className={styles.metricBarValue}>₹7.8L (16%)</span>
                </div>
                <div className={styles.metricProgressTrack}>
                  <div className={styles.metricProgressBar} style={{ width: '16%', background: '#16a34a' }} />
                </div>
              </div>

              <div className={styles.metricBarRow}>
                <div className={styles.metricBarHeader}>
                  <span className={styles.metricBarLabel}>Cottages & Cabins</span>
                  <span className={styles.metricBarValue}>₹3.75L (8%)</span>
                </div>
                <div className={styles.metricProgressTrack}>
                  <div className={styles.metricProgressBar} style={{ width: '8%', background: '#ca8a04' }} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px', padding: '16px', background: '#fbfcfd', borderRadius: '14px', border: '1px solid #f0f2f5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: '700', fontSize: '13px' }}>
                <FaChartLine />
                <span>Conversion Rate: 4.8%</span>
              </div>
              <span style={{ fontSize: '12px', color: '#717171', display: 'block', marginTop: '4px' }}>
                Search to confirmed checkout ratio is up 0.4% this week.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Realtime Activity Feed Row */}
      <div className="row g-4">
        <div className="col-12">
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div>
                <h3 className={styles.sectionTitle}>Recent Activity</h3>
                <p className={styles.sectionSubtitle}>
                  Realtime live events, bookings, commission settlements, and user updates.
                </p>
              </div>
              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '700' }}>
                ● Realtime Stream
              </span>
            </div>

            <div className={styles.activityList}>
              {recentActivities.map((act) => (
                <div key={act.id} className={styles.activityItem}>
                  <div className={styles.activityLeft}>
                    <div 
                      className={styles.activityIcon}
                      style={{ backgroundColor: act.bg, color: act.color }}
                    >
                      {act.icon}
                    </div>
                    <div className={styles.activityDetails}>
                      <span className={styles.activityTitle}>{act.title}</span>
                      <span className={styles.activitySub}>{act.sub}</span>
                    </div>
                  </div>
                  <div className={styles.activityTime}>{act.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

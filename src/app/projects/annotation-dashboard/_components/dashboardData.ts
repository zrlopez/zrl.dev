export interface Kpis {
  totalThroughput: number;
  throughputChange: string;
  errorRate: number;
  errorRateChange: string;
  teamEfficiency: number;
  teamEfficiencyChange: string;
  capacityUtilization: number;
  capacityUtilizationChange: string;
}

function buildDateSeries(n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toISOString().slice(0, 10);
  });
}

function buildFutureDates(n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().slice(0, 10);
  });
}

const dailyDates        = buildDateSeries(25);
const trendDates        = buildDateSeries(25);
const prodDates         = buildDateSeries(25);
const historyDates      = buildDateSeries(10);
const forecastDates     = buildFutureDates(10);
const alertHistoryDates = buildDateSeries(5);

export const BASE_KPIS: Kpis = {
  totalThroughput:           15420,
  throughputChange:          "+8.5%",
  errorRate:                 2.3,
  errorRateChange:           "-15.2%",
  teamEfficiency:            87.5,
  teamEfficiencyChange:      "+5.1%",
  capacityUtilization:       73.2,
  capacityUtilizationChange: "+2.8%",
};

export const SEED_DATA = {
  throughputData: {
    hourly: [
      { time: "00:00", value: 45 },  { time: "01:00", value: 38 },
      { time: "02:00", value: 42 },  { time: "03:00", value: 51 },
      { time: "04:00", value: 48 },  { time: "05:00", value: 55 },
      { time: "06:00", value: 62 },  { time: "07:00", value: 73 },
      { time: "08:00", value: 89 },  { time: "09:00", value: 95 },
      { time: "10:00", value: 102 }, { time: "11:00", value: 98 },
      { time: "12:00", value: 85 },  { time: "13:00", value: 91 },
      { time: "14:00", value: 97 },  { time: "15:00", value: 104 },
      { time: "16:00", value: 99 },  { time: "17:00", value: 88 },
      { time: "18:00", value: 76 },  { time: "19:00", value: 65 },
      { time: "20:00", value: 54 },  { time: "21:00", value: 47 },
      { time: "22:00", value: 41 },  { time: "23:00", value: 38 },
    ],
    daily: dailyDates.map((date, i) => ({
      date,
      value: 1820 + i * 20 + Math.round(Math.sin(i) * 30),
    })),
    byProcess: [
      { process: "Data Processing",   value: 4820, percentage: 31.3 },
      { process: "Quality Assurance", value: 3890, percentage: 25.2 },
      { process: "Customer Support",  value: 3210, percentage: 20.8 },
      { process: "Development",       value: 2180, percentage: 14.1 },
      { process: "Administration",    value: 1320, percentage: 8.6  },
    ],
  },
  errorData: {
    classification: [
      { type: "System Errors",     count: 89, percentage: 38.7 },
      { type: "User Input Errors", count: 65, percentage: 28.3 },
      { type: "Network Issues",    count: 34, percentage: 14.8 },
      { type: "Data Validation",   count: 28, percentage: 12.2 },
      { type: "Authentication",    count: 14, percentage: 6.1  },
    ],
    severity: [
      { level: "Critical", count: 12, percentage: 5.2  },
      { level: "High",     count: 45, percentage: 19.6 },
      { level: "Medium",   count: 98, percentage: 42.6 },
      { level: "Low",      count: 75, percentage: 32.6 },
    ],
    trends: trendDates.map((date, i) => ({
      date,
      value: Math.max(5, 45 - i * 1.4 + Math.round(Math.sin(i) * 4)),
    })),
    resolutionTime: {
      average: 4.2,
      target: 6.0,
      byType: [
        { type: "System Errors",     time: 3.8 },
        { type: "User Input Errors", time: 2.1 },
        { type: "Network Issues",    time: 5.5 },
        { type: "Data Validation",   time: 3.2 },
        { type: "Authentication",    time: 6.8 },
      ],
    },
  },
  teamData: {
    members: [
      { name: "Alex Chen",       avatar: "AC", productivity: 94, tasksCompleted: 127, avgTaskTime: 2.3 },
      { name: "Maria Rodriguez", avatar: "MR", productivity: 91, tasksCompleted: 118, avgTaskTime: 2.6 },
      { name: "David Kim",       avatar: "DK", productivity: 89, tasksCompleted: 115, avgTaskTime: 2.8 },
      { name: "Sarah Johnson",   avatar: "SJ", productivity: 87, tasksCompleted: 109, avgTaskTime: 3.1 },
      { name: "Michael Brown",   avatar: "MB", productivity: 85, tasksCompleted: 102, avgTaskTime: 3.4 },
      { name: "Lisa Wang",       avatar: "LW", productivity: 83, tasksCompleted:  98, avgTaskTime: 3.6 },
    ],
    productivity: prodDates.map((date, i) => ({
      date,
      value: Math.min(104, 82 + i * 0.9 + Math.round(Math.sin(i) * 2)),
    })),
    utilization: [
      { member: "Alex Chen",       mon: 95, tue: 92, wed: 88, thu: 94, fri: 90 },
      { member: "Maria Rodriguez", mon: 89, tue: 93, wed: 91, thu: 87, fri: 94 },
      { member: "David Kim",       mon: 91, tue: 87, wed: 93, thu: 89, fri: 92 },
      { member: "Sarah Johnson",   mon: 85, tue: 91, wed: 87, thu: 92, fri: 86 },
      { member: "Michael Brown",   mon: 88, tue: 84, wed: 90, thu: 86, fri: 89 },
      { member: "Lisa Wang",       mon: 82, tue: 88, wed: 85, thu: 91, fri: 83 },
    ],
  },
  capacityData: {
    forecast: forecastDates.map((date, i) => ({
      date,
      predicted:  75 + i * 1.5 + Math.round(Math.sin(i) * 2),
      actual:     null as number | null,
      confidence: 95 - i * 2,
    })),
    historical: historyDates.map((date, i) => ({
      date,
      predicted: 71 + i * 1.5,
      actual:    73 + i * 1.2 + Math.round(Math.sin(i) * 1.5),
    })),
    bottlenecks: [
      { resource: "Database Connections", utilization: 92, severity: "high"   },
      { resource: "API Rate Limits",      utilization: 78, severity: "medium" },
      { resource: "Storage Space",        utilization: 65, severity: "low"    },
      { resource: "Memory Usage",         utilization: 71, severity: "medium" },
      { resource: "CPU Usage",            utilization: 58, severity: "low"    },
    ],
    recommendations: [
      { type: "Scale Up", resource: "Database Connections", priority: "high",   impact: "Prevent bottlenecks"   },
      { type: "Optimize", resource: "API Rate Limits",      priority: "medium", impact: "Improve response time" },
      { type: "Monitor",  resource: "Memory Usage",         priority: "medium", impact: "Early warning system"  },
      { type: "Plan",     resource: "Storage Space",        priority: "low",    impact: "Future capacity"       },
    ],
  },
  alertsData: {
    active: [
      { id: 1, message: "High error rate detected in Data Processing", priority: "high",   status: "active"       },
      { id: 2, message: "Capacity utilization exceeded 90% threshold", priority: "medium", status: "active"       },
      { id: 3, message: "Team productivity below target for 2 hours",  priority: "medium", status: "acknowledged" },
      { id: 4, message: "Database connection pool near limit",         priority: "high",   status: "active"       },
    ],
    history: alertHistoryDates.map((date, i) => ({
      date,
      total:    [12, 15, 9, 11, 7][i],
      resolved: [8,  13, 9, 10, 7][i],
      pending:  [4,   2, 0,  1, 0][i],
    })),
    thresholds: [
      { metric: "Error Rate",           threshold: 5,    current: 2.3,  status: "ok" },
      { metric: "Response Time",        threshold: 2000, current: 1250, status: "ok" },
      { metric: "Capacity Utilization", threshold: 85,   current: 73.2, status: "ok" },
      { metric: "Queue Length",         threshold: 100,  current: 45,   status: "ok" },
    ],
  },
};

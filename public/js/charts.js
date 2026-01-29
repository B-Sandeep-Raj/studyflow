// Chart Configuration
const chartConfig = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      labels: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--text-dark').trim(),
        font: {
          family: "'-apple-system, BlinkMacSystemFont, Segoe UI, Roboto'",
          size: 12,
        },
      },
    },
  },
  scales: {
    y: {
      ticks: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--text-light').trim(),
      },
      grid: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--border').trim(),
      },
    },
    x: {
      ticks: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--text-light').trim(),
      },
      grid: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--border').trim(),
      },
    },
  },
};

// Weekly Chart
function createWeeklyChart(weeklyData) {
  const ctx = document.getElementById('weeklyChart');
  if (!ctx) return;

  const labels = Object.keys(weeklyData).map((date) => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
  });

  const data = Object.values(weeklyData);

  if (currentCharts.weekly) {
    currentCharts.weekly.destroy();
  }

  currentCharts.weekly = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Study Hours',
          data,
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 2,
          borderRadius: 5,
        },
      ],
    },
    options: {
      ...chartConfig,
      plugins: {
        ...chartConfig.plugins,
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          callbacks: {
            label: function (context) {
              return context.parsed.y.toFixed(1) + ' hrs';
            },
          },
        },
      },
    },
  });
}

// Subject Chart
function createSubjectChart(subjectWiseTime) {
  const ctx = document.getElementById('subjectChart');
  if (!ctx) return;

  const labels = subjectWiseTime.map((s) => s.name);
  const data = subjectWiseTime.map((s) => parseFloat(s.hours.toFixed(1)));
  const colors = subjectWiseTime.map((s) => s.color || '#3498db');

  if (currentCharts.subject) {
    currentCharts.subject.destroy();
  }

  currentCharts.subject = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--glass-bg').trim(),
          borderWidth: 2,
        },
      ],
    },
    options: {
      ...chartConfig,
      plugins: {
        ...chartConfig.plugins,
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.label + ': ' + context.parsed + ' hrs';
            },
          },
        },
      },
    },
  });
}

// Daily Chart
function createDailyChart(dailyData) {
  const ctx = document.getElementById('dailyChart');
  if (!ctx) return;

  const labels = Object.keys(dailyData);
  const data = Object.values(dailyData);

  if (currentCharts.daily) {
    currentCharts.daily.destroy();
  }

  currentCharts.daily = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Study Hours',
          data,
          borderColor: 'rgba(99, 102, 241, 1)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(99, 102, 241, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
        },
      ],
    },
    options: {
      ...chartConfig,
      plugins: {
        ...chartConfig.plugins,
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          callbacks: {
            label: function (context) {
              return context.parsed.y.toFixed(1) + ' hrs';
            },
          },
        },
      },
    },
  });
}

// Distribution Chart
function createDistributionChart(subjectData) {
  const ctx = document.getElementById('distributionChart');
  if (!ctx) return;

  const labels = Object.keys(subjectData);
  const data = Object.values(subjectData);

  // Generate colors
  const colors = [
    '#6366f1',
    '#ec4899',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#06b6d4',
    '#14b8a6',
  ];

  const backgroundColor = data.map((_, index) => colors[index % colors.length]);

  if (currentCharts.distribution) {
    currentCharts.distribution.destroy();
  }

  currentCharts.distribution = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--glass-bg').trim(),
          borderWidth: 2,
        },
      ],
    },
    options: {
      ...chartConfig,
      plugins: {
        ...chartConfig.plugins,
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.label + ': ' + context.parsed + ' hrs';
            },
          },
        },
      },
    },
  });
}

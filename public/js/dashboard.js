let currentCharts = {};

// Load Dashboard
async function loadDashboard() {
  try {
    await loadAnalytics();
    await loadSubjects();
    await loadTodayLogs();
    switchPage('dashboard');
  } catch (error) {
    showToast('Error loading dashboard', 'error');
  }
}

// Load Analytics
async function loadAnalytics() {
  try {
    const response = await fetch(`${API_BASE}/study-logs/analytics/dashboard`, {
      headers: getAuthHeader(),
    });

    const data = await response.json();

    document.getElementById('totalHours').textContent = `${data.totalHours} hrs`;
    document.getElementById('todayHours').textContent = `${data.todayHours} hrs`;
    document.getElementById('streakCount').textContent = `${data.streak} days 🔥`;
    document.getElementById('subjectCount').textContent = data.subjectWiseTime.length;

    // Weekly Chart
    createWeeklyChart(data.weeklyData);

    // Subject Chart
    createSubjectChart(data.subjectWiseTime);
  } catch (error) {
    console.error('Error loading analytics:', error);
  }
}

// Load Subjects
async function loadSubjects() {
  try {
    const response = await fetch(`${API_BASE}/subjects`, {
      headers: getAuthHeader(),
    });

    const subjects = await response.json();

    const grid = document.getElementById('subjectsGrid');
    grid.innerHTML = '';

    if (subjects.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1">No subjects yet. Add one to get started!</p>';
      return;
    }

    subjects.forEach((subject) => {
      const card = document.createElement('div');
      card.className = 'card glass subject-card';
      card.style.borderLeftColor = subject.color;

      card.innerHTML = `
        <h3 style="color: ${subject.color}">${subject.name}</h3>
        <p style="color: var(--text-light); font-size: 0.875rem">Created: ${new Date(subject.createdAt).toLocaleDateString()}</p>
        <div class="subject-actions">
          <button class="btn-edit" onclick="editSubject('${subject._id}', '${subject.name}', '${subject.color}')">Edit</button>
          <button class="btn-delete" onclick="deleteSubject('${subject._id}')">Delete</button>
        </div>
      `;

      grid.appendChild(card);
    });

    // Load subjects for select dropdowns
    populateSubjectSelects(subjects);
  } catch (error) {
    console.error('Error loading subjects:', error);
  }
}

// Populate Subject Selects
function populateSubjectSelects(subjects) {
  const selects = [
    document.getElementById('quickSubject'),
    document.getElementById('logSubject'),
  ];

  selects.forEach((select) => {
    const currentValue = select.value;
    select.innerHTML = '<option value="">Select subject...</option>';

    subjects.forEach((subject) => {
      const option = document.createElement('option');
      option.value = subject._id;
      option.textContent = subject.name;
      select.appendChild(option);
    });

    select.value = currentValue;
  });
}

// Load Today's Logs
async function loadTodayLogs() {
  try {
    const response = await fetch(`${API_BASE}/study-logs/today/logs`, {
      headers: getAuthHeader(),
    });

    const logs = await response.json();
    // This can be used to display recent logs on dashboard
  } catch (error) {
    console.error('Error loading today logs:', error);
  }
}

// Load All Logs
async function loadAllLogs() {
  try {
    const response = await fetch(`${API_BASE}/study-logs`, {
      headers: getAuthHeader(),
    });

    const logs = await response.json();
    displayLogs(logs);
  } catch (error) {
    console.error('Error loading logs:', error);
  }
}

// Display Logs
function displayLogs(logs) {
  const container = document.getElementById('logsContainer');
  container.innerHTML = '';

  if (logs.length === 0) {
    container.innerHTML = '<p>No study logs yet. Start tracking your study sessions!</p>';
    return;
  }

  logs.forEach((log) => {
    const logDiv = document.createElement('div');
    logDiv.className = 'card glass log-item';
    logDiv.style.borderLeftColor = log.subjectId?.color || '#3498db';

    const date = new Date(log.date).toLocaleDateString();
    const time = new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    logDiv.innerHTML = `
      <div class="log-info">
        <h4>${log.subjectId?.name || 'Subject'}</h4>
        <div class="log-meta">
          <span>${log.topic}</span>
          <span>${date} ${time}</span>
        </div>
      </div>
      <div class="log-duration">${(log.duration / 60).toFixed(1)} hrs</div>
      <span class="log-status ${log.status.toLowerCase()}">${log.status}</span>
      <div class="log-actions">
        <button class="btn btn-sm btn-secondary" onclick="deleteLog('${log._id}')">Delete</button>
      </div>
    `;

    container.appendChild(logDiv);
  });
}

// Filter Logs
async function filterLogs() {
  const filter = document.getElementById('logFilter').value;

  try {
    let response;
    if (filter === 'today') {
      response = await fetch(`${API_BASE}/study-logs/today/logs`, {
        headers: getAuthHeader(),
      });
    } else if (filter === 'week') {
      response = await fetch(`${API_BASE}/study-logs/week/logs`, {
        headers: getAuthHeader(),
      });
    } else {
      response = await fetch(`${API_BASE}/study-logs`, {
        headers: getAuthHeader(),
      });
    }

    const logs = await response.json();
    displayLogs(logs);
  } catch (error) {
    showToast('Error filtering logs', 'error');
  }
}

// Add Subject
document.getElementById('addSubjectForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('subjectName').value;
  const color = document.getElementById('subjectColor').value;

  try {
    const response = await fetch(`${API_BASE}/subjects`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ name, color }),
    });

    if (response.ok) {
      showToast('Subject added successfully', 'success');
      closeModal('addSubjectModal');
      await loadSubjects();
      document.getElementById('addSubjectForm').reset();
      document.getElementById('subjectColor').value = '#3498db';
      document.getElementById('colorPreview').style.backgroundColor = '#3498db';
    } else {
      showToast('Error adding subject', 'error');
    }
  } catch (error) {
    showToast('Error adding subject', 'error');
  }
});

// Edit Subject
async function editSubject(id, name, color) {
  const newName = prompt('Edit subject name:', name);
  if (!newName) return;

  try {
    const response = await fetch(`${API_BASE}/subjects/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ name: newName, color }),
    });

    if (response.ok) {
      showToast('Subject updated successfully', 'success');
      await loadSubjects();
    } else {
      showToast('Error updating subject', 'error');
    }
  } catch (error) {
    showToast('Error updating subject', 'error');
  }
}

// Delete Subject
async function deleteSubject(id) {
  if (!confirm('Are you sure you want to delete this subject?')) return;

  try {
    const response = await fetch(`${API_BASE}/subjects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    if (response.ok) {
      showToast('Subject deleted successfully', 'success');
      await loadSubjects();
    } else {
      showToast('Error deleting subject', 'error');
    }
  } catch (error) {
    showToast('Error deleting subject', 'error');
  }
}

// Add Study Log
document.getElementById('addLogForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const subjectId = document.getElementById('logSubject').value;
  const duration = parseInt(document.getElementById('logDuration').value);
  const topic = document.getElementById('logTopic').value;
  const status = document.getElementById('logStatus').value;
  const date = document.getElementById('logDate').value;

  try {
    const response = await fetch(`${API_BASE}/study-logs`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        subjectId,
        duration,
        topic,
        status,
        date: new Date(date).toISOString(),
      }),
    });

    if (response.ok) {
      showToast('Study log added successfully', 'success');
      closeModal('addLogModal');
      document.getElementById('addLogForm').reset();
      document.getElementById('logDate').valueAsDate = new Date();
      await loadDashboard();
    } else {
      showToast('Error adding study log', 'error');
    }
  } catch (error) {
    showToast('Error adding study log', 'error');
  }
});

// Quick Add Form
document.getElementById('quickAddForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const subjectId = document.getElementById('quickSubject').value;
  const duration = parseInt(document.getElementById('quickDuration').value);
  const topic = document.getElementById('quickTopic').value;

  try {
    const response = await fetch(`${API_BASE}/study-logs`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        subjectId,
        duration,
        topic,
        status: 'Completed',
        date: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      showToast('Study session logged successfully!', 'success');
      document.getElementById('quickAddForm').reset();
      await loadDashboard();
    } else {
      showToast('Error logging study session', 'error');
    }
  } catch (error) {
    showToast('Error logging study session', 'error');
  }
});

// Delete Log
async function deleteLog(id) {
  if (!confirm('Are you sure you want to delete this log?')) return;

  try {
    const response = await fetch(`${API_BASE}/study-logs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    if (response.ok) {
      showToast('Study log deleted', 'success');
      await loadAllLogs();
      await loadDashboard();
    } else {
      showToast('Error deleting log', 'error');
    }
  } catch (error) {
    showToast('Error deleting log', 'error');
  }
}

// Load subjects for modal
async function loadSubjectsForSelect() {
  try {
    const response = await fetch(`${API_BASE}/subjects`, {
      headers: getAuthHeader(),
    });

    const subjects = await response.json();
    populateSubjectSelects(subjects);
  } catch (error) {
    console.error('Error loading subjects for select:', error);
  }
}

// Switch Pages
function switchPage(pageName) {
  // Hide all pages
  document.querySelectorAll('.page').forEach((page) => {
    page.classList.remove('active');
  });

  // Update nav items
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.classList.remove('active');
  });

  // Show selected page
  document.getElementById(pageName + 'Page').classList.add('active');

  // Update nav item
  event.target.closest('.nav-item')?.classList.add('active');

  // Update page title
  const titles = {
    dashboard: 'Dashboard',
    subjects: 'Subjects',
    logs: 'Study Logs',
    analytics: 'Analytics',
  };

  document.getElementById('pageTitle').textContent = titles[pageName] || 'Dashboard';

  // Load data for specific pages
  if (pageName === 'logs') {
    loadAllLogs();
  } else if (pageName === 'analytics') {
    loadAnalyticsPage();
  }
}

// Load Analytics Page
async function loadAnalyticsPage() {
  try {
    const response = await fetch(`${API_BASE}/study-logs`, {
      headers: getAuthHeader(),
    });

    const logs = await response.json();

    // Daily Chart
    const dailyData = {};
    logs.forEach((log) => {
      const dateStr = new Date(log.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      if (!dailyData[dateStr]) dailyData[dateStr] = 0;
      dailyData[dateStr] += log.duration / 60;
    });

    createDailyChart(dailyData);

    // Distribution Chart
    const subjectData = {};
    logs.forEach((log) => {
      const subjectName = log.subjectId?.name || 'Unknown';
      if (!subjectData[subjectName]) subjectData[subjectName] = 0;
      subjectData[subjectName] += log.duration / 60;
    });

    createDistributionChart(subjectData);

    // Statistics
    const totalSessions = logs.length;
    const totalHours = logs.reduce((sum, log) => sum + log.duration / 60, 0);
    const avgDaily = totalHours / (logs.length > 0 ? Math.ceil(logs.length / 3) : 1);

    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekLogs = logs.filter((log) => new Date(log.date) >= weekAgo);
    const weeklyAvg = (weekLogs.reduce((sum, log) => sum + log.duration / 60, 0) / 7).toFixed(1);

    let mostActiveSubject = 'N/A';
    let maxHours = 0;
    Object.entries(subjectData).forEach(([subject, hours]) => {
      if (hours > maxHours) {
        maxHours = hours;
        mostActiveSubject = subject;
      }
    });

    document.getElementById('avgDaily').textContent = avgDaily.toFixed(1) + ' hrs';
    document.getElementById('totalSessions').textContent = totalSessions;
    document.getElementById('activeSubject').textContent = mostActiveSubject;
    document.getElementById('weeklyAvg').textContent = weeklyAvg + ' hrs';
  } catch (error) {
    console.error('Error loading analytics page:', error);
  }
}

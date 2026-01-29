const API_BASE = 'http://localhost:5000/api';

// Check if user is logged in on page load
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) {
    showAppUI();
    loadDashboard();
  } else {
    showAuthUI();
  }
  
  // Set today's date in log form
  document.getElementById('logDate').valueAsDate = new Date();
});

// Switch between login and register
function switchToRegister() {
  document.getElementById('loginPage').classList.remove('active');
  document.getElementById('registerPage').classList.add('active');
}

function switchToLogin() {
  document.getElementById('registerPage').classList.remove('active');
  document.getElementById('loginPage').classList.add('active');
}

// Show/hide UI
function showAuthUI() {
  document.getElementById('authContainer').classList.remove('hidden');
  document.getElementById('appContainer').classList.add('hidden');
}

function showAppUI() {
  document.getElementById('authContainer').classList.add('hidden');
  document.getElementById('appContainer').classList.remove('hidden');
  
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    document.getElementById('userGreeting').textContent = `Welcome back, ${user.name}!`;
  }
}

// Register
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      showToast('Registration successful!', 'success');
      showAppUI();
      loadDashboard();
    } else {
      showToast(data.message || 'Registration failed', 'error');
    }
  } catch (error) {
    showToast('Error registering', 'error');
  }

  document.getElementById('registerForm').reset();
});

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      showToast('Login successful!', 'success');
      showAppUI();
      loadDashboard();
    } else {
      showToast(data.message || 'Login failed', 'error');
    }
  } catch (error) {
    showToast('Error logging in', 'error');
  }

  document.getElementById('loginForm').reset();
});

// Logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showAuthUI();
  switchToLogin();
  showToast('Logged out successfully', 'success');
}

// Get Authorization Header
function getAuthHeader() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

// Show Toast
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden', 'error', 'success');
  toast.classList.add(type);

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// Dark Mode Toggle
function toggleTheme() {
  const html = document.documentElement;
  if (html.classList.contains('dark-mode')) {
    html.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  }
}

// Check for saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark-mode');
}

// Modal Functions
function openAddSubjectModal() {
  document.getElementById('addSubjectModal').classList.remove('hidden');
}

function openAddLogModal() {
  document.getElementById('addLogModal').classList.remove('hidden');
  loadSubjectsForSelect();
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

// Color picker update
document.getElementById('subjectColor').addEventListener('change', (e) => {
  document.getElementById('colorPreview').style.backgroundColor = e.target.value;
});

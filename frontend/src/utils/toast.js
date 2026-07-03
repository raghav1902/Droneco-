export const showToast = (message, type = 'success') => {
  const toastContainer = document.getElementById('toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type} animate-fade-in`;
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <span style="font-size: 1.25rem;">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      <span>${message}</span>
    </div>
  `;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

const createToastContainer = () => {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    z-index: 9999;
  `;
  document.body.appendChild(container);
  
  const style = document.createElement('style');
  style.innerHTML = `
    .toast {
      padding: 1rem 1.5rem;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
      min-width: 250px;
    }
    .toast-success { background: #10b981; }
    .toast-info { background: #3b82f6; }
    .toast-error { background: #ef4444; }
  `;
  document.head.appendChild(style);
  
  return container;
};

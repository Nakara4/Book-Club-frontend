// Screen reader announcement utility
// This creates an invisible aria-live region to announce state changes to screen readers

let announceRegion = null;

// Initialize the announcement region
const initializeAnnounceRegion = () => {
  if (announceRegion) return;
  
  announceRegion = document.createElement('div');
  announceRegion.setAttribute('aria-live', 'assertive');
  announceRegion.setAttribute('aria-atomic', 'true');
  announceRegion.setAttribute('role', 'status');
  announceRegion.style.position = 'absolute';
  announceRegion.style.left = '-10000px';
  announceRegion.style.width = '1px';
  announceRegion.style.height = '1px';
  announceRegion.style.overflow = 'hidden';
  announceRegion.id = 'screen-reader-announce';
  
  document.body.appendChild(announceRegion);
};

// Announce message to screen readers
export const announce = (message, priority = 'assertive') => {
  if (!message || typeof message !== 'string') return;
  
  // Initialize the region if it doesn't exist
  if (!announceRegion) {
    initializeAnnounceRegion();
  }
  
  // Set the priority level
  announceRegion.setAttribute('aria-live', priority);
  
  // Clear the region first to ensure the announcement is heard
  announceRegion.textContent = '';
  
  // Use a small delay to ensure screen readers pick up the change
  setTimeout(() => {
    announceRegion.textContent = message;
    
    // Clear the announcement after a short delay to keep the region clean
    setTimeout(() => {
      if (announceRegion.textContent === message) {
        announceRegion.textContent = '';
      }
    }, 1000);
  }, 100);
};

// Announce with polite priority (less intrusive)
export const announcePolite = (message) => {
  announce(message, 'polite');
};

// Clean up function for when the app unmounts
export const cleanupAnnounceRegion = () => {
  if (announceRegion && announceRegion.parentNode) {
    announceRegion.parentNode.removeChild(announceRegion);
    announceRegion = null;
  }
};

// Initialize on module load
if (typeof document !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnnounceRegion);
  } else {
    initializeAnnounceRegion();
  }
}

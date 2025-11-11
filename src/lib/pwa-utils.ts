// src/lib/pwa-utils.ts
// Utility functions for PWA functionality

/**
 * Register the service worker for PWA functionality
 */
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered: ', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed: ', error);
        });
    });
  }
}

/**
 * Check if the app is running as a standalone PWA
 */
export function isRunningStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as unknown as { standalone?: boolean }).standalone === true;
}

/**
 * Prompt user to install the PWA (for browsers that support it)
 */
export function promptInstallPWA(): void {
  const promptEvent = (window as unknown as { deferredPrompt?: Event }).deferredPrompt;
  if (!promptEvent) {
    console.log('No installation prompt available');
    // Show a message to the user
    alert('Installation is not available at this time. Please try again later or manually add to home screen.');
    return;
  }

  // Show the install prompt
  const installPrompt = promptEvent as unknown as {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: string }>;
  };
  
  installPrompt.prompt();
  
  // Wait for the user to respond to the prompt
  installPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      // Show a success message
      alert('App installed successfully! You can now use it from your home screen.');
      // Refresh the page to ensure proper installation
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      console.log('User dismissed the install prompt');
      // Show a message to the user
      alert('Installation cancelled. You can try again later.');
    }
    
    // Clear the saved prompt since it can't be used again
    (window as unknown as { deferredPrompt?: Event }).deferredPrompt = undefined;
  }).catch((error) => {
    console.error('Error during PWA installation prompt:', error);
    // Show an error message to the user
    alert('Installation failed. Please try again later.');
    // Clear the saved prompt since it can't be used again
    (window as unknown as { deferredPrompt?: Event }).deferredPrompt = undefined;
  });
}

/**
 * Check if PWA is installable
 */
export function isPWAInstallable(): boolean {
  return !!((window as unknown as { deferredPrompt?: Event }).deferredPrompt);
}

/**
 * Check if the device is iOS
 */
export function isIOS(): boolean {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}
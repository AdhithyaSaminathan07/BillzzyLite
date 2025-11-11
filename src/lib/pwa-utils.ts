// src/lib/pwa-utils.ts
// Utility functions for PWA functionality

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

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
          console.log('Service Worker registration failed: ', error);
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
  const promptEvent = (window as unknown as { deferredPrompt?: BeforeInstallPromptEvent }).deferredPrompt;
  if (!promptEvent) {
    console.log('No installation prompt available');
    return;
  }

  // Show the install prompt
  promptEvent.prompt();
  
  // Wait for the user to respond to the prompt
  promptEvent.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the saved prompt since it can't be used again
    (window as unknown as { deferredPrompt?: BeforeInstallPromptEvent }).deferredPrompt = undefined;
  });
}
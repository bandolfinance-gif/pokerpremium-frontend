// Registro do service worker + captura do evento de instalação do PWA.
// O Chrome/Android dispara "beforeinstallprompt" quando o site cumpre os
// requisitos de instalabilidade (manifest válido + service worker) — o
// navegador PRECISA que a gente chame preventDefault() e guarde o evento
// pra poder disparar o prompt depois, num clique nosso (não dá pra abrir
// esse prompt fora de uma interação direta do usuário).
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(available: boolean) => void>();

export const registerServiceWorker = () => {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Sem service worker o app continua funcionando normal — só perde
      // a opção de instalar como app.
    });
  });
};

export const listenForInstallPrompt = () => {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    listeners.forEach((cb) => cb(true));
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    listeners.forEach((cb) => cb(false));
  });
};

export const isInstallAvailable = () => deferredPrompt !== null;

export const onInstallAvailabilityChange = (cb: (available: boolean) => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

export const promptInstall = async (): Promise<boolean> => {
  if (!deferredPrompt) return false;
  await deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  listeners.forEach((cb) => cb(false));
  return outcome === 'accepted';
};

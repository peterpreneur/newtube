// Phone preview renders the app inside a phone-sized iframe, so viewport breakpoints
// behave exactly as on a real phone. The framed copy never frames itself.

const STORAGE_KEY = "phone-preview";
const CHANGE_EVENT = "phone-preview-change";

/** Viewport of the simulated phone (iPhone 15). */
export const PHONE_VIEWPORT = { width: 393, height: 852 };

function isFramed() {
  return window.self !== window.top;
}

export function isPhonePreview(): boolean {
  if (isFramed()) return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

export function setPhonePreview(on: boolean) {
  try {
    if (on) localStorage.setItem(STORAGE_KEY, "on");
    else localStorage.removeItem(STORAGE_KEY);
  } catch {}
  if (on) document.documentElement.dataset.device = "phone";
  else delete document.documentElement.dataset.device;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribePhonePreview(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * Runs in <head> before first paint and marks <html>, so CSS can hide the desktop page
 * instead of flashing it before the phone frame mounts. Mirrors isPhonePreview().
 */
export const PHONE_PREVIEW_INIT_SCRIPT = `(function(){try{if(window.self===window.top&&localStorage.getItem("${STORAGE_KEY}")==="on")document.documentElement.dataset.device="phone"}catch(e){}})()`;

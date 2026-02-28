import "@testing-library/jest-dom";
import { vi, afterEach } from "vitest";

// ── URL API ──────────────────────────────────────────────────────────────────
global.URL.createObjectURL = vi.fn(() => "blob:mock-url-object");
global.URL.revokeObjectURL = vi.fn();

// ── navigator.language ───────────────────────────────────────────────────────
Object.defineProperty(navigator, "language", {
  get: () => "es-ES",
  configurable: true,
});

// ── navigator.geolocation ────────────────────────────────────────────────────
Object.defineProperty(navigator, "geolocation", {
  value: {
    getCurrentPosition: vi.fn((successCallback) =>
      successCallback({
        coords: { latitude: 40.4168, longitude: -3.7038 },
      })
    ),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  },
  configurable: true,
  writable: true,
});

// ── navigator.mediaDevices (cámara) ──────────────────────────────────────────
Object.defineProperty(navigator, "mediaDevices", {
  value: {
    getUserMedia: vi.fn(() =>
      Promise.resolve({
        getTracks: () => [{ stop: vi.fn() }],
      })
    ),
  },
  configurable: true,
  writable: true,
});

// ── fetch global ─────────────────────────────────────────────────────────────
global.fetch = vi.fn();

// ── Limpiar todos los mocks entre tests ──────────────────────────────────────
afterEach(() => {
  vi.clearAllMocks();
});

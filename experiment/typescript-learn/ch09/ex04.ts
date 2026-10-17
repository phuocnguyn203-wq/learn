const DEFAULT_CONFIG = {
  apiBaseUrl: "htpps://api.ticketgo.test",
  timeoutMs: 5000,
  retry: {
    attempts: 3, backookMs: 200
  },
  features: {
    seatMap: true,
    waitlist: false
  }
}

type AppConfig = typeof DEFAULT_CONFIG;
type FeatureName = keyof typeof DEFAULT_CONFIG.features;

function withTimeout(config: AppConfig, timeoutMs: number) {
  return {
    ...config,
    timeoutMs
  }
}

function enableFeature(config: AppConfig, feature: FeatureName) {
  return {
    ...config,
    features: { ...config["features"], [feature]: true }
  }
}

function isEnabled(config: AppConfig, feature: FeatureName) {
  return config["features"][feature];
}

const staging = enableFeature(withTimeout(DEFAULT_CONFIG, 15000), "waitlist");
console.log(staging.timeoutMs, isEnabled(staging, "waitlist"));          // 15000 true
console.log(DEFAULT_CONFIG.timeoutMs, isEnabled(DEFAULT_CONFIG, "waitlist"));  // 5000 false

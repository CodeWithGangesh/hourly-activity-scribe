
const RINGTONE_KEY = "hourly-alert-ringtone";
const VOLUME_KEY = "hourly-alert-volume";
const ENABLED_KEY = "hourly-alert-enabled";

// Default ringtone path
const DEFAULT_RINGTONE = "/sounds/bell.mp3";

export const saveRingtone = (ringtoneUrl: string): void => {
  localStorage.setItem(RINGTONE_KEY, ringtoneUrl);
};

export const getRingtone = (): string => {
  const ringtone = localStorage.getItem(RINGTONE_KEY);
  return ringtone || DEFAULT_RINGTONE;
};

export const saveVolume = (volume: number): void => {
  localStorage.setItem(VOLUME_KEY, volume.toString());
};

export const getVolume = (): number => {
  const volume = localStorage.getItem(VOLUME_KEY);
  return volume ? parseFloat(volume) : 1.0; // Default to 100% volume
};

export const saveEnabled = (enabled: boolean): void => {
  localStorage.setItem(ENABLED_KEY, enabled.toString());
};

export const getEnabled = (): boolean => {
  const enabled = localStorage.getItem(ENABLED_KEY);
  return enabled === null ? true : enabled === "true"; // Default to enabled
};

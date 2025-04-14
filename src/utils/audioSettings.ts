
const RINGTONE_KEY = "hourly-alert-ringtone";
const VOLUME_KEY = "hourly-alert-volume";
const ENABLED_KEY = "hourly-alert-enabled";
const CUSTOM_RINGTONES_KEY = "custom-ringtones";

// Default ringtone path
const DEFAULT_RINGTONE = "/sounds/bell.mp3";

export const saveRingtone = (ringtoneUrl: string): void => {
  try {
    localStorage.setItem(RINGTONE_KEY, ringtoneUrl);
  } catch (error) {
    console.error("Error saving ringtone:", error);
  }
};

export const getRingtone = (): string => {
  try {
    const ringtone = localStorage.getItem(RINGTONE_KEY);
    return ringtone || DEFAULT_RINGTONE;
  } catch (error) {
    console.error("Error getting ringtone:", error);
    return DEFAULT_RINGTONE;
  }
};

export const saveVolume = (volume: number): void => {
  try {
    localStorage.setItem(VOLUME_KEY, volume.toString());
  } catch (error) {
    console.error("Error saving volume:", error);
  }
};

export const getVolume = (): number => {
  try {
    const volume = localStorage.getItem(VOLUME_KEY);
    return volume ? parseFloat(volume) : 0.7; // Default to 70% volume
  } catch (error) {
    console.error("Error getting volume:", error);
    return 0.7;
  }
};

export const saveEnabled = (enabled: boolean): void => {
  try {
    localStorage.setItem(ENABLED_KEY, enabled.toString());
  } catch (error) {
    console.error("Error saving enabled state:", error);
  }
};

export const getEnabled = (): boolean => {
  try {
    const enabled = localStorage.getItem(ENABLED_KEY);
    return enabled === null ? true : enabled === "true"; // Default to enabled
  } catch (error) {
    console.error("Error getting enabled state:", error);
    return true;
  }
};

export const saveCustomRingtone = (name: string, url: string): void => {
  try {
    const existingRingtones = getCustomRingtones();
    existingRingtones.push({ name, url });
    localStorage.setItem(CUSTOM_RINGTONES_KEY, JSON.stringify(existingRingtones));
  } catch (error) {
    console.error("Error saving custom ringtone:", error);
  }
};

export const getCustomRingtones = (): Array<{ name: string; url: string }> => {
  try {
    const ringtones = localStorage.getItem(CUSTOM_RINGTONES_KEY);
    return ringtones ? JSON.parse(ringtones) : [];
  } catch (error) {
    console.error("Error getting custom ringtones:", error);
    return [];
  }
};

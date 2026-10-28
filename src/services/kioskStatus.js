import { NativeModules, Platform } from 'react-native';
const KIOSK_STATES = new Set(['locked', 'none', 'pinned']);
/**
 * Reads Android's Lock Task Mode state through the KioskStatus native module.
 * Resolves to 'locked' | 'pinned' | 'none' | 'unavailable' | 'unknown'.
 * It never throws and never changes the device state.
 */
export async function getKioskState() {
    const { KioskStatus } = NativeModules;
    if (Platform.OS !== 'android' || !KioskStatus) {
        return 'unavailable';
    }
    try {
        const state = await KioskStatus.getLockTaskModeState();
        return KIOSK_STATES.has(state) ? state : 'unknown';
    }
    catch {
        return 'unknown';
    }
}

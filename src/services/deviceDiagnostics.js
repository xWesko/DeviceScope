import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { getKioskState } from './kioskStatus';
const DEVICE_TYPES = {
    Desktop: 'desktop',
    GamingConsole: 'other',
    Handset: 'phone',
    Tablet: 'tablet',
    Tv: 'tv',
};
// react-native-device-info reports missing values as 'unknown', '' or -1.
const normalize = (value) => {
    if (value === undefined || value === null || value === '' || value === 'unknown') {
        return null;
    }
    if (typeof value === 'number' && (Number.isNaN(value) || value < 0)) {
        return null;
    }
    return value;
};
// Each field is read on its own so one failure never hides the rest.
const read = async (getter) => {
    try {
        return normalize(await getter());
    }
    catch {
        return null;
    }
};
/**
 * Collects the device information that does not change with the window size.
 * Personal identifiers (serial, IMEI, MAC, unique/advertising IDs) are never read.
 */
export async function collectDiagnostics() {
    const isAndroid = Platform.OS === 'android';
    const [manufacturer, deviceName, apiLevel, abis, isEmulator, totalDisk, freeDisk, totalMemory, powerState, kioskState,] = await Promise.all([
        read(DeviceInfo.getManufacturer),
        read(DeviceInfo.getDeviceName),
        isAndroid ? read(DeviceInfo.getApiLevel) : null,
        read(DeviceInfo.supportedAbis),
        read(DeviceInfo.isEmulator),
        read(DeviceInfo.getTotalDiskCapacity),
        read(DeviceInfo.getFreeDiskStorage),
        read(DeviceInfo.getTotalMemory),
        read(DeviceInfo.getPowerState),
        getKioskState(),
    ]);
    const deviceType = DEVICE_TYPES[await read(DeviceInfo.getDeviceType)] ?? 'unknown';
    return {
        abis: abis?.length ? abis : null,
        androidApiLevel: apiLevel,
        app: {
            buildNumber: await read(DeviceInfo.getBuildNumber),
            bundleId: await read(DeviceInfo.getBundleId),
            name: await read(DeviceInfo.getApplicationName),
            version: await read(DeviceInfo.getVersion),
        },
        battery: {
            level: normalize(powerState?.batteryLevel),
            lowPowerMode: powerState?.lowPowerMode ?? null,
            state: normalize(powerState?.batteryState),
        },
        brand: await read(DeviceInfo.getBrand),
        collectedAt: new Date().toISOString(),
        deviceId: await read(DeviceInfo.getDeviceId),
        deviceName,
        deviceType,
        freeDisk,
        isEmulator,
        kioskState,
        manufacturer,
        model: await read(DeviceInfo.getModel),
        osName: await read(DeviceInfo.getSystemName),
        osVersion: await read(DeviceInfo.getSystemVersion),
        platform: isAndroid ? 'android' : 'ios',
        totalDisk,
        totalMemory,
    };
}

import i18n from '@/translations';
import { formatBoolean, formatBytes, formatDateTime, formatMemory, formatNumber, formatPercent, formatValue, } from './formatters';
const t = (key, options) => i18n.t(key, options);
export const getFriendlyName = ({ deviceType, platform }) => {
    if (platform === 'ios') {
        if (deviceType === 'phone') {
            return t('friendly_name.iphone');
        }
        return deviceType === 'tablet' ? t('friendly_name.ipad') : t('friendly_name.ios_other');
    }
    if (['phone', 'tablet', 'tv'].includes(deviceType)) {
        return t(`friendly_name.android_${deviceType}`);
    }
    return t('friendly_name.android_other');
};
export const getPlatformLabel = (platform) => platform === 'android' ? 'Android' : 'iOS';
const row = (labelKey, value, extra = {}) => ({
    label: t(`fields.${labelKey}`),
    value,
    ...extra,
});
/**
 * Builds the labelled sections shown on screen and used by the text report.
 * `diagnostics` comes from collectDiagnostics(); `screen` from the window hook.
 */
export function buildSections(diagnostics, screen) {
    const d = diagnostics;
    const isAndroid = d.platform === 'android';
    const isLandscape = screen.width > screen.height;
    return [
        {
            key: 'device',
            rows: [
                row('platform', getPlatformLabel(d.platform)),
                row('device_type', t(`device_type.${d.deviceType}`)),
                row('manufacturer', formatValue(d.manufacturer)),
                row('brand', formatValue(d.brand)),
                row('model', formatValue(d.model)),
                row('device_id', formatValue(d.deviceId)),
                // The user-defined name can contain personal data: shown, never copied.
                row('device_name', formatValue(d.deviceName), { private: true }),
                row('is_emulator', formatBoolean(d.isEmulator)),
            ],
            title: t('sections.device'),
        },
        {
            key: 'os',
            rows: [
                row('system_name', formatValue(d.osName)),
                row('os_version', formatValue(d.osVersion)),
                ...(isAndroid ? [row('api_level', formatValue(d.androidApiLevel))] : []),
                row('abis', formatValue(d.abis?.join(', '))),
            ],
            title: t('sections.os'),
        },
        {
            key: 'screen',
            rows: [
                row('window_size', `${Math.round(screen.width)} × ${Math.round(screen.height)} ${isAndroid ? 'dp' : 'pt'}`),
                row('window_pixels', `${Math.round(screen.width * screen.scale)} × ${Math.round(screen.height * screen.scale)} px`, { note: t('notes.window_pixels') }),
                row('screen_size', `${Math.round(screen.screenWidth)} × ${Math.round(screen.screenHeight)} ${isAndroid ? 'dp' : 'pt'}`),
                row('pixel_ratio', formatNumber(screen.scale)),
                row('font_scale', formatNumber(screen.fontScale)),
                row('orientation', t(`orientation.${isLandscape ? 'landscape' : 'portrait'}`)),
            ],
            title: t('sections.screen'),
        },
        {
            key: 'resources',
            note: d.isEmulator ? t('notes.emulator_battery') : undefined,
            rows: [
                row('total_disk', formatBytes(d.totalDisk)),
                row('free_disk', formatBytes(d.freeDisk)),
                row('total_memory', formatMemory(d.totalMemory)),
                row('battery_level', formatPercent(d.battery.level)),
                row('battery_state', d.battery.state
                    ? t(`battery_state.${d.battery.state}`)
                    : formatValue(null)),
                row('low_power', formatBoolean(d.battery.lowPowerMode)),
            ],
            title: t('sections.resources'),
        },
        {
            key: 'kiosk',
            note: t(`kiosk_note.${d.kioskState}`),
            rows: [
                row('kiosk_state', t(`kiosk_state.${d.kioskState}`)),
            ],
            title: t('sections.kiosk'),
        },
        {
            key: 'app',
            rows: [
                row('app_name', formatValue(d.app.name)),
                row('app_version', formatValue(d.app.version)),
                row('build_number', formatValue(d.app.buildNumber)),
                row('bundle_id', formatValue(d.app.bundleId)),
                row('platform', getPlatformLabel(d.platform)),
            ],
            title: t('sections.app'),
        },
    ];
}
/**
 * Plain-text report for copy/share. Excludes rows marked as private.
 */
export function buildReport(sections, generatedAt = new Date()) {
    const lines = [
        `${t('diagnostics.title')} — ${t('diagnostics.subtitle')}`,
        `Generado: ${formatDateTime(generatedAt)} (hora local)`,
    ];
    for (const section of sections) {
        lines.push('', `[${section.title}]`);
        for (const item of section.rows.filter((r) => !r.private)) {
            lines.push(`${item.label}: ${item.value}`);
        }
        if (section.note) {
            lines.push(`Nota: ${section.note}`);
        }
    }
    return lines.join('\n');
}

import i18n from '@/translations';
const GB = 1000 ** 3;
const GIB = 1024 ** 3;
const MB = 1000 ** 2;
export const isMissing = (value) => value === undefined ||
    value === null ||
    value === '' ||
    (typeof value === 'number' && Number.isNaN(value));
export const formatValue = (value) => isMissing(value) ? i18n.t('common_unavailable') : String(value);
export const formatBoolean = (value) => {
    if (isMissing(value)) {
        return i18n.t('common_unavailable');
    }
    return value ? i18n.t('common_yes') : i18n.t('common_no');
};
// Disk sizes use decimal units (as Android/iOS settings do); RAM uses binary units.
export const formatBytes = (bytes, unit = GB) => {
    if (isMissing(bytes)) {
        return i18n.t('common_unavailable');
    }
    if (bytes < unit) {
        return `${Math.round(bytes / (unit === GIB ? 1024 ** 2 : MB))} MB`;
    }
    return `${(bytes / unit).toFixed(1)} GB`;
};
export const formatMemory = (bytes) => formatBytes(bytes, GIB);
export const formatPercent = (ratio) => isMissing(ratio) ? i18n.t('common_unavailable') : `${Math.round(ratio * 100)} %`;
export const formatNumber = (value, decimals = 2) => isMissing(value) ? i18n.t('common_unavailable') : String(Number(value.toFixed(decimals)));
export const formatDateTime = (date) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

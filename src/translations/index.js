import 'intl-pluralrules';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from './es-ES.json';
export const defaultNS = 'devicescope';
export const resources = {
    'es-ES': es,
};
void i18n.use(initReactI18next).init({
    defaultNS,
    fallbackLng: 'es-ES',
    lng: 'es-ES',
    resources,
});
export { default } from 'i18next';

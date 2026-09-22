import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en';
import id from './id';

i18n.use(initReactI18next).init({
compatibilityJSON: 'v3',
lng:'en',
fallbackLng: 'en',
lng: 'id',
fallbackLng: 'id',
resources: {
	en: en,
	id:id
},
interpolation: {
	escapeValue: false // react already safes from xss
}
});

export default i18n;

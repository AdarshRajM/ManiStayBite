import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to StayBite",
      "dashboard": "Dashboard",
      "rooms": "Rooms",
      "foods": "Foods",
      "book_now": "Book Now"
    }
  },
  hi: {
    translation: {
      "welcome": "स्टेबाइट में आपका स्वागत है",
      "dashboard": "डैशबोर्ड",
      "rooms": "कमरे",
      "foods": "भोजन",
      "book_now": "अभी बुक करें"
    }
  },
  pa: {
    translation: {
      "welcome": "ਸਟੇਬਾਈਟ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ",
      "dashboard": "ਡੈਸ਼ਬੋਰਡ",
      "rooms": "ਕਮਰੇ",
      "foods": "ਭੋਜਨ",
      "book_now": "ਹੁਣੇ ਬੁੱਕ ਕਰੋ"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

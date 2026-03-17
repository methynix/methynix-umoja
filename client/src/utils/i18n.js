import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome_back": "Welcome back",
      "dashboard": "Dashboard",
      "shares": "Shares",
      "loans": "Loans",
      "profile": "Profile",
      "logout": "Logout",
      "total_shares": "Total Shares",
      "borrowing_power": "Borrowing Power",
      "social_fund": "Social Fund",
      "recent_transactions": "Recent Transactions"
    }
  },
  sw: {
    translation: {
      "welcome_back": "Karibu tena",
      "dashboard": "Dashibodi",
      "shares": "Hisa",
      "loans": "Mikopo",
      "profile": "Wasifu",
      "logout": "Ondoka",
      "total_shares": "Jumla ya Hisa",
      "borrowing_power": "Uwezo wa Kukopa",
      "social_fund": "Mfuko wa Jamii",
      "recent_transactions": "Miamala ya Karibuni"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "sw", 
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
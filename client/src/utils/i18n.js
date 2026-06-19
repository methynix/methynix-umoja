import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      dashboard: "Dashboard",
      shares: "Shares",
      loans: "Loans",
      members: "Members",
      profile: "Profile",
      logout: "Logout",
      welcome_back: "Welcome back",
      total_shares: "Total Shares",
      borrowing_power: "Borrowing Power",
      social_fund: "Social Fund",
      recent_transactions: "Recent Transactions",
      unpaid_alert_title: "Payment Reminder",
      unpaid_alert_desc: "You haven't paid shares for this month. Please contact the Secretary.",
      manage_console: "Management Console",
      approvals: "Approvals",
      groups: "VICOBA Groups",
      session: "New Session",
      activity: "Activity",
      date: "Date",
      amount: "Amount",
      status: "Status",
      verified: "Verified"
    }
  },
  sw: {
    translation: {
      dashboard: "Dashibodi",
      shares: "Hisa",
      loans: "Mikopo",
      members: "Wanachama",
      profile: "Wasifu",
      logout: "Ondoka",
      welcome_back: "Karibu tena",
      total_shares: "Jumla ya Hisa",
      borrowing_power: "Uwezo wa Kukopa",
      social_fund: "Mfuko wa Jamii",
      recent_transactions: "Miamala ya Karibuni",
      unpaid_alert_title: "Tahadhari ya Malipo",
      unpaid_alert_desc: "Haujalipa michango ya mwezi huu. Tafadhali wasiliana na Katibu.",
      manage_console: "Usimamizi",
      approvals: "Idhinisho",
      groups: "Vikundi vya VICOBA",
      session: "Kikao Kipya",
      activity: "Shughuli",
      date: "Tarehe",
      amount: "Kiasi",
      status: "Hali",
      verified: "Imethibitishwa"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lng') || 'sw',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
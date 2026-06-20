import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const en = {
  dashboard: 'Dashboard', shares: 'Shares', loans: 'Loans', members: 'Members',
  profile: 'Profile', logout: 'Logout', settings: 'Settings', groups: 'Groups',
  welcome_back: 'Welcome back', total_shares: 'Total Shares', borrowing_power: 'Borrowing Power',
  social_fund: 'Social Fund', recent_transactions: 'Recent Transactions',
  manage_console: 'Management Console', approvals: 'Approvals', session: 'New Session',
  date: 'Date', amount: 'Amount', status: 'Status', verified: 'Verified',
  view_all: 'View All', transaction_type: 'Transaction Type', system_capital: 'System Capital',
  active_groups: 'Active Groups', all_users: 'All Users', your_group: 'Your Group',
  system_admins: 'Admins', maintenance: 'Maintenance',

  cancel: 'Cancel', confirm_yes: 'Yes, Confirm', executing: 'Executing...',
  logout_confirm_title: 'Log out?', logout_confirm_msg: 'Are you sure you want to log out of your account?',

  theme: 'Theme', dark_mode: 'Dark Mode', light_mode: 'Light Mode', language: 'Language',
  appearance: 'Appearance', account_security: 'Account Security',
  current_password: 'Current password', new_password: 'New password',
  save_new_password: 'Save New Password', saving: 'Saving...', password_changed: 'Password changed!',
  phone_number: 'Phone Number', group_name: 'Group Name', member_no: 'Member No',

  members_title: 'Members', register_member: 'Register Member', search_member: 'Search by name or phone...',
  no_members: 'No member found', full_name: 'Full Name', user_role: 'Role in Group',
  first_shares: 'Initial Shares (TZS)', social_fund_input: 'Social Fund (TZS)',
  first_password_note: 'The first password will be the member\'s name in lowercase (no spaces).',
  complete_registration: 'Complete Registration', registering: 'Registering...',
  use_groups_title: 'Use the Groups Page',
  use_groups_desc: 'As Super Admin, you view members by entering one group at a time, instead of one huge list of all users (for system performance).',
  go_to_groups: 'Go to Groups',

  record_contribution: 'Record Contribution Payment', payment_month: 'Payment Month',
  contribution_type: 'Contribution Type', share_type: 'Shares', social_type: 'Social Fund',
  amount_tzs: 'Amount (TZS)', save_contribution: 'Save Contribution', time_not_yet: '(Not yet)',
  delete_member_title: 'Remove Member?',
  delete_member_msg: 'Are you sure you want to remove {{name}} from the system? This action cannot be undone.',
  enter_amount: 'Enter amount', amount_gt_zero: 'Amount must be greater than 0',

  loans_title: 'Loans & Debts', loans_subtitle: 'Loan & Repayment Management',
  request_new_loan: 'Request New Loan', borrow_limit: 'Borrowing Limit (3x Shares)',
  total_debt: 'Total Debt (+10% Interest)', paid_so_far: 'Paid so far', loan_history: 'Loan History',
  principal: 'Principal', total_with_interest: 'Total (+Interest)', returned: 'Returned',
  remaining: 'Remaining', approved: 'Approved', pending: 'Pending', rejected: 'Rejected',
  no_loans: 'You have no loan requests', loan_request: 'Loan Request', your_limit: 'Your Limit',
  amount_needed: 'Amount Needed (TZS)', loan_purpose: 'Loan Purpose',
  purpose_placeholder: 'Briefly explain the use of this loan...', interest_note: '10% interest applies to every loan.',
  send_request: 'Send Request', sending: 'Sending...', reason: 'Reason', personal: 'Personal',

  approvals_title: 'Loan Requests', applicant: 'Applicant', goal: 'Goal',
  reject: 'Reject', approve: 'Approve', no_pending: 'No new requests awaiting approval right now.',
  approve_loan_title: 'Approve Loan?', reject_loan_title: 'Reject Loan?',
  approve_loan_msg: 'Are you sure you want to approve the TZS {{amount}} loan for {{name}}?',
  reject_loan_msg: 'Are you sure you want to reject {{name}}\'s loan request?',

  groups_mgmt: 'Group Management', groups_mgmt_sub: 'Manage all groups and core system settings',
  search_group: 'Search group...', register_co_admin: 'Register Co-Admin',
  view_members: 'View Members', no_groups: 'No group found', page_of: 'Page {{page}} of {{pages}}',
  group_code: 'Group Code', maintenance_on_warn: 'System is under Maintenance. Other users cannot log in until you turn this off.',
  co_admin_title: 'Register Co-Admin',
  co_admin_note: 'They will get full Super Admin rights (not a group member).', register: 'Register',
  enable_maintenance_q: 'Enable Maintenance?', disable_maintenance_q: 'Disable Maintenance?',
  enable_maintenance_msg: 'If enabled, all other users will be unable to log in or use the system until you turn it off. You (Super Admin) keep logging in normally.',
  disable_maintenance_msg: 'The system will go back online and all users can log in again.',

  group_members_title: 'Group Members', total: 'Total', name: 'Name', join_date: 'Join Date',
  no_group_members: 'This group has no members yet', back: 'Back',
  load_members_fail: 'Failed to load this group\'s members.', back_to_groups: 'Back to Groups',

  yearly_ledger: 'Yearly Ledger', fiscal_year: 'Fiscal Year', system_ready: 'System Ready',
  total_savings_shares: 'Total Savings (Shares)', monthly_breakdown: 'Monthly Breakdown',
  paid: 'Paid', not_paid: 'Not Paid', time_pending: 'Pending', share_label: 'Shares', social_label: 'Social',

  maintenance_title: 'System', maintenance_word: 'Maintenance',
  maintenance_desc: 'We are improving your Vicoba system for better security and service. Please try again shortly.',
  back_to_login: 'Back to login',

  not_found_title: 'Page Not Found', not_found_desc: 'The page you are looking for has been moved or does not exist.',
  go_home: 'GO HOME',

  welcome_login: 'Karibu tena | Welcome back', login_btn: 'Log In to Account', logging_in: 'Logging in...',
  not_member_yet: 'Not a member yet?', register_group_here: 'Register a Group Here',
  pin_label: 'Password / PIN', enter_password: 'Enter your password',

  register_title: 'Member & Group Registration', personal_info: 'Personal Information',
  group_info: 'Group Information', confirm_password: 'Confirm Password',
  group_code_note: 'If you are the first to register this Code, you automatically become the group Admin (Leader).',
  complete_signup: 'Complete Registration', signing_up: 'Registering Information...',
  already_account: 'Already have a group account?', login_here: 'Log In Here',

  role_superadmin: 'Super Admin', role_admin: 'Chairperson', role_secretary: 'Secretary', role_member: 'Member',
  required_field: 'This field is required',
};

const sw = {
  dashboard: 'Dashibodi', shares: 'Hisa', loans: 'Mikopo', members: 'Wanachama',
  profile: 'Wasifu', logout: 'Ondoka', settings: 'Mipangilio', groups: 'Vikundi',
  welcome_back: 'Karibu tena', total_shares: 'Jumla ya Hisa', borrowing_power: 'Uwezo wa Kukopa',
  social_fund: 'Mfuko wa Jamii', recent_transactions: 'Miamala ya Karibuni',
  manage_console: 'Usimamizi', approvals: 'Idhinisho', session: 'Kikao Kipya',
  date: 'Tarehe', amount: 'Kiasi', status: 'Hali', verified: 'Imethibitishwa',
  view_all: 'Angalia Zote', transaction_type: 'Aina ya Miamala', system_capital: 'Mtaji wa Mfumo',
  active_groups: 'Vikundi Hai', all_users: 'Wanachama Wote', your_group: 'Kikundi Chako',
  system_admins: 'Wasimamizi', maintenance: 'Matengenezo',

  cancel: 'Ghairi', confirm_yes: 'Ndio, Thibitisha', executing: 'Inatekeleza...',
  logout_confirm_title: 'Ondoka?', logout_confirm_msg: 'Je, una uhakika unataka kuondoka kwenye akaunti yako?',

  theme: 'Muonekano', dark_mode: 'Giza (Dark Mode)', light_mode: 'Mwangaza (Light Mode)', language: 'Lugha',
  appearance: 'Muonekano (Theme)', account_security: 'Usalama wa Akaunti',
  current_password: 'Nywila ya sasa', new_password: 'Nywila mpya',
  save_new_password: 'Hifadhi Nywila Mpya', saving: 'Inahifadhi...', password_changed: 'Nywila imebadilishwa!',
  phone_number: 'Namba ya Simu', group_name: 'Jina la Kikundi', member_no: 'Namba',

  members_title: 'Wanachama', register_member: 'Sajili Mwanachama', search_member: 'Tafuta kwa jina au namba ya simu...',
  no_members: 'Hakuna mwanachama aliyepatikana', full_name: 'Jina Kamili', user_role: 'Wajibu Kwenye Kikundi',
  first_shares: 'Hisa za Kwanza (TZS)', social_fund_input: 'Mfuko wa Jamii (TZS)',
  first_password_note: 'Nywila ya kwanza itakuwa jina la mwanachama kwa herufi ndogo (bila nafasi).',
  complete_registration: 'Kamilisha Usajili', registering: 'Inasajili...',
  use_groups_title: 'Tumia Ukurasa wa Vikundi',
  use_groups_desc: 'Kama Msimamizi Mkuu, unaona wanachama kwa kuingia kikundi kimoja baada ya kingine, badala ya orodha kubwa ya watumiaji wote (kwa ufanisi wa mfumo).',
  go_to_groups: 'Nenda kwenye Vikundi',

  record_contribution: 'Rekodi Malipo ya Mchango', payment_month: 'Mwezi wa Malipo',
  contribution_type: 'Aina ya Mchango', share_type: 'Hisa', social_type: 'Mfuko wa Jamii',
  amount_tzs: 'Kiasi cha Fedha (TZS)', save_contribution: 'Hifadhi Mchango', time_not_yet: '(Muda bado)',
  delete_member_title: 'Ondoa Mwanachama?',
  delete_member_msg: 'Je, una uhakika unataka kumfuta {{name}} kutoka kwenye mfumo? Kitendo hiki hakina marekebisho.',
  enter_amount: 'Ingiza kiasi', amount_gt_zero: 'Kiasi lazima kiwe zaidi ya 0',

  loans_title: 'Mikopo & Madeni', loans_subtitle: 'Usimamizi wa Mikopo na Marejesho',
  request_new_loan: 'Omba Mkopo Mpya', borrow_limit: 'Kikomo cha Kukopa (3x Hisa)',
  total_debt: 'Deni Lote (+Riba 10%)', paid_so_far: 'Umesharudisha', loan_history: 'Historia ya Mikopo',
  principal: 'Kiasi (Principal)', total_with_interest: 'Jumla (+Riba)', returned: 'Umesharudisha',
  remaining: 'Deni Lililobaki', approved: 'Kimekubaliwa', pending: 'Kinasubiri', rejected: 'Kimekataliwa',
  no_loans: 'Huna maombi yoyote ya mikopo', loan_request: 'Ombi la Mkopo', your_limit: 'Kikomo Chako',
  amount_needed: 'Kiasi Unachohitaji (TZS)', loan_purpose: 'Sababu ya Mkopo',
  purpose_placeholder: 'Elezea kwa ufupi matumizi ya mkopo huu...', interest_note: 'Riba ya 10% itatumika kwa kila mkopo.',
  send_request: 'Tuma Ombi', sending: 'Inatuma...', reason: 'Sababu', personal: 'Binafsi',

  approvals_title: 'Maombi ya Mikopo', applicant: 'Mwombaji', goal: 'Lengo',
  reject: 'Kataa', approve: 'Idhinisha', no_pending: 'Hakuna maombi mapya yanayosubiri idhini kwa sasa.',
  approve_loan_title: 'Idhinisha Mkopo?', reject_loan_title: 'Kataa Mkopo?',
  approve_loan_msg: 'Je, una uhakika unataka kuidhinisha mkopo wa TZS {{amount}} kwa {{name}}?',
  reject_loan_msg: 'Je, una uhakika unataka kukataa ombi la mkopo la {{name}}?',

  groups_mgmt: 'Usimamizi wa Vikundi', groups_mgmt_sub: 'Dhibiti vikundi vyote na mipangilio mikuu ya mfumo',
  search_group: 'Tafuta kikundi...', register_co_admin: 'Sajili Msimamizi Mwenzako',
  view_members: 'Angalia Wanachama', no_groups: 'Hakuna kikundi kilichopatikana', page_of: 'Ukurasa {{page}} kati ya {{pages}}',
  group_code: 'Code ya Kikundi', maintenance_on_warn: 'Mfumo upo kwenye Matengenezo. Watumiaji wengine wameshindwa kuingia hadi utakapozima hali hii.',
  co_admin_title: 'Sajili Msimamizi Mwenzako',
  co_admin_note: 'Watapata mamlaka kamili ya Msimamizi Mkuu (sio mwanachama wa kikundi).', register: 'Sajili',
  enable_maintenance_q: 'Washa Matengenezo?', disable_maintenance_q: 'Zima Matengenezo?',
  enable_maintenance_msg: 'Ukiwasha, watumiaji wengine wote hawataweza kuingia wala kutumia mfumo hadi utakapozima. Wewe (Msimamizi Mkuu) utaendelea kuingia kawaida.',
  disable_maintenance_msg: 'Mfumo utarudi mtandaoni na watumiaji wote wataweza kuingia tena.',

  group_members_title: 'Wanachama wa Kikundi', total: 'Jumla', name: 'Jina', join_date: 'Tarehe ya Kujiunga',
  no_group_members: 'Kikundi hiki hakina wanachama bado', back: 'Rudi',
  load_members_fail: 'Imeshindwa kupakua wanachama wa kikundi hiki.', back_to_groups: 'Rudi kwenye Vikundi',

  yearly_ledger: 'Daftari la Mwaka', fiscal_year: 'Mwaka wa Fedha', system_ready: 'Mfumo Upo Tayari',
  total_savings_shares: 'Jumla ya Akiba (Hisa)', monthly_breakdown: 'Mchanganuo wa Kila Mwezi',
  paid: 'Kimelipwa', not_paid: 'Haijalipwa', time_pending: 'Muda Bado', share_label: 'Hisa', social_label: 'Jamii',

  maintenance_title: 'Mfumo', maintenance_word: 'Matengenezo',
  maintenance_desc: 'Tunaboresha mfumo wako wa Vicoba kwa ajili ya usalama na huduma bora zaidi. Tafadhali jaribu tena baada ya muda mfupi.',
  back_to_login: 'Rudi kuingia (Login)',

  not_found_title: 'Ukurasa Haupo', not_found_desc: 'Ukurasa unaoutafuta umehamishwa au haupo.',
  go_home: 'RUDI NYUMBANI',

  welcome_login: 'Karibu tena | Welcome back', login_btn: 'Ingia Kwenye Akaunti', logging_in: 'Inaingia...',
  not_member_yet: 'Sio mwanachama bado?', register_group_here: 'Sajili Kikundi Hapa',
  pin_label: 'Neno la Siri / PIN', enter_password: 'Ingiza nywila yako',

  register_title: 'Usajili wa Mwanachama & Kikundi', personal_info: 'Taarifa Binafsi',
  group_info: 'Taarifa za Kikundi', confirm_password: 'Thibitisha Nywila',
  group_code_note: 'Kama wewe ni wa kwanza kusajili Code hii, utakuwa Admin (Kiongozi) wa kikundi hiki moja kwa moja.',
  complete_signup: 'Kamilisha Usajili', signing_up: 'Inasajili Taarifa...',
  already_account: 'Tayari una akaunti ya kikundi?', login_here: 'Ingia Hapa',

  role_superadmin: 'Msimamizi Mkuu', role_admin: 'Mwenyekiti', role_secretary: 'Katibu', role_member: 'Mwanachama',
  required_field: 'Sehemu hii ni lazima',
};

i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, sw: { translation: sw } },
    lng: localStorage.getItem('lng') || 'sw',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;

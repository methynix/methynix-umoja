import React from 'react';
import { FaUserShield } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import LegalPageLayout, { Section } from '../components/LegalPageLayout';

const CONTENT = {
  sw: {
    title: 'Sera ya Faragha',
    updated: 'Imesasishwa:',
    sections: [
      {
        heading: '1. Taarifa Tunazokusanya',
        body: (
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Jina lako kamili na namba ya simu (zinahitajika kwa usajili na uthibitisho).</li>
            <li>Email (si lazima, isipokuwa unapotaka kutumia huduma ya kuweka upya password).</li>
            <li>Taarifa za kifedha za kikundi unazoziingiza: hisa, michango, mikopo na malipo.</li>
            <li>Taarifa za kiufundi kama kifaa unachotumia, ili kuboresha utendaji wa mfumo.</li>
          </ul>
        ),
      },
      {
        heading: '2. Jinsi Tunavyotumia Taarifa Zako',
        body: (
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Kuthibitisha utambulisho wako (OTP kwa SMS au email) kabla ya kukupa ufikiaji wa akaunti.</li>
            <li>Kukutumia arifa muhimu kuhusu mikopo, michango, mikutano na faini za kikundi chako.</li>
            <li>Kuzuia matumizi mabaya, udanganyifu, au ufikiaji usioruhusiwa wa akaunti.</li>
            <li>Kuboresha huduma na kutatua matatizo ya kiufundi.</li>
          </ul>
        ),
      },
      {
        heading: '3. Ushirikiano na Watoa Huduma Wengine',
        body: (
          <p>
            Ili kutuma OTP na arifa, tunatumia huduma za nje kama vile mtoa huduma wa SMS na
            barua-pepe (SMTP). Taarifa ndogo tu zinazohitajika (namba ya simu au email, na ujumbe)
            zinashirikishwa nao kwa lengo hilo pekee. Hatutauza au kukodisha taarifa zako binafsi
            kwa mtu yeyote wa tatu kwa madhumuni ya matangazo.
          </p>
        ),
      },
      {
        heading: '4. Usalama wa Taarifa',
        body: (
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Password zote zinahifadhiwa kwa njia ya usimbaji (hashing) — hakuna anayeweza kuziona kwa uwazi, hata sisi.</li>
            <li>OTP zinahifadhiwa kwa muda mfupi tu na kufutwa baada ya kutumika au kuisha muda wake.</li>
            <li>Ufikiaji wa taarifa za kikundi umewekewa mipaka kulingana na nafasi yako (Mwanachama, Katibu, Muweka Hazina, Mwenyekiti).</li>
          </ul>
        ),
      },
      {
        heading: '5. Haki Zako',
        body: (
          <p>
            Una haki ya kuomba kuona, kusahihisha, au kufuta taarifa zako binafsi tulizonazo,
            isipokuwa pale ambapo sheria au mahitaji ya uendeshaji wa kikundi yanahitaji kuzihifadhi.
            Wasiliana nasi kupitia ukurasa wa{' '}
            <a href="/support-us" className="text-vicoba-forest font-bold underline">
              Tusaidie / Support Us
            </a>{' '}
            kufanya ombi lolote.
          </p>
        ),
      },
      {
        heading: '6. Uhifadhi wa Taarifa',
        body: (
          <p>
            Taarifa zako zinahifadhiwa kwa muda unaohitajika kuendesha huduma, au mpaka uombe
            kufutwa kwa akaunti yako, isipokuwa endapo sheria inahitaji kuzihifadhi kwa muda mrefu zaidi.
          </p>
        ),
      },
      {
        heading: '7. Mabadiliko ya Sera',
        body: (
          <p>
            Sera hii inaweza kusasishwa mara kwa mara. Tutawajulisha watumiaji endapo kuna
            mabadiliko makubwa yanayoathiri jinsi taarifa zao zinavyotumika.
          </p>
        ),
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated:',
    sections: [
      {
        heading: '1. Information We Collect',
        body: (
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Your full name and phone number (required for registration and verification).</li>
            <li>Email address (optional, required only if you wish to use the password-reset service).</li>
            <li>Group financial records you enter: shares, contributions, loans, and repayments.</li>
            <li>Technical details such as the device you use, to improve system performance.</li>
          </ul>
        ),
      },
      {
        heading: '2. How We Use Your Information',
        body: (
          <ul className="list-disc pl-5 space-y-1.5">
            <li>To verify your identity (OTP via SMS or email) before granting access to your account.</li>
            <li>To send you important notifications about loans, contributions, meetings, and fines for your group.</li>
            <li>To prevent misuse, fraud, or unauthorised access to accounts.</li>
            <li>To improve the service and resolve technical issues.</li>
          </ul>
        ),
      },
      {
        heading: '3. Third-Party Service Providers',
        body: (
          <p>
            To send OTPs and notifications, we use external providers such as an SMS gateway and
            email (SMTP). Only the minimum information required (phone number or email, and the
            message) is shared with them for that purpose alone. We will never sell or rent your
            personal information to any third party for advertising purposes.
          </p>
        ),
      },
      {
        heading: '4. Data Security',
        body: (
          <ul className="list-disc pl-5 space-y-1.5">
            <li>All passwords are stored using cryptographic hashing — nobody can see them in plain text, including us.</li>
            <li>OTPs are stored only briefly and deleted after use or expiry.</li>
            <li>Access to group data is restricted based on your role (Member, Secretary, Treasurer, Chairperson).</li>
          </ul>
        ),
      },
      {
        heading: '5. Your Rights',
        body: (
          <p>
            You have the right to request access to, correction of, or deletion of your personal
            information we hold, except where the law or group operational requirements require it
            to be retained. Contact us via the{' '}
            <a href="/support-us" className="text-vicoba-forest font-bold underline">
              Support Us
            </a>{' '}
            page to make any request.
          </p>
        ),
      },
      {
        heading: '6. Data Retention',
        body: (
          <p>
            Your information is retained for as long as is necessary to provide the service, or
            until you request deletion of your account, unless the law requires it to be kept
            for a longer period.
          </p>
        ),
      },
      {
        heading: '7. Changes to This Policy',
        body: (
          <p>
            This policy may be updated from time to time. Users will be notified of any significant
            changes that affect how their information is used.
          </p>
        ),
      },
    ],
  },
};

const PrivacyPolicyPage = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'sw';
  const c = CONTENT[lang];
  const dateStr = new Date().toLocaleDateString(lang === 'sw' ? 'sw-TZ' : 'en-GB', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <LegalPageLayout
      icon={<FaUserShield />}
      title={c.title}
      subtitle={`${c.updated} ${dateStr}`}
    >
      {c.sections.map((s) => (
        <Section key={s.heading} title={s.heading}>
          {s.body}
        </Section>
      ))}
    </LegalPageLayout>
  );
};

export default PrivacyPolicyPage;

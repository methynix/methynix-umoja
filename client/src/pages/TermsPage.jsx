import React from 'react';
import { FaFileContract } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import LegalPageLayout, { Section } from '../components/LegalPageLayout';

const CONTENT = {
  sw: {
    title: 'Masharti ya Matumizi',
    updated: 'Imesasishwa:',
    sections: [
      {
        heading: '1. Utangulizi',
        body: (
          <p>
            Karibu kwenye Methynix Vicoba. Masharti haya ya Matumizi yanaelezea sheria na masharti
            yanayosimamia matumizi yako ya mfumo huu wa kidijitali wa kusimamia VICOBA na vikundi
            vya kuweka na kukopa. Kwa kutumia mfumo huu, unakubali kufungwa na masharti haya.
          </p>
        ),
      },
      {
        heading: '2. Mfumo ni Chombo cha Kusaidia Uendeshaji, Si Taasisi ya Fedha',
        body: (
          <p>
            Methynix Vicoba ni mfumo wa kurekodi na kufuatilia shughuli za kikundi chako (hisa,
            michango, mikopo na malipo) ili kuongeza uwazi na urahisi wa uendeshaji. Mfumo HAUSHIKI,
            HAUTUNZI wala HAUSIMAMII fedha halisi za kikundi. Fedha zote zinabaki mikononi mwa
            uongozi wa kikundi chako kwa mujibu wa katiba na taratibu zenu wenyewe.
          </p>
        ),
      },
      {
        heading: '3. Wajibu wa Watumiaji',
        body: (
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Kuweka taarifa sahihi wakati wa kujisajili na kuzisasisha pale zinapobadilika.</li>
            <li>Kutunza siri namba yako ya simu, password, na OTP. Usimpe mtu mwingine.</li>
            <li>
              Viongozi wa kikundi wanawajibika kuhakikisha taarifa wanazoziingiza kwenye mfumo
              (michango, mikopo, malipo) ni sahihi na zinaendana na fedha halisi.
            </li>
            <li>Kutoutumia mfumo kwa shughuli zozote za udanganyifu au zinazokiuka sheria za Tanzania.</li>
          </ul>
        ),
      },
      {
        heading: '4. Usalama wa Akaunti',
        body: (
          <p>
            Akaunti mpya za wanachama zinazosajiliwa na uongozi huthibitishwa kwa SMS kabla ya kuwa
            hai, ili kuhakikisha namba ya simu inamilikiwa na mhusika husika. Una wajibu wa kuripoti
            mara moja endapo unahisi akaunti yako imeingiliwa na mtu asiyeruhusiwa.
          </p>
        ),
      },
      {
        heading: '5. Mipaka ya Dhima',
        body: (
          <p>
            Methynix Software haitawajibika kwa migogoro, hasara ya fedha, au matumizi mabaya ya
            fedha yanayotokana na maamuzi au matendo ya viongozi wa kikundi nje ya mfumo. Wajibu
            wetu ni kuhakikisha mfumo unafanya kazi vizuri na taarifa zilizoingizwa zinarekodiwa
            kwa usahihi unaolingana na vile zilivyowekwa.
          </p>
        ),
      },
      {
        heading: '6. Mabadiliko ya Masharti',
        body: (
          <p>
            Tunaweza kusasisha masharti haya mara kwa mara ili kuendana na maboresho ya mfumo au
            mahitaji ya kisheria. Mabadiliko makubwa yatatangazwa kwenye mfumo.
          </p>
        ),
      },
      {
        heading: '7. Mawasiliano',
        body: (
          <p>
            Kwa maswali kuhusu masharti haya, wasiliana nasi kupitia ukurasa wa{' '}
            <a href="/support-us" className="text-vicoba-forest font-bold underline">
              Tusaidie / Support Us
            </a>
            .
          </p>
        ),
      },
    ],
  },
  en: {
    title: 'Terms of Service',
    updated: 'Last updated:',
    sections: [
      {
        heading: '1. Introduction',
        body: (
          <p>
            Welcome to Methynix Vicoba. These Terms of Service describe the rules and conditions
            governing your use of this digital management system for VICOBA and savings groups. By
            using this system, you agree to be bound by these terms.
          </p>
        ),
      },
      {
        heading: '2. The System is a Management Tool, Not a Financial Institution',
        body: (
          <p>
            Methynix Vicoba is a system for recording and tracking your group's transactions (shares,
            contributions, loans, and repayments) to improve transparency and ease of management.
            The system does NOT hold, store, or control the group's actual funds. All money remains
            in the hands of your group's leadership in accordance with your own constitution and
            procedures.
          </p>
        ),
      },
      {
        heading: '3. User Responsibilities',
        body: (
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Provide accurate information when registering and update it when it changes.</li>
            <li>Keep your phone number, password, and OTP confidential. Do not share them with anyone.</li>
            <li>
              Group leaders are responsible for ensuring that information entered into the system
              (contributions, loans, payments) is accurate and matches actual funds received or
              disbursed.
            </li>
            <li>Do not use the system for fraudulent activities or anything that violates Tanzanian law.</li>
          </ul>
        ),
      },
      {
        heading: '4. Account Security',
        body: (
          <p>
            New member accounts registered by group leadership are verified by SMS before becoming
            active, to confirm the phone number belongs to the correct person. You are responsible
            for reporting immediately if you believe your account has been accessed by an
            unauthorised person.
          </p>
        ),
      },
      {
        heading: '5. Limitation of Liability',
        body: (
          <p>
            Methynix Software is not liable for disputes, financial losses, or misuse of funds
            resulting from decisions or actions taken by group leaders outside the system. Our
            responsibility is to ensure the system works correctly and that information entered is
            recorded accurately as submitted.
          </p>
        ),
      },
      {
        heading: '6. Changes to These Terms',
        body: (
          <p>
            We may update these terms from time to time to reflect improvements to the system or
            legal requirements. Significant changes will be announced within the system.
          </p>
        ),
      },
      {
        heading: '7. Contact',
        body: (
          <p>
            For questions about these terms, contact us via the{' '}
            <a href="/support-us" className="text-vicoba-forest font-bold underline">
              Support Us
            </a>{' '}
            page.
          </p>
        ),
      },
    ],
  },
};

const TermsPage = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'sw';
  const c = CONTENT[lang];
  const dateStr = new Date().toLocaleDateString(lang === 'sw' ? 'sw-TZ' : 'en-GB', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <LegalPageLayout
      icon={<FaFileContract />}
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

export default TermsPage;

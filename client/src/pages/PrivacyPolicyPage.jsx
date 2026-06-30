import React from 'react';
import { FaUserShield } from 'react-icons/fa6';
import LegalPageLayout, { Section } from '../components/LegalPageLayout';

const PrivacyPolicyPage = () => (
  <LegalPageLayout
    icon={<FaUserShield />}
    title="Sera ya Faragha"
    subtitle={`Yalisasishwa mara ya mwisho: ${new Date().toLocaleDateString('sw-TZ', { year: 'numeric', month: 'long', day: 'numeric' })}`}
  >
    <Section title="1. Taarifa Tunazokusanya">
      <ul className="list-disc pl-5 space-y-1.5">
        <li>Jina lako kamili na namba ya simu (zinahitajika kwa usajili na uthibitisho).</li>
        <li>Email (si lazima, isipokuwa unapotaka kutumia huduma ya kuweka upya password).</li>
        <li>Taarifa za kifedha za kikundi unazoziingiza: hisa, michango, mikopo na malipo.</li>
        <li>Taarifa za kiufundi kama kifaa unachotumia, ili kuboresha utendaji wa mfumo.</li>
      </ul>
    </Section>

    <Section title="2. Jinsi Tunavyotumia Taarifa Zako">
      <ul className="list-disc pl-5 space-y-1.5">
        <li>Kuthibitisha utambulisho wako (OTP kwa SMS au email) kabla ya kukupa ufikiaji wa akaunti.</li>
        <li>Kukutumia arifa muhimu kuhusu mikopo, michango, mikutano na faini za kikundi chako.</li>
        <li>Kuzuia matumizi mabaya, udanganyifu, au ufikiaji usioruhusiwa wa akaunti.</li>
        <li>Kuboresha huduma na kutatua matatizo ya kiufundi.</li>
      </ul>
    </Section>

    <Section title="3. Ushirikiano na Watoa Huduma Wengine">
      <p>
        Ili kutuma OTP na arifa, tunatumia huduma za nje kama vile mtoa huduma wa SMS na barua-pepe
        (SMTP). Taarifa ndogo tu zinazohitajika (namba ya simu au email, na ujumbe) zinashirikishwa
        nao kwa lengo hilo pekee. Hatutauza au kukodisha taarifa zako binafsi kwa mtu yeyote wa tatu
        kwa madhumuni ya matangazo.
      </p>
    </Section>

    <Section title="4. Usalama wa Taarifa">
      <ul className="list-disc pl-5 space-y-1.5">
        <li>Password zote zinahifadhiwa kwa njia ya usimbaji (encryption/hashing) — hakuna anayeweza kuziona kwa uwazi, hata sisi.</li>
        <li>OTP zinahifadhiwa kwa muda mfupi tu na kufutwa baada ya kutumika au kuisha muda wake.</li>
        <li>Ufikiaji wa taarifa za kikundi umewekewa mipaka kulingana na nafasi yako (Mwanachama, Katibu, Muweka Hazina, Mwenyekiti).</li>
      </ul>
    </Section>

    <Section title="5. Haki Zako">
      <p>
        Una haki ya kuomba kuona, kusahihisha, au kufuta taarifa zako binafsi tulizonazo, isipokuwa
        pale ambapo sheria au mahitaji ya uendeshaji wa kikundi yanahitaji kuzihifadhi. Wasiliana
        nasi kupitia ukurasa wa{' '}
        <a href="/support-us" className="text-vicoba-forest font-bold underline">Tusaidie / Support Us</a>{' '}
        kufanya ombi lolote.
      </p>
    </Section>

    <Section title="6. Uhifadhi wa Taarifa">
      <p>
        Taarifa zako zinahifadhiwa kwa muda unaohitajika kuendesha huduma, au mpaka uombe kufutwa
        kwa akaunti yako, isipokuwa endapo sheria inahitaji kuzihifadhi kwa muda mrefu zaidi.
      </p>
    </Section>

    <Section title="7. Mabadiliko ya Sera">
      <p>
        Sera hii inaweza kusasishwa mara kwa mara. Tutawajulisha watumiaji endapo kuna mabadiliko
        makubwa yanayoathiri jinsi taarifa zao zinavyotumika.
      </p>
    </Section>
  </LegalPageLayout>
);

export default PrivacyPolicyPage;

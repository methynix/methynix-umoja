import React from 'react';
import { FaFileContract } from 'react-icons/fa6';
import LegalPageLayout, { Section } from '../components/LegalPageLayout';

const TermsPage = () => (
  <LegalPageLayout
    icon={<FaFileContract />}
    title="Masharti ya Matumizi"
    subtitle={`Yalisasishwa mara ya mwisho: ${new Date().toLocaleDateString('sw-TZ', { year: 'numeric', month: 'long', day: 'numeric' })}`}
  >
    <Section title="1. Utangulizi">
      <p>
        Karibu kwenye Methynix Umoja ("Mfumo", "sisi", "yetu"). Masharti haya ya Matumizi yanaelezea
        sheria na masharti yanayosimamia matumizi yako ya mfumo huu wa kidijitali wa kusimamia VICOBA
        na vikundi vya kuweka na kukopa. Kwa kutumia mfumo huu, unakubali kufungwa na masharti haya.
      </p>
    </Section>

    <Section title="2. Mfumo ni Chombo cha Kusaidia Uendeshaji, Si Taasisi ya Fedha">
      <p>
        Methynix Umoja ni mfumo wa kurekodi na kufuatilia shughuli za kikundi chako (hisa, michango,
        mikopo na malipo) ili kuongeza uwazi na urahisi wa uendeshaji. Mfumo HAUSHIKI, HAUTUNZI wala
        HAUSIMAMII fedha halisi za kikundi. Fedha zote zinabaki mikononi mwa uongozi wa kikundi chako
        (Mwenyekiti, Katibu, Muweka Hazina) kwa mujibu wa katiba na taratibu zenu wenyewe.
      </p>
    </Section>

    <Section title="3. Wajibu wa Watumiaji">
      <ul className="list-disc pl-5 space-y-1.5">
        <li>Kuweka taarifa sahihi wakati wa kujisajili na kuzisasisha pale zinapobadilika.</li>
        <li>Kutunza siri namba yako ya simu, password, na OTP — usimpe mtu mwingine.</li>
        <li>Viongozi wa kikundi (Mwenyekiti, Katibu, Muweka Hazina) wanawajibika kuhakikisha taarifa
          wanazoziingiza kwenye mfumo (michango, mikopo, malipo) ni sahihi na zinaendana na fedha
          halisi zilizopokelewa au kutolewa.</li>
        <li>Kutoutumia mfumo kwa shughuli zozote za udanganyifu au zinazokiuka sheria za Tanzania.</li>
      </ul>
    </Section>

    <Section title="4. Usalama wa Akaunti">
      <p>
        Akaunti mpya za wanachama zinazosajiliwa na uongozi huthibitishwa kwa SMS kabla ya kuwa hai,
        ili kuhakikisha namba ya simu inamilikiwa na mhusika husika. Una wajibu wa kuripoti mara moja
        endapo unahisi akaunti yako imeingiliwa na mtu asiyeruhusiwa.
      </p>
    </Section>

    <Section title="5. Mipaka ya Dhima (Limitation of Liability)">
      <p>
        Methynix Software haitawajibika kwa migogoro, hasara ya fedha, au matumizi mabaya ya fedha
        yanayotokana na maamuzi au matendo ya viongozi wa kikundi nje ya mfumo. Wajibu wetu ni
        kuhakikisha mfumo unafanya kazi vizuri na taarifa zilizoingizwa zinarekodiwa kwa usahihi
        unaolingana na vile zilivyowekwa.
      </p>
    </Section>

    <Section title="6. Mabadiliko ya Masharti">
      <p>
        Tunaweza kusasisha masharti haya mara kwa mara ili kuendana na maboresho ya mfumo au
        mahitaji ya kisheria. Mabadiliko makubwa yatatangazwa kwenye mfumo.
      </p>
    </Section>

    <Section title="7. Mawasiliano">
      <p>
        Kwa maswali kuhusu masharti haya, wasiliana nasi kupitia ukurasa wa{' '}
        <a href="/support-us" className="text-vicoba-forest font-bold underline">Tusaidie / Support Us</a>.
      </p>
    </Section>
  </LegalPageLayout>
);

export default TermsPage;

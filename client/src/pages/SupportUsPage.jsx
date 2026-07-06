import React from 'react';
import { FaHandHoldingHeart, FaWhatsapp, FaPhone, FaComments, FaBug, FaShareNodes } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import LegalPageLayout, { Section } from '../components/LegalPageLayout';
import { DEV_PHONE, DEV_WHATSAPP } from '../utils/contact';

const CONTENT = {
  sw: {
    title: 'Tusaidie',
    subtitle: 'Mfumo huu unajengwa na kutunzwa na timu ndogo ili kusaidia vikundi vya VICOBA na Chama nchini Tanzania.',
    why_heading: 'Kwa Nini Msaada Wako Ni Muhimu',
    why_body: 'Kuendesha mfumo huu (server, ujumbe wa SMS wa kuthibitisha wanachama, barua-pepe, na maboresho ya kudumu) kunagharimu fedha na muda. Mchango wowote unaotoka kwako unatusaidia kuendelea kutoa huduma hii kwa vikundi vingi zaidi, kwa gharama nafuu iwezekanavyo.',
    ways_heading: 'Njia za Kuchangia',
    ways_body: 'Kwa sasa hatuoneshi namba za malipo hadharani kwa sababu za usalama. Kama unataka kuchangia chochote, iwe fedha au mawazo, wasiliana nasi moja kwa moja na tutakupa maelekezo salama ya jinsi ya kufanya hivyo.',
    whatsapp: 'Tuandikie WhatsApp',
    call: 'Piga Simu',
    nonfinancial_heading: 'Njia Nyingine za Kutusaidia (Bila Fedha)',
    cards: [
      { icon: <FaComments />, title: 'Tupe Maoni', desc: 'Tuambie kinachofanya kazi na kinachohitaji kuboreshwa.' },
      { icon: <FaBug />, title: 'Ripoti Hitilafu', desc: 'Ukikuta tatizo lolote, tujulishe haraka iwezekanavyo.' },
      { icon: <FaShareNodes />, title: 'Washirikishe Wengine', desc: 'Mwambie kiongozi wa kikundi kingine kuhusu Methynix Vicoba.' },
    ],
    thanks: 'Asante kwa kuwa sehemu ya safari hii.',
  },
  en: {
    title: 'Support Us',
    subtitle: 'This system is built and maintained by a small team to help VICOBA and Chama savings groups across Tanzania.',
    why_heading: 'Why Your Support Matters',
    why_body: 'Running this system — servers, SMS verification messages, email, and ongoing improvements — costs money and time. Any contribution from you helps us continue delivering this service to more groups, at the lowest possible cost.',
    ways_heading: 'How to Contribute',
    ways_body: "We don't display payment details publicly for security reasons. If you'd like to contribute anything, whether money or ideas, contact us directly and we'll give you safe instructions on how to do so.",
    whatsapp: 'Message us on WhatsApp',
    call: 'Call Us',
    nonfinancial_heading: 'Other Ways to Help (No Money Needed)',
    cards: [
      { icon: <FaComments />, title: 'Give Feedback', desc: 'Tell us what is working and what needs to be improved.' },
      { icon: <FaBug />, title: 'Report a Bug', desc: 'If you find any problem, let us know as quickly as possible.' },
      { icon: <FaShareNodes />, title: 'Spread the Word', desc: 'Tell another group leader about Methynix Vicoba.' },
    ],
    thanks: 'Thank you for being part of this journey.',
  },
};

const SupportUsPage = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'sw';
  const c = CONTENT[lang];

  return (
    <LegalPageLayout icon={<FaHandHoldingHeart />} title={c.title} subtitle={c.subtitle}>
      <Section title={c.why_heading}>
        <p>{c.why_body}</p>
      </Section>

      <Section title={c.ways_heading}>
        <p>{c.ways_body}</p>
        <div className="flex flex-col sm:flex-row gap-3 pt-3">
          <a
            href={DEV_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-vicoba-forest text-vicoba-cream font-bold text-sm border-2 border-vicoba-dark shadow-[3px_3px_0_0_#2E302E] hover:shadow-[1px_1px_0_0_#2E302E] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <FaWhatsapp size={16} /> {c.whatsapp}
          </a>
          <a
            href={`tel:${DEV_PHONE.replace(/\s/g, '')}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-vicoba-cream text-vicoba-dark font-bold text-sm border-2 border-vicoba-dark shadow-[3px_3px_0_0_#2E302E] hover:shadow-[1px_1px_0_0_#2E302E] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <FaPhone size={14} /> {DEV_PHONE}
          </a>
        </div>
      </Section>

      <Section title={c.nonfinancial_heading}>
        <div className="grid sm:grid-cols-3 gap-4 pt-1">
          {c.cards.map((card) => (
            <div key={card.title} className="flex flex-col items-center text-center gap-2 p-4 border border-vicoba-dark/10 bg-vicoba-cream">
              <div className="text-vicoba-forest text-xl">{card.icon}</div>
              <p className="text-xs font-bold text-vicoba-dark">{card.title}</p>
              <p className="text-[11px] text-vicoba-dark/60 font-medium">{card.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <p className="text-sm text-vicoba-dark/50 font-medium text-center pt-2">{c.thanks}</p>
    </LegalPageLayout>
  );
};

export default SupportUsPage;

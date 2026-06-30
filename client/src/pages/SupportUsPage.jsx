import React from 'react';
import { FaHandHoldingHeart, FaWhatsapp, FaPhone, FaComments, FaBug, FaShareNodes } from 'react-icons/fa6';
import LegalPageLayout, { Section } from '../components/LegalPageLayout';
import { DEV_PHONE, DEV_WHATSAPP } from '../utils/contact';

const SupportUsPage = () => (
  <LegalPageLayout
    icon={<FaHandHoldingHeart />}
    title="Tusaidie / Support Us"
    subtitle="Mfumo huu unajengwa na kutunzwa na timu ndogo ili kusaidia vikundi vya VICOBA na Vyama nchini."
  >
    <Section title="Kwa Nini Msaada Wako Ni Muhimu">
      <p>
        Kuendesha mfumo huu , server, ujumbe wa SMS wa kuthibitisha wanachama, barua-pepe, na
        maboresho ya kudumu , kunagharimu fedha na muda. Mchango wowote unaotoka kwako unatusaidia
        kuendelea kutoa huduma hii kwa vikundi vingi zaidi, kwa gharama nafuu iwezekanavyo.
      </p>
    </Section>

    <Section title="Njia za Kuchangia">
      <p>
        Kwa sasa hatuoneshi namba za malipo hadharani kwa sababu za usalama. Kama unataka
        kuchangia chochote , fedha au mawazo , wasiliana nasi moja kwa moja na tutakupa maelekezo
        salama ya jinsi ya kufanya hivyo.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 pt-3">
        <a
          href={DEV_WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors shadow-md shadow-emerald-600/20"
        >
          <FaWhatsapp size={18} /> Tuandikie WhatsApp
        </a>
        <a
          href={`tel:${DEV_PHONE.replace(/\s/g, '')}`}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white dark:bg-gray-900 border-2 border-vicoba-forest text-vicoba-forest hover:bg-emerald-50 font-bold text-sm transition-colors"
        >
          <FaPhone /> {DEV_PHONE}
        </a>
      </div>
    </Section>

    <Section title="Njia Nyingine za Kutusaidia (Bila Fedha)">
      <div className="grid sm:grid-cols-3 gap-4 pt-1">
        <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-vicoba-cream dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
          <FaComments className="text-vicoba-forest" size={20} />
          <p className="text-xs font-bold text-vicoba-dark dark:text-gray-100">Tupe Maoni</p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Tuambie kinachofanya kazi na kinachohitaji kuboreshwa.</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-vicoba-cream dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
          <FaBug className="text-vicoba-forest" size={20} />
          <p className="text-xs font-bold text-vicoba-dark dark:text-gray-100">Ripoti Hitilafu</p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Ukikuta tatizo lolote, tujulishe haraka iwezekanavyo.</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-vicoba-cream dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
          <FaShareNodes className="text-vicoba-forest" size={20} />
          <p className="text-xs font-bold text-vicoba-dark dark:text-gray-100">Washirikishe Wengine</p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Mwambie kiongozi wa kikundi kingine kuhusu Methynix Umoja.</p>
        </div>
      </div>
    </Section>

    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium text-center pt-2">
      Asante kwa kuwa sehemu ya safari hii.
    </p>
  </LegalPageLayout>
);

export default SupportUsPage;

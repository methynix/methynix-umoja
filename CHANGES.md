# Methynix Umoja — Marekebisho ya Production (Fixes)

Hii ni orodha ya kila kitu kilichorekebishwa. Imegawanywa: **Bugs zilizovunja
features**, **Mantiki ya majukumu (roles)**, na **UI/UX**.

Mwisho kuna maelekezo ya jinsi ya kuendesha.

---

## A. Bugs zilizokuwa zinavunja features kabisa

1. **React Query v5: `isLoading` → `isPending`.**
   Mradi unatumia TanStack Query v5, ambapo *mutations* hutumia `isPending`.
   Code ilikuwa inatumia `isLoading` (ambayo ni `undefined` v5), kwa hiyo button
   ZILIKUWA HAZI-DISABLE na hazi-onyeshi loading — ndiyo sababu mtumiaji
   alibonyeza mara nyingi. Imerekebishwa kwenye `MembersPage`, `LoansPage`,
   `LoanApprovalPage`, `GroupManagementPage`.

2. **`useTransaction.js` haikuwa ime-`import toast`** ilhali iliitumia.
   Kurekodi mchango kulikuwa kuna-crash (`ReferenceError`). Imerekebishwa.

3. **Transaction model haikuendana na service.**
   Service ilihifadhi `groupId/month/year` lakini model ilihitaji `groupCode`
   (haikupelekwa) na haikuwa na `month/year`. Matokeo: **kurekodi mchango
   kuli-fail**, na **daftari la mwezi lilikuwa tupu daima**. Model + service
   zimerekebishwa, na frontend sasa inapeleka `month` na `year`.

4. **Route ya kuidhinisha mkopo (`PATCH /loans/:id/status`) haikuwepo** —
   approval ilikuwa 404. Imeongezwa.

5. **Route ya kufuta mwanachama (`DELETE /users/members/:id`) haikuwepo** —
   kufuta kulikuwa 404. Imeongezwa.

6. **Route ya kuona wanachama wa kikundi kimoja (`GET /groups/:id/members`)
   haikuwepo** (controller ipo, route haipo) — "Angalia Wanachama" ilikuwa
   inakwama. Imeongezwa + ukurasa mpya `GroupMembersPage`.

7. **`authController` ilitumia `AppError` bila ku-import** — kubadilisha
   password kwa kosa kuli-crash. Imerekebishwa.

---

## B. Mantiki ya majukumu (per matakwa yako)

8. **Superadmin = Manager (mipaka wazi).** Niliondoa "blanket bypass" ya
   superadmin ndani ya `restrictTo` iliyokuwa inamruhusu kufanya KILA kitu.
   Sasa kila route inaorodhesha roles zinazoruhusiwa moja kwa moja.

9. **Superadmin HAWEZI kuomba mkopo** — backend inazuia (`403`), na button
   ya "Omba Mkopo" imefichwa kwa superadmin.

10. **Superadmin anasajili superadmin mwenzake TU** (si users wa kawaida).
    Backend inalazimisha role = `superadmin` na haimuweki kwenye kikundi.
    Kuna modal mpya "Sajili Msimamizi Mwenzako" kwenye ukurasa wa Vikundi.

11. **Superadmin hana ukurasa wa "Users" wa jumla — ana "Vikundi".**
    Anaingia kikundi kimoja baada ya kingine kuona wanachama wake (ufanisi
    wa mfumo). Sidebar/Dashboard/MembersPage zimebadilishwa ipasavyo.

12. **Maintenance mode imeimarishwa.**
    - Wakati wa matengenezo, **wasio-superadmin hawawezi ku-login tena**
      (ilizibwa ndani ya login). Superadmin pekee ndiye anaweza kuingia
      ku-zima hali hiyo.
    - Toggle sasa ina uthibitisho (confirm) + hali ya kuload, na inapatikana
      kwa superadmin pekee (ndiyo iliyokuwa inasababisha "huna ruhusa" kwa
      admin wa kawaida).

---

## C. UI / UX

13. **Labels** zimeongezwa kwenye sehemu zote za kujaza — ikiwemo **Hisa** na
    **Mfuko wa Jamii** (zilizokuwa input box tupu).

14. **Loading + Success + Error states** kila mahali: button zina `Spinner` na
    zina-disable wakati wa kutuma; toast za mafanikio/kosa zipo.

15. **Form data haibaki tena.** `MembersPage` ilikuwa inatumia `useForm` MOJA
    kwa modal mbili. Sasa kila modal ina form yake, na inafutwa (`reset`)
    inapofunguliwa/funga — hivyo data ya mwanachama wa awali haionekani tena.

16. **Toggle ya show/hide password** kwenye password zote: Login, Register
    (password + confirm), Profile (badilisha nywila), na usajili wa
    co-superadmin. (Component `PasswordInput` imeboreshwa kupokea sheria za
    custom.)

17. **Branding "Methynix Software"** imewekwa: Sidebar, Login, Register,
    na ukurasa wa Matengenezo.

---

## Jinsi ya kuendesha

> `node_modules` na `dist` zimeondolewa kwenye zip ili iwe ndogo.

**Server**
```bash
cd server
npm install
# hakikisha .env ina MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, CLIENT_URL, PORT, NODE_ENV
node adminseed.js   # kutengeneza superadmin (phone 0000000000)
npm run dev         # au: node server.js
```

**Client**
```bash
cd client
npm install
npm run dev         # development
# npm run build     # production (imejaribiwa, inafanikiwa)
```

Imejaribiwa: `vite build` inafanikiwa (modules 215), na files zote za server
zinapita `node --check`.

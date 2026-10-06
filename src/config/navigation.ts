export interface NavItem {
  key: string;
  labelEn: string;
  labelHi: string;
  href: string;
  children?: NavItem[];
  external?: boolean;
}

export const PRIMARY_NAV: NavItem[] = [
  { key: 'home', labelEn: 'Home', labelHi: 'होम', href: '/' },
  {
    key: 'about',
    labelEn: 'About Us',
    labelHi: 'हमारे बारे में',
    href: '/about',
  },
  {
    key: 'activities',
    labelEn: 'Activities',
    labelHi: 'गतिविधियाँ',
    href: '/activities',
  },
  {
    key: 'membership',
    labelEn: 'Membership',
    labelHi: 'सदस्यता',
    href: '/membership',
  },
  {
    key: 'notifications',
    labelEn: 'Notices',
    labelHi: 'सूचनाएँ',
    href: '/notifications',
  },
  {
    key: 'procurement',
    labelEn: 'Procurement',
    labelHi: 'खरीद',
    href: '/procurement',
  },
  {
    key: 'impact',
    labelEn: 'Dashboard',
    labelHi: 'डैशबोर्ड',
    href: '/impact/dashboard',
  },
  {
    key: 'publications',
    labelEn: 'Publications',
    labelHi: 'प्रकाशन',
    href: '/publications',
  },
];

export const FOOTER_NAV = {
  about: [
    { key: 'f-about', labelEn: 'About SIDHKOFED', labelHi: 'SIDHKOFED के बारे में', href: '/about' },
    { key: 'f-membership', labelEn: 'Membership', labelHi: 'सदस्यता', href: '/membership' },
  ],
  resources: [
    { key: 'f-faqs', labelEn: 'FAQs', labelHi: 'अक्सर पूछे जाने वाले प्रश्न', href: '/faqs' },
    { key: 'f-publications', labelEn: 'Publications', labelHi: 'प्रकाशन', href: '/publications' },
    {
      key: 'f-procurement',
      labelEn: 'Procurement Announcements',
      labelHi: 'खरीद घोषणाएं',
      href: '/procurement?procurement_update_category=announcements-schedules#listing',
    },
    { key: 'f-tenders', labelEn: 'Tenders', labelHi: 'निविदाएं', href: '/notifications/tenders' },
    { key: 'f-dashboard', labelEn: 'Impact Dashboard', labelHi: 'प्रभाव डैशबोर्ड', href: '/impact/dashboard' },
  ],
  important: [
    { key: 'f-digital', labelEn: 'Digital Services', labelHi: 'डिजिटल सेवाएं', href: '/digital-services' },
    { key: 'f-privacy', labelEn: 'Privacy Policy', labelHi: 'गोपनीयता नीति', href: '/privacy-policy' },
    { key: 'f-disclaimer', labelEn: 'Disclaimer', labelHi: 'अस्वीकरण', href: '/disclaimer' },
  ],
  // GIGW-mandated policy links - a fifth footer column so the existing three stay uncluttered.
  policies: [
    { key: 'f-accessibility', labelEn: 'Accessibility Statement', labelHi: 'सुगम्यता वक्तव्य', href: '/accessibility-statement' },
    { key: 'f-sitemap', labelEn: 'Sitemap', labelHi: 'साइटमैप', href: '/sitemap' },
    { key: 'f-terms', labelEn: 'Terms of Use', labelHi: 'उपयोग की शर्तें', href: '/terms-of-use' },
    { key: 'f-copyright', labelEn: 'Copyright Policy', labelHi: 'कॉपीराइट नीति', href: '/copyright-policy' },
    { key: 'f-hyperlinking', labelEn: 'Hyperlinking Policy', labelHi: 'हाइपरलिंकिंग नीति', href: '/hyperlinking-policy' },
    { key: 'f-help', labelEn: 'Help and Feedback', labelHi: 'सहायता और प्रतिक्रिया', href: '/help-feedback' },
  ],
};

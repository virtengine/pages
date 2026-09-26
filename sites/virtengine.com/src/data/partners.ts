export interface SupportOrg {
  id: string;
  name: string;
  logo: string;
  logoAlt: string;
  href: string;
  role: string;
  body: string;
  facts: string[];
  ctaLabel: string;
}

/** Organisations that have supported the project. Not a claim the network is live. */
export const SUPPORT: SupportOrg[] = [
  {
    id: "microsoft",
    name: "Microsoft",
    logo: "/brand/support/microsoft.svg",
    logoAlt: "Microsoft",
    href: "https://www.microsoft.com/startups",
    role: "Microsoft for Startups, Microsoft for Nonprofits, Azure",
    body: "The project is in Microsoft for Startups and Microsoft for Nonprofits. Startup-program benefits so far are more than US$150,000. The nonprofit program adds about US$5,000 a year in Microsoft 365 and cloud services. Azure is the cloud platform we use alongside those programs.",
    facts: [
      "Microsoft for Startups — more than US$150,000 in benefits to date",
      "Microsoft for Nonprofits — about US$5,000 a year in Microsoft 365 and cloud services",
      "Microsoft Azure partner programs",
    ],
    ctaLabel: "Microsoft for Startups",
  },
  {
    id: "google",
    name: "Google",
    logo: "/brand/support/google.svg",
    logoAlt: "Google",
    href: "https://www.google.com/nonprofits/",
    role: "Google for Nonprofits",
    body: "Through Google for Nonprofits we use Google Workspace and a Google Ads Grant to run communications and operations for the project.",
    facts: ["Google Workspace for Nonprofits", "Google Ads Grant"],
    ctaLabel: "Google for Nonprofits",
  },
  {
    id: "waldur",
    name: "Waldur",
    logo: "/brand/support/waldur.svg",
    logoAlt: "Waldur",
    href: "/waldur",
    role: "Technology partner — developed by OpenNode OÜ",
    body: "Waldur is the open-source cloud and HPC platform that sits beside VirtEngine. The provider daemon maps marketplace agreements into Waldur so operators can fulfil work on real infrastructure.",
    facts: ["Developed by OpenNode OÜ", "Catalogue, orders, and operations stay in Waldur"],
    ctaLabel: "How Waldur connects",
  },
  {
    id: "opennebula",
    name: "OpenNebula",
    logo: "/brand/support/opennebula.svg",
    logoAlt: "OpenNebula",
    href: "https://opennebula.io/",
    role: "Technology partner",
    body: "OpenNebula is a technology partner for cloud management. Waldur already documents an OpenNebula site agent. A first-class VirtEngine mapping is planned; it is not presented here as a shipped production integration.",
    facts: ["Cloud management partner", "First-class chain mapping is still planned"],
    ctaLabel: "OpenNebula",
  },
  {
    id: "rmit",
    name: "RMIT University",
    logo: "/brand/support/rmit.svg",
    logoAlt: "RMIT University",
    href: "https://www.rmit.edu.au/",
    role: "Industry partner",
    body: "RMIT University is an industry partner. The relationship is organisational: research, talent, and industry collaboration around open infrastructure — not a claim that RMIT operates the network.",
    facts: ["Industry partner"],
    ctaLabel: "RMIT University",
  },
  {
    id: "mqu",
    name: "Macquarie University",
    logo: "/brand/support/mq.png",
    logoAlt: "Macquarie University",
    href: "https://www.mq.edu.au/partner/access-business-opportunities/innovation-entrepreneurship-and-it/incubator/news/news-items/meet-our-newest-startup-companies-joining-the-mqu-incubator-community",
    role: "MQU Incubator community",
    body: "DET.IO joined the Macquarie University Incubator as one of its resident startups. That early incubator place is part of the project’s history, before the work was re-founded as VirtEngine under DETIO FOUNDATION LTD.",
    facts: ["Incubator resident (as DET.IO)"],
    ctaLabel: "MQU Incubator announcement",
  },
  {
    id: "nsw",
    name: "NSW Government",
    logo: "/brand/support/nsw.png",
    logoAlt: "NSW Government",
    href: "https://www.nsw.gov.au/",
    role: "Minimum Viable Product grant, 2019–20",
    body: "DET-IO Pty Limited received a New South Wales Government Minimum Viable Product grant of up to $27,000. The award is recorded in the NSW Parliament annual report for 2019–20. Parliament published the record; the support came from the NSW Government program.",
    facts: ["MVP grant 2767 — up to $27,000", "Listed in NSW Annual Report 2019–20"],
    ctaLabel: "NSW Government",
  },
  {
    id: "connectingup",
    name: "Connecting Up",
    logo: "/brand/support/connectingup.png",
    logoAlt: "Connecting Up, powered by Infoxchange",
    href: "https://www.connectingup.org/",
    role: "Member",
    body: "The foundation is a Connecting Up member. Connecting Up, powered by Infoxchange, helps Australian not-for-profits get affordable technology, software, and IT support.",
    facts: ["Member organisation"],
    ctaLabel: "Connecting Up",
  },
  {
    id: "goodstack",
    name: "Goodstack",
    logo: "/brand/support/goodstack.svg",
    logoAlt: "Goodstack",
    href: "https://goodstack.org/",
    role: "Member",
    body: "The Foundation is a Goodstack member. Goodstack is how many vendors check nonprofit status for discounted software and cloud programs.",
    facts: ["Member organisation"],
    ctaLabel: "Goodstack",
  },
];

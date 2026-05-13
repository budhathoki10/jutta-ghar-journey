import { faqItems } from "@/content/faq";
import {
  addressLine,
  businessName,
  country,
  fullAddress,
  hours,
  instagramLink,
  locality,
  phoneNumber,
  websiteUrl,
  whatsappLink,
} from "@/content/site";

const faqStructured = faqItems.map((item) => ({
  "@type": "Question",
  name: item.question,
  acceptedAnswer: {
    "@type": "Answer",
    text: item.answer,
  },
}));

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: businessName,
      url: websiteUrl,
      telephone: phoneNumber,
      address: {
        "@type": "PostalAddress",
        streetAddress: addressLine,
        addressLocality: locality,
        addressCountry: country,
      },
      sameAs: [instagramLink, whatsappLink],
    },
    {
      "@type": "LocalBusiness",
      name: businessName,
      image: `${websiteUrl}/og-image.svg`,
      telephone: phoneNumber,
      address: {
        "@type": "PostalAddress",
        streetAddress: addressLine,
        addressLocality: locality,
        addressCountry: country,
      },
      openingHoursSpecification: hours.map((item) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: item.label.includes("Sunday") ? "Sunday" : [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: item.label.includes("Closed") ? undefined : "09:00",
        closes: item.label.includes("Closed") ? undefined : "20:00",
      })).filter((entry) => entry.opens),
      priceRange: "on request",
      url: websiteUrl,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: websiteUrl },
        { "@type": "ListItem", position: 2, name: "Contact", item: `${websiteUrl}/contact` },
        { "@type": "ListItem", position: 3, name: "Privacy", item: `${websiteUrl}/privacy` },
        { "@type": "ListItem", position: 4, name: "Terms", item: `${websiteUrl}/terms` },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqStructured,
    },
  ],
};

export default function StructuredData() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }} />;
}

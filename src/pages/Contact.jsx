import ContactHero from "../components/contact/ContactHero";
import ContactInfo from "../components/contact/ContactInfo";
import GoogleMap from "../components/contact/GoogleMap";
import SEO from "../components/common/SEO";

const Contact = () => {
  return (
    <>
      <SEO
        title="Contact Heal Stride Physiotherapy | Location & Clinic Timings Bhopal"
        description="Visit Heal Stride Physiotherapy & Wellness Centre at LIG 85, Raisen Rd, New Subhash Nagar, Bhopal. Call +91 88094 91380 or WhatsApp for immediate consultation."
        keywords="Contact Heal Stride Bhopal, Physiotherapy Clinic Raisen Road Bhopal, Physiotherapy Subhash Nagar, Physiotherapist Phone Number Bhopal"
      />
      <ContactHero />
      <ContactInfo />
      <GoogleMap />
    </>
  );
};

export default Contact;

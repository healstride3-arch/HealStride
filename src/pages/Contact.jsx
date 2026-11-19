import ContactHero from "../components/contact/ContactHero";
import ContactInfo from "../components/contact/ContactInfo";
import GoogleMap from "../components/contact/GoogleMap";
import SEO from "../components/common/SEO";

const Contact = () => {
  return (
    <>
      <SEO
        title="Contact Heal Stride Physiotherapy | Locations & Clinic Timings Bhopal"
        description="Visit Heal Stride Physiotherapy & Wellness Centre at Clinic 1 (LIG 85 New Subhash Nagar Near Gurudwara-Raisen Road Bhopal 462023) or Clinic 2 (Charbatti Chouraha, Chataipura Bhopal 462001). Call +91 88094 91380."
        keywords="Contact Heal Stride Bhopal, Physiotherapy Clinic Raisen Road Bhopal, Physiotherapy Subhash Nagar, Physiotherapy Charbatti Chouraha Bhopal, Physiotherapist Phone Number Bhopal"
      />
      <ContactHero />
      <ContactInfo />
      <GoogleMap />
    </>
  );
};

export default Contact;

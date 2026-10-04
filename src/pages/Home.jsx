import Footer from "../components/common/Navbar/Footer/Footer";
import GalleryPreview from "../components/home/GalleryPreview";
import GoogleRating from "../components/home/GoogleRating";
import ClinicIntro from "../components/about/ClinicIntro";
import Hero from "../components/home/Hero";
import OurServices from "../components/home/OurServices";
import HomePhysiotherapySection from "../components/home/HomePhysiotherapySection";
import Specialists from "../components/home/Specialists";
import Testimonials from "../components/home/Testimonials";
import WhyChooseUs from "../components/home/WhyChooseUs";
import BlogSection from "../components/home/BlogSection";
import TreatmentSlider from "../components/home/TreatmentSlider";
import WhatsAppFloat from "../components/common/WhatsAppFloat";
import FloatingIcons from "../components/FloatingIcons";
import SEO from "../components/common/SEO";

const Home = () => {
  return (
    <>
      <SEO
        title="Best Physiotherapist in Bhopal | Sports Injury & Pain Relief Clinic"
        description="Heal Stride Physiotherapy & Wellness Centre in Bhopal, led by Dr. MD Rashid (MPT Sports). Expert sports injury rehab, cupping therapy, dry needling, chiropractic care & chronic pain relief."
        keywords="Heal Stride Physiotherapy, Best Physiotherapist in Bhopal, Dr MD Rashid, Cupping Therapy Bhopal, Dry Needling Bhopal, Sports Injury Rehabilitation Bhopal, Raisen Road Physiotherapy, Physiotherapist near me"
      />
      <FloatingIcons />
      <Hero />
      <GoogleRating />
      <TreatmentSlider />
      <WhyChooseUs />
      <OurServices />
      <ClinicIntro isHome={true} />
      <HomePhysiotherapySection />
      <GalleryPreview />
      <Specialists showViewAllButton={true} />
      <BlogSection />
      <Testimonials />
      <WhatsAppFloat />
    </>
  );
};

export default Home;

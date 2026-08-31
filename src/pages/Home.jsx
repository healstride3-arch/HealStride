import Footer from "../components/common/Navbar/Footer/Footer";
import Conditions from "../components/home/Conditions";
import GalleryPreview from "../components/home/GalleryPreview";
import GoogleRating from "../components/home/GoogleRating";
import Hero from "../components/home/Hero";
import OurServices from "../components/home/OurServices";
import Specialists from "../components/home/Specialists";
import Testimonials from "../components/home/Testimonials";
import WhyChooseUs from "../components/home/WhyChooseUs";
import BlogSection from "../components/home/BlogSection";
import { blogs } from "../data/blogs";
import TreatmentSlider from "../components/home/TreatmentSlider";
import WhatsAppFloat from "../components/common/WhatsAppFloat";
import ReviewCTA from "./ReviewCTA";
import FloatingIcons from "../components/FloatingIcons";

const Home = () => {
  return (
    <>
      <FloatingIcons />
      <Hero />
      <GoogleRating />
      <TreatmentSlider />
      <WhyChooseUs />
      <OurServices />
      <Conditions />
      <GalleryPreview />
      <Specialists showViewAllButton={true} />
      <BlogSection blogsToShow={blogs} />
      <Testimonials />
      <WhatsAppFloat />
      <ReviewCTA />
    </>
  );
};

export default Home;
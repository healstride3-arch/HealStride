import AboutHero from "../components/about/AboutHero";
import ClinicIntro from "../components/about/ClinicIntro";
import MissionVision from "../components/about/MissionVision";
import OurSpecialities from "../components/about/OurSpecialities";
import WhyPatientsTrustUs from "../components/about/WhyPatientsTrustUs";
import CoreValues from "../components/about/CoreValues";
import TreatmentProcess from "../components/about/TreatmentProcess";
import FAQSection from "../components/about/FAQSection";
import Specialists from "../components/home/Specialists";

const About = () => {
    return (
        <>
            <AboutHero />
            <ClinicIntro />
            <MissionVision />
            <CoreValues />
            <OurSpecialities />
            <Specialists />
            <TreatmentProcess />
            <WhyPatientsTrustUs />
            <FAQSection />
        </>
    );
};

export default About;

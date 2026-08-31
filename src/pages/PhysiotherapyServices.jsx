import ServiceHero from "../components/service/ServiceHero";
import ServicesGrid from "../components/service/ServicesGrid";
import ServicesCTA from "../components/service/ServicesCTA";

const PhysiotherapyServices = () => {
  return (
    <div className="bg-slate-50">
      <ServiceHero />
      <ServicesGrid />
      <ServicesCTA />
    </div>
  );
};

export default PhysiotherapyServices;
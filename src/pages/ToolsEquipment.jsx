import ServiceHero from "../components/service/ServiceHero";
import ToolsGrid from "../components/service/ToolsGrid";
import ServicesCTA from "../components/service/ServicesCTA";

const ToolsEquipment = () => {
  return (
    <div className="bg-slate-50">
      <ServiceHero />
      <ToolsGrid />
      <ServicesCTA />
    </div>
  );
};

export default ToolsEquipment;
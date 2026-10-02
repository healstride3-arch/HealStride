import AppointmentForm from "../components/contact/AppointmentForm";
import SEO from "../components/common/SEO";

const Booking = () => {
  return (
    <div className="pt-0">
      <SEO
        title="Book Physiotherapy Appointment Online | Bhopal Clinic"
        description="Book direct consultation with Dr. MD Rashid (MPT Sports) at Heal Stride Physiotherapy Bhopal. Confirm appointment slot online with zero wait priority."
        keywords="Book Physiotherapy Bhopal, Appointment Dr MD Rashid, Physiotherapy Online Booking, Heal Stride Consultation"
      />
      <AppointmentForm />
    </div>
  );
};

export default Booking;
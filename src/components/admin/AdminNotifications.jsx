import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  Bell,
  MessageCircleQuestion,
  Star,
  Calendar,
  ArrowLeft,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";


const AdminNotifications = () => {

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [faqSubmissions, setFaqSubmissions] = useState([]);
  const [testimonials, setTestimonials] = useState([]);



  // ---------------- Time Format ----------------

  const formatTime = (timestamp) => {

    if (!timestamp) {
      return "Just now";
    }

    const date = timestamp.toDate();

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  };



  // ---------------- Appointments ----------------

  useEffect(() => {

    const q = query(
      collection(db, "appointments"),
      where("notificationRead", "==", false)
    );


    const unsubscribe = onSnapshot(q, (snapshot) => {

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAppointments(data);

    });


    return () => unsubscribe();

  }, []);




  // ---------------- FAQs ----------------

  useEffect(() => {


    const q = query(
      collection(db, "faqSubmissions"),
      where("notificationRead", "==", false)
    );


    const unsubscribe = onSnapshot(q, (snapshot) => {


      const data = snapshot.docs.map((doc)=>({
        id: doc.id,
        ...doc.data(),
      }));


      setFaqSubmissions(data);


    });


    return () => unsubscribe();


  }, []);





  // ---------------- Testimonials ----------------


  useEffect(() => {


    const q = query(
      collection(db,"testimonials"),
      where("notificationRead","==",false)
    );



    const unsubscribe = onSnapshot(q,(snapshot)=>{


      const data = snapshot.docs.map((doc)=>({
        id:doc.id,
        ...doc.data(),
      }));


      setTestimonials(data);


    });



    return ()=>unsubscribe();


  }, []);





  // ---------------- Notification Data ----------------



  const appointmentNotifications = appointments.map((item)=>({

    id:item.id,

    type:"appointment",

    title:"New Appointment",

    message:`${item.name} booked an appointment.`,

    time:formatTime(item.createdAt),

    redirect:"/admin/appointments",

  }));





  const faqNotifications = faqSubmissions.map((item)=>({

    id:item.id,

    type:"faq",

    title:"New FAQ Submitted",

    message:`${item.name} asked: ${item.question}`,

    time:formatTime(item.createdAt),

    redirect:"/admin/faq",

  }));





  const testimonialNotifications = testimonials.map((item)=>({

    id:item.id,

    type:"testimonial",

    title:"New Testimonial",

    message:`${item.name} submitted a review.`,

    time:formatTime(item.createdAt),

    redirect:"/admin/testimonials",

  }));





  const notifications = [

    ...appointmentNotifications,

    ...faqNotifications,

    ...testimonialNotifications,

  ];


  // ---------------- Icons ----------------

  const getIcon = (type) => {

    switch(type){

      case "appointment":
        return (
          <Calendar 
            size={18}
            className="text-teal-600"
          />
        );


      case "faq":
        return (
          <MessageCircleQuestion
            size={18}
            className="text-orange-500"
          />
        );


      case "testimonial":
        return (
          <Star
            size={18}
            className="text-purple-600"
          />
        );


      default:
        return <Bell size={18}/>;

    }

  };





  // ---------------- View Notification ----------------


  const handleView = async(item)=>{

    try{


      await updateDoc(
        doc(
          db,
          item.type === "appointment"
            ? "appointments"
            : item.type === "faq"
            ? "faqSubmissions"
            : "testimonials",
          item.id
        ),
        {
          notificationRead:true,
        }
      );



      setOpen(false);


      navigate(item.redirect);



    }catch(error){

      console.error(
        "Notification Error:",
        error
      );

    }

  };






  return (

    <div className="relative">


      {/* Bell Button */}

      <button

        onClick={()=>setOpen(!open)}

        className="
        relative
        p-2
        rounded-full
        hover:bg-slate-100
        transition
        "

      >

        <Bell size={24}/>



        {
          notifications.length > 0 && (

            <span

              className="
              absolute
              -top-1
              -right-1
              bg-red-500
              text-white
              text-[10px]
              font-bold
              w-5
              h-5
              rounded-full
              flex
              items-center
              justify-center
              "

            >

              {notifications.length}

            </span>

          )
        }


      </button>






      {/* Notification Popup */}


      {
        open && (

          <div

          className="
          absolute
          right-0
          mt-3
          w-[370px]
          bg-white
          rounded-2xl
          shadow-2xl
          border
          z-50
          overflow-hidden
          "

          >



            {/* Header */}


            <div

            className="
            flex
            items-center
            gap-3
            p-5
            border-b
            "

            >


              <button

              onClick={()=>setOpen(false)}

              className="
              p-2
              rounded-full
              hover:bg-slate-100
              "

              >

                <ArrowLeft size={20}/>

              </button>



              <h2 className="font-semibold text-lg">

                Notifications

              </h2>


            </div>







            <div

            className="
            max-h-[420px]
            overflow-y-auto
            "

            >



              {
                notifications.length === 0 ? (

                  <div

                  className="
                  p-8
                  text-center
                  text-gray-500
                  "

                  >

                    No new notifications

                  </div>


                ) : (


                  notifications.map((item)=>(


                    <div

                    key={item.id}

                    className="
                    p-4
                    border-b
                    hover:bg-slate-50
                    transition
                    "

                    >



                      <div className="flex gap-3">


                        {getIcon(item.type)}



                        <div className="flex-1">



                          <h3 className="font-semibold">

                            {item.title}

                          </h3>




                          <p

                          className="
                          text-sm
                          text-slate-600
                          mt-1
                          "

                          >

                            {item.message}

                          </p>




                          <p

                          className="
                          text-xs
                          text-slate-400
                          mt-2
                          "

                          >

                            {item.time}

                          </p>




                          <button

                          onClick={()=>handleView(item)}

                          className="
                          mt-3
                          bg-teal-600
                          hover:bg-teal-700
                          text-white
                          text-sm
                          px-4
                          py-2
                          rounded-lg
                          "

                          >

                            View

                          </button>



                        </div>


                      </div>


                    </div>


                  ))

                )
              }



            </div>




          </div>

        )

      }

    </div>

  );

};


export default AdminNotifications;
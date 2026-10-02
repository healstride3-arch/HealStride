import { useEffect, useMemo, useState } from "react";
import AdminNotifications from "./AdminNotifications";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import {
  CalendarDays,
  Users,
  Clock,
  Activity,
  Loader2,
  AlertCircle,
  TrendingUp,
  Image,
  MessageSquare,
  CheckCircle,
  XCircle,
  Star,
  Database,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { db } from "../../firebase/firebase";
import { importWebsiteData } from "../../utils/importWebsiteData";


/* ---------- helpers ---------- */

const toDateSafe = (v) => {
  if (!v) return null;

  if (v instanceof Date) return v;

  if (typeof v?.toDate === "function") {
    return v.toDate();
  }

  const d = new Date(v);

  return isNaN(d.getTime()) ? null : d;
};


const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};


const endOfDay = (d) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};


const toInputValue = (d) => (
  d.toISOString().slice(0, 10)
);



const STAT_STYLES = {
  blue: "bg-blue-50 text-blue-600",
  teal: "bg-teal-50 text-teal-600",
  amber: "bg-amber-50 text-amber-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
};



/* ---------- Components ---------- */


const StatCard = ({
  icon: Icon,
  label,
  value,
  tone = "blue",
}) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-100 hover:shadow-md transition">
    <div className="flex items-center gap-4">

      <div
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${STAT_STYLES[tone]}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs sm:text-sm text-slate-500">
          {label}
        </p>

        <p className="text-xl sm:text-2xl font-bold text-slate-900">
          {value}
        </p>
      </div>

    </div>
  </div>
);



/* ---------- Main ---------- */


const RANGE_PRESETS = [
  {
    key: "7",
    label: "Last 7 days",
    days: 7
  },
  {
    key: "30",
    label: "Last 30 days",
    days: 30
  },
  {
    key: "90",
    label: "Last 90 days",
    days: 90
  },
  {
    key: "custom",
    label: "Custom"
  }
];



const AdminDashboard = () => {


  const [appointments, setAppointments] = useState([]);

  const [enquiries, setEnquiries] = useState([]);

  const [reviews, setReviews] = useState([]);

  const [gallery, setGallery] = useState([]);


  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);
  const [importing, setImporting] = useState(false);



  const [preset, setPreset] = useState("30");


  const today = useMemo(
    () => startOfDay(new Date()),
    []
  );



  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    return toInputValue(d);
  });


  const [to, setTo] = useState(
    () => toInputValue(new Date())
  );



  /* ---------- Firebase Data ---------- */


  useEffect(() => {


    setLoading(true);


    const appointmentQuery = query(
      collection(db, "appointments"),
      orderBy("createdAt", "desc")
    );



    const unsubscribeAppointments =
      onSnapshot(
        appointmentQuery,
        (snapshot) => {

          setAppointments(
            snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
          );

          setLoading(false);

        },

        (error) => {

          setError(error.message);

          setLoading(false);

        }

      );



    const unsubscribeEnquiries =
      onSnapshot(
        collection(db, "enquiries"),
        (snapshot) => {

          setEnquiries(
            snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
          );

        }

      );


    const unsubscribeReviews =
      onSnapshot(
        collection(db, "testimonials"),
        (snapshot) => {

          const data = snapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
            .filter(item => item.status === "approved");


          setReviews(data);

        }
      );



    const unsubscribeGallery =
      onSnapshot(
        collection(db, "gallery"),
        (snapshot) => {

          setGallery(
            snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
          );

        }

      );



    return () => {

      unsubscribeAppointments();

      unsubscribeEnquiries();

      unsubscribeReviews();

      unsubscribeGallery();

    };


  }, []);





  /* ---------- Date Range ---------- */

  const handleImportWebsiteData = async () => {
    try {
      setImporting(true);
      await importWebsiteData();
      alert("Website data imported to Firestore successfully.");
    } catch (importError) {
      console.error("Website data import failed:", importError);
      alert(importError.message || "Failed to import website data.");
    } finally {
      setImporting(false);
    }
  };


  const range = useMemo(() => {


    if (preset === "custom") {

      const f = from
        ? startOfDay(new Date(from))
        : null;


      const t = to
        ? endOfDay(new Date(to))
        : null;


      return {
        from: f,
        to: t
      };

    }



    const days =
      RANGE_PRESETS.find(
        x => x.key === preset
      )?.days || 30;



    const f = new Date(today);

    f.setDate(
      f.getDate() - (days - 1)
    );



    return {

      from: startOfDay(f),

      to: endOfDay(new Date())

    };


  }, [
    preset,
    from,
    to,
    today
  ]);





  /* ---------- Filter ---------- */


  const filteredAppointments =
    useMemo(() => {


      if (!range.from || !range.to)
        return appointments;



      return appointments.filter(item => {


        const date =
          toDateSafe(item.createdAt);



        return (
          date &&
          date >= range.from &&
          date <= range.to
        );


      });


    }, [
      appointments,
      range
    ]);





  /* ---------- Stats ---------- */


  const stats =
    useMemo(() => {


      const todayStart =
        startOfDay(new Date())
          .getTime();



      const todayEnd =
        endOfDay(new Date())
          .getTime();



      return filteredAppointments.reduce(
        (acc, item) => {


          acc.total++;



          const date =
            toDateSafe(item.date)
            ||
            toDateSafe(item.createdAt);



          if (
            date &&
            date.getTime() >= todayStart &&
            date.getTime() <= todayEnd
          ) {

            acc.today++;

          }



          const status =
            String(
              item.status || "pending"
            )
              .toLowerCase()
              .trim();



          if (status === "confirmed")
            acc.confirmed++;


          else if (status === "completed")
            acc.completed++;


          else if (status === "cancelled")
            acc.cancelled++;


          else
            acc.pending++;



          return acc;


        },
        {

          total: 0,
          today: 0,
          pending: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0

        }

      );


    }, [
      filteredAppointments
    ]);


  return (
    <div className="space-y-6">


        {/* Header */}

        <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

          <div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>

            <p className="text-slate-500 mt-1">
              Manage appointments, enquiries and clinic activities.
            </p>

          </div>



          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleImportWebsiteData}
              disabled={importing}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Database size={16} />
              {importing ? "Importing..." : "Import Website Data"}
            </button>

            {RANGE_PRESETS.map((item) => (

              <button
                key={item.key}
                onClick={() => setPreset(item.key)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition whitespace-nowrap ${preset === item.key
                  ?
                  "bg-teal-600 text-white"
                  :
                  "bg-white border text-slate-600"
                  }`}
              >

                {item.label}

              </button>

            ))}

          </div>

          {preset === "custom" && (
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  From Date
                </label>

                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="border border-slate-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  To Date
                </label>

                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="border border-slate-300 rounded-lg px-4 py-2"
                />
              </div>
            </div>
          )}


        </header>




        {/* Error */}

        {
          error &&
          <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-600">

            <AlertCircle size={18} />

            {error}

          </div>
        }





        {
          loading ?

            <div className="grid place-items-center py-20">

              <Loader2 className="animate-spin text-teal-600" />

            </div>


            :

            <>


              {/* Statistics */}


              <section
                className="
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-6
  gap-4
  "
              >

                <StatCard
                  icon={CalendarDays}
                  label="Appointments"
                  value={stats.total}
                  tone="blue"
                />

                <StatCard
                  icon={Activity}
                  label="Today"
                  value={stats.today}
                  tone="teal"
                />

                <StatCard
                  icon={Clock}
                  label="Pending"
                  value={stats.pending}
                  tone="amber"
                />

                <StatCard
                  icon={Users}
                  label="Confirmed"
                  value={stats.confirmed}
                  tone="green"
                />

                <StatCard
                  icon={MessageSquare}
                  label="Enquiries"
                  value={appointments.length}
                  tone="purple"
                />

                <StatCard
                  icon={Image}
                  label="Gallery Images"
                  value={gallery.length}
                  tone="blue"
                />

              </section>





              {/* Chart */}


              <section className="
mt-8
bg-white
rounded-3xl
shadow-sm
p-3 sm:p-5
">


                <div className="flex items-center gap-2 mb-5">

                  <TrendingUp
                    className="text-teal-600"
                  />

                  <h2 className="font-semibold text-lg">
                    Appointments Analytics
                  </h2>

                </div>




                <div className="h-[250px] sm:h-[320px] md:h-[350px]">


                  <ResponsiveContainer width="100%" height="100%">


                    <BarChart data={[
                      {
                        name: "Pending",
                        value: stats.pending
                      },
                      {
                        name: "Confirmed",
                        value: stats.confirmed
                      },
                      {
                        name: "Completed",
                        value: stats.completed
                      },
                      {
                        name: "Cancelled",
                        value: stats.cancelled
                      }
                    ]}>



                      <CartesianGrid
                        strokeDasharray="3 3"
                      />


                      <XAxis
                        dataKey="name"
                      />


                      <YAxis
                        allowDecimals={false}
                        domain={[0, "dataMax + 1"]}
                      />


                      <Tooltip />


                      <Bar

                        dataKey="value"

                        fill="#14b8a6"

                        radius={[8, 8, 0, 0]}

                      />



                    </BarChart>


                  </ResponsiveContainer>


                </div>


              </section>






              {/* Recent Appointment */}



              <section className="
mt-8
bg-white
rounded-3xl
shadow-sm
p-5
">


                <h2 className="text-xl font-bold mb-5">

                  Recent Appointments

                </h2>





                <div className="overflow-x-auto rounded-xl">


                  <table className="w-full min-w-[700px] lg:min-w-[900px]">

                    <thead className="bg-teal-600 text-white">


                      <tr>

                        <th className="p-4 text-left">
                          Patient
                        </th>


                        <th className="p-4 text-left">
                          Phone
                        </th>


                        <th className="p-4 text-left">
                          Email
                        </th>


                        <th className="p-4 text-left">
                          Condition
                        </th>


                        <th className="p-4 text-left">
                          Date
                        </th>


                        <th className="p-4 text-left">
                          Time
                        </th>


                        <th className="p-4 text-left">
                          Status
                        </th>


                      </tr>


                    </thead>




                    <tbody>


                      {

                        appointments
                          .slice(0, 5)
                          .map(item => (


                            <tr
                              key={item.id}
                              className="border-b hover:bg-slate-50"
                            >


                              <td className="p-2 sm:p-4">
                                {item.name}
                              </td>


                              <td className="p-2 sm:p-4">
                                {item.phone}
                              </td>


                              <td className="p-2 sm:p-4">
                                {item.email}
                              </td>


                              <td className="p-2 sm:p-4">
                                {item.condition}
                              </td>


                              <td className="p-2 sm:p-4">
                                {item.date}
                              </td>


                              <td className="p-2 sm:p-4">
                                {item.time}
                              </td>




                              <td className="p-2 sm:p-4">


                                <span
                                  className={`
px-3
py-1
rounded-full
text-xs
font-medium

${item.status === "confirmed"
                                      ?
                                      "bg-green-100 text-green-700"

                                      :

                                      item.status === "completed"

                                        ?

                                        "bg-blue-100 text-blue-700"


                                        :

                                        item.status === "cancelled"

                                          ?

                                          "bg-red-100 text-red-700"


                                          :

                                          "bg-yellow-100 text-yellow-700"

                                    }

`}
                                >


                                  {
                                    (item.status || "pending")
                                      .charAt(0)
                                      .toUpperCase()
                                    +
                                    (item.status || "pending")
                                      .slice(1)
                                  }


                                </span>


                              </td>



                            </tr>


                          ))


                      }




                      {
                        appointments.length === 0 &&

                        <tr>

                          <td
                            colSpan="7"
                            className="text-center p-6 text-slate-500"
                          >

                            No appointments found

                          </td>

                        </tr>

                      }


                    </tbody>


                  </table>


                </div>



              </section>





              {/* Extra Summary */}


              <section
                className="
  mt-8
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  gap-4
  "
              >
                {/* Completed */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">
                        Completed
                      </p>

                      <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                        {stats.completed}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cancelled */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center">
                      <XCircle className="h-6 w-6 text-red-600" />
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">
                        Cancelled
                      </p>

                      <p className="text-2xl sm:text-3xl font-bold text-red-600">
                        {stats.cancelled}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reviews */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-teal-50 flex items-center justify-center">
                      <Star className="h-6 w-6 text-teal-600" />
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">
                        Total Reviews
                      </p>

                      <p className="text-2xl sm:text-3xl font-bold text-teal-600">
                        {reviews.length}
                      </p>
                    </div>
                  </div>
                </div>
              </section>



            </>
        }
    </div>
  );


};


export default AdminDashboard;

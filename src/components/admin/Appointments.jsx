import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

import { db } from "../../firebase/firebase";

import {
  useEffect,
  useMemo,
  useState,
} from "react";



const Appointments = () => {


  const [appointments, setAppointments] = useState([]);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewAppointment, setViewAppointment] = useState(null);

  const [confirmEditAppointment, setConfirmEditAppointment] = useState(null);

  const [query, setQuery] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);


  const [editingAppointment, setEditingAppointment] =
    useState(null);



  /* ---------------- Firebase Real Time Fetch ---------------- */


  useEffect(() => {


    const unsubscribe = onSnapshot(

      collection(db, "appointments"),

      (snapshot) => {


        const data = snapshot.docs.map(docSnap => ({

          id: docSnap.id,

          ...docSnap.data(),

          status:
            docSnap.data().status || "pending"

        }));


        setAppointments(data);


      },


      (error) => {

        console.error(error);

      }


    );



    return () => unsubscribe();


  }, []);






  const handleView = (appointment) => {
    setViewAppointment(appointment);
    setIsViewOpen(true);
  };

  /* ---------------- Delete ---------------- */
  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this appointment?"
      );

    if (!confirmDelete)
      return;
    try {
      await deleteDoc(
        doc(db, "appointments", id)
      );
      setAppointments(prev =>

        prev.filter(
          item => item.id !== id
        )

      );
    }

    catch (error) {

      console.error(error);

    }


  };



const confirmAndEdit = () => {
  handleEdit(confirmEditAppointment);
  setConfirmEditAppointment(null);
};



  /* ---------------- Edit ---------------- */


  const handleEdit = (appointment) => {


    setEditingAppointment(
      {
        ...appointment
      }
    );


    setIsEditOpen(true);


  };






  const handleUpdateAppointment =
    async () => {


      try {


        await updateDoc(

          doc(
            db,
            "appointments",
            editingAppointment.id
          ),

          {

            name: editingAppointment.name,

            phone: editingAppointment.phone,

            doctor: editingAppointment.doctor || "Any Available Specialist",

            condition: editingAppointment.condition,

            date: editingAppointment.date,

            time: editingAppointment.time,

            message:
              editingAppointment.message || ""

          }

        );




        setAppointments(prev =>

          prev.map(item =>

            item.id === editingAppointment.id

              ?

              editingAppointment

              :

              item

          )

        );



        setIsEditOpen(false);

        setEditingAppointment(null);



      }


      catch (error) {

        console.error(error);

      }


    };








  /* ---------------- Search ---------------- */



  const filteredAppointments =
    useMemo(() => {


      const search =
        query.toLowerCase();



      return appointments.filter(item => {


        const matchesSearch =


          item.name
            ?.toLowerCase()
            .includes(search)


          ||

          item.phone
            ?.toLowerCase()
            .includes(search)
          ||

          item.doctor
            ?.toLowerCase()
            .includes(search)


          ||

          item.condition
            ?.toLowerCase()
            .includes(search);

        return (
          matchesSearch
        );



      });


    }, [
      appointments,
      query
    ]);

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="max-w-7xl mx-auto p-4 md:p-6">


        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Appointments
        </h1>

        <p className="mt-3 text-slate-600 text-base my-3">
          View, manage and track all patient appointments from one place.
        </p>



        {/* Search + Filter */}

        <div className="bg-white rounded-2xl shadow p-5 mb-6">


          <div className="grid gap-4 ">


            <input

              type="text"

              placeholder="Search patient, phone, doctor, condition..."

              value={query}

              onChange={(e) => setQuery(e.target.value)}

              className="
w-full
border
rounded-xl
px-4
py-3
outline-none
focus:ring-2
focus:ring-teal-500
"

            />

          </div>


        </div>





        {/* Mobile Cards */}

        <div className="grid gap-4 md:hidden">


          {
            filteredAppointments.map((appointment) => (


              <div

                key={appointment.id}

                className="
bg-white
rounded-2xl
shadow
p-5
"

              >


                <h2 className="font-bold text-lg">
                  {appointment.name}
                </h2>


                <p className="text-sm text-slate-600 mt-2">
                  📞 {appointment.phone}
                </p>

                <p className="text-sm text-slate-600">
                  Doctor: {appointment.doctor || "Any Available Specialist"}
                </p>


                <p className="text-sm text-slate-600">
                  🩺 {appointment.condition}
                </p>


                <p className="text-sm text-slate-600">
                  📅 {appointment.date}
                </p>


                <p className="text-sm text-slate-600">
                  ⏰ {appointment.time}
                </p>
                <div className="flex gap-5 mt-4">

                  <button
                    onClick={() => handleView(appointment)}
                    className="text-green-600"
                  >
                    <Eye size={20} />
                  </button>

                  <button
onClick={() => setConfirmEditAppointment(appointment)}
                    className="text-blue-600"
                  >
                    <Pencil size={20} />
                  </button>

                  <button
                    onClick={() => handleDelete(appointment.id)}
                    className="text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>

                </div>
              </div>
            ))

          }
        </div>
        {/* Desktop Table */}


        <div className="
hidden
md:block
bg-white
rounded-2xl
shadow
overflow-x-auto
">


          <table className="
w-full
min-w-[900px]
">


            <thead className="
bg-teal-600
text-white
">


              <tr>


                <th className="p-4 text-left">
                  Patient
                </th>


                <th className="p-4 text-left">
                  Phone
                </th>


                <th className="p-4 text-left">
                  Doctor
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
                  Action
                </th>


              </tr>


            </thead>





            <tbody>


              {

                filteredAppointments.map((appointment) => (


                  <tr

                    key={appointment.id}

                    className="
border-b
hover:bg-slate-50
"

                  >


                    <td className="p-4">
                      {appointment.name}
                    </td>


                    <td className="p-4">
                      {appointment.phone}
                    </td>


                    <td className="p-4">
                      {appointment.doctor || "Any Available Specialist"}
                    </td>


                    <td className="p-4">
                      {appointment.condition}
                    </td>


                    <td className="p-4">
                      {appointment.date}
                    </td>


                    <td className="p-4">
                      {appointment.time}
                    </td>





                    <td className="p-4">


                      <div className="flex gap-4">

                        <button
                          onClick={() => handleView(appointment)}
                          className="text-green-600"
                        >
                          <Eye size={18} />
                        </button>

                        <button
onClick={() => setConfirmEditAppointment(appointment)}
                          className="text-blue-600"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(appointment.id)}
                          className="text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>


                    </td>


                  </tr>


                ))

              }



              {
                filteredAppointments.length === 0 &&

                <tr>

                  <td
                    colSpan="7"
                    className="
text-center
p-6
text-slate-500
"
                  >

                    No appointments found

                  </td>

                </tr>

              }


            </tbody>


          </table>


        </div>







        {/* Edit Modal */}


        {
          isEditOpen &&
          editingAppointment &&

          <div className="
fixed
inset-0
bg-black/50
flex
items-center
justify-center
z-50
p-4
">


            <div className="
bg-white
rounded-2xl
p-6
w-full
max-w-lg
">


              <h2 className="
text-2xl
font-bold
mb-5
">

                Edit Appointment

              </h2>




              <div className="space-y-3">


                <input

                  className="w-full border rounded-lg p-3"

                  value={editingAppointment.name}

                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      name: e.target.value
                    })
                  }

                />



                <input

                  className="w-full border rounded-lg p-3"

                  value={editingAppointment.phone}

                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      phone: e.target.value
                    })
                  }

                />



                <input
                  className="w-full border rounded-lg p-3"
                  value={editingAppointment.doctor || ""}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      doctor: e.target.value
                    })
                  }
                  placeholder="Doctor"
                />

                <input
                  className="w-full border rounded-lg p-3"
                  value={editingAppointment.condition || ""}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      condition: e.target.value,
                    })
                  }
                  placeholder="Condition"
                />

                <input
                  type="date"
                  className="w-full border rounded-lg p-3"
                  value={editingAppointment.date || ""}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      date: e.target.value,
                    })
                  }
                />

                <input
                  className="w-full border rounded-lg p-3"
                  value={editingAppointment.time || ""}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      time: e.target.value,
                    })
                  }
                />

                <textarea
                  rows={4}
                  className="w-full border rounded-lg p-3"
                  value={editingAppointment.message || ""}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      message: e.target.value,
                    })
                  }
                  placeholder="Message"
                />




                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={handleUpdateAppointment}
                    className="bg-teal-600 text-white px-5 py-3 rounded-lg hover:bg-teal-700"
                  >
                    Save Changes
                  </button>

                  <button
                    onClick={() => {
                      setIsEditOpen(false);
                      setEditingAppointment(null);
                    }}
                    className="bg-gray-200 px-5 py-3 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>



              </div>


            </div>


          </div>

        }


        {isViewOpen && viewAppointment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg">

              <h2 className="text-2xl font-bold mb-5">
                Appointment Details
              </h2>

              <div className="space-y-3 text-slate-700">

                <p><strong>Name:</strong> {viewAppointment.name}</p>

                <p><strong>Phone:</strong> {viewAppointment.phone}</p>

                <p><strong>Doctor:</strong> {viewAppointment.doctor || "Any Available Specialist"}</p>

                <p><strong>Condition:</strong> {viewAppointment.condition}</p>

                <p><strong>Date:</strong> {viewAppointment.date}</p>

                <p><strong>Time:</strong> {viewAppointment.time}</p>

                <p><strong>Message:</strong> {viewAppointment.message}</p>

              </div>

              <button
                onClick={() => {
                  setIsViewOpen(false);
                  setViewAppointment(null);
                }}
                className="mt-5 bg-teal-600 text-white px-5 py-3 rounded-lg"
              >
                Close
              </button>

            </div>
          </div>
        )}



      </div>


{/* Edit Confirmation Modal */}
{confirmEditAppointment && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-7">
      <h2 className="text-3xl font-bold text-slate-900 mb-5">
        Edit Appointment
      </h2>

      <p className="text-gray-600 mb-8">
        Do you want to edit this appointment?
      </p>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => setConfirmEditAppointment(null)}
          className="rounded-lg border px-5 py-2 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          onClick={confirmAndEdit}
          className="rounded-lg bg-teal-600 px-5 py-2 text-white hover:bg-teal-700"
        >
          Yes, Edit
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );


};


export default Appointments;



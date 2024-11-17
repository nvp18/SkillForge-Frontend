// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// const GetConcernById = () => {
//   const { concernId } = useParams();
//   const [concern, setConcern] = useState(null);
//   const [error, setError] = useState(null);
//   const [replyText, setReplyText] = useState("");
//   const [showReplyBox, setShowReplyBox] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");

//   const navigate = useNavigate();

//   const fetchConcern = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       const response = await fetch(`http://localhost:8080/api/admin/getAllConcerns`, {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const specificConcern = data.find((c) => c.id === concernId);
//         setConcern(specificConcern);
//       } else {
//         throw new Error("Failed to fetch concern.");
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     fetchConcern();
//   }, [concernId]);

//   const handleReply = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       const response = await fetch(`http://localhost:8080/api/admin/replyToConcern/${concernId}`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ reply: replyText }),
//       });

//       if (response.ok) {
//         setModalMessage("Reply sent successfully.");
//         setShowModal(true);
//         setReplyText("");
//         setShowReplyBox(false);
//       } else {
//         throw new Error("Failed to send reply.");
//       }
//     } catch (err) {
//       setModalMessage("An error occurred while sending the reply.");
//       setShowModal(true);
//     }
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     fetchConcern(); // Refresh the concern data to include the new reply
//   };

//   if (error) return <p className="text-red-500">{error}</p>;
//   if (!concern) return <p>Loading...</p>;

//   return (
//     <div className="p-4 sm:p-8 min-h-[80vh] bg-gray-50">
//       <header className="mb-4 sm:mb-8">
//         <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">Concern Details</h1>
//       </header>

//       <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
//         <h2 className="text-xl sm:text-2xl font-bold mb-4">{concern.subject}</h2>
//         <p className="text-sm sm:text-base text-gray-700 mb-4">{concern.description}</p>
//         <p className="text-xs sm:text-sm text-gray-500">
//           <strong>Created at:</strong> {new Date(concern.createdat).toLocaleString()}
//         </p>

//         <div className="mt-6">
//           <button
//             onClick={() => setShowReplyBox(!showReplyBox)}
//             className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
//           >
//             Reply
//           </button>
//         </div>

//         {showReplyBox && (
//           <div className="mt-4">
//             <textarea
//               value={replyText}
//               onChange={(e) => setReplyText(e.target.value)}
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               rows="4"
//               placeholder="Write your reply here..."
//             />
//             <div className="flex justify-end mt-2 space-x-4">
//               <button
//                 onClick={handleReply}
//                 className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
//               >
//                 Send Reply
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="mt-8">
//           <h3 className="text-lg sm:text-xl font-bold mb-4">Replies</h3>
//           {concern.concernReplies.length > 0 ? (
//             concern.concernReplies.map((reply, index) => (
//               <div key={index} className="bg-gray-100 p-3 rounded-lg mb-3">
//                 <p className="text-sm sm:text-base">{reply.reply}</p>
//                 <p className="text-xs sm:text-sm text-gray-500">
//                   <strong>Replied at:</strong> {new Date(reply.repliedat).toLocaleString()}
//                 </p>
//               </div>
//             ))
//           ) : (
//             <p className="text-sm sm:text-base">No replies yet.</p>
//           )}
//         </div>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
//             <p className="text-gray-800 text-center">{modalMessage}</p>
//             <button
//               onClick={handleCloseModal}
//               className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4 w-full"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GetConcernById;


import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../apiClient";

const GetConcernById = () => {
  const { concernId } = useParams();
  const [concern, setConcern] = useState(null);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const fetchConcern = async () => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role"); // Assuming role is stored in localStorage
    setRole(userRole);
  
    const apiUrl =
      userRole === "ADMIN"
        ? `/api/admin/getAllConcerns`
        : `/api/employee/getConcerns`;
  
    try {
      const response = await apiClient.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Access the data directly from the response
      const specificConcern = response.data.find((c) => c.id === concernId);
      setConcern(specificConcern);
    } catch (err) {
      // Handle error, fallback to generic message if no server message is present
      setError(err.response?.data?.message || "Failed to fetch concern.");
    }
  };
  

  useEffect(() => {
    fetchConcern();
  }, [concernId]);

  const handleReply = async () => {
    const token = localStorage.getItem("token");
    const replyApiUrl =
      role === "ADMIN"
        ? `/api/admin/replyToConcern/${concernId}`
        : `/api/employee/replyToConcern/${concernId}`;
  
    try {
      // Axios handles headers and JSON automatically
      await apiClient.post(replyApiUrl, { reply: replyText }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // If the request is successful, perform the following
      setModalMessage("Reply sent successfully.");
      setShowModal(true);
      setReplyText("");
      setShowReplyBox(false);
    } catch (err) {
      // Handle error
      setModalMessage(err.response?.data?.message || "An error occurred while sending the reply.");
      setShowModal(true);
    }
  };
  

  const handleCloseModal = () => {
    setShowModal(false);
    fetchConcern(); // Refresh the concern data to include the new reply
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!concern) return <p>Loading...</p>;

  return (
    <div className="p-4 sm:p-8 min-h-[80vh] bg-gray-50">
      <header className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">Concern Details</h1>
      </header>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">{concern.subject}</h2>
        <p className="text-sm sm:text-base text-gray-700 mb-4">{concern.description}</p>
        <p className="text-xs sm:text-sm text-gray-500">
          <strong>Created at:</strong> {new Date(concern.createdat).toLocaleString()}
        </p>

        <div className="mt-6">
          <button
            onClick={() => setShowReplyBox(!showReplyBox)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
          >
            Reply
          </button>
        </div>

        {showReplyBox && (
          <div className="mt-4">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Write your reply here..."
            />
            <div className="flex justify-end mt-2 space-x-4">
              <button
                onClick={handleReply}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Send Reply
              </button>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-lg sm:text-xl font-bold mb-4">Replies</h3>
          {concern.concernReplies?.length > 0 ? (
            concern.concernReplies.map((reply, index) => (
              <div key={index} className="bg-gray-100 p-3 rounded-lg mb-3">
                <p className="text-sm sm:text-base">{reply.reply}</p>
                <p className="text-xs sm:text-sm text-gray-500">
                  <strong>Replied at:</strong> {new Date(reply.repliedat).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm sm:text-base">No replies yet.</p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <p className="text-gray-800 text-center">{modalMessage}</p>
            <button
              onClick={handleCloseModal}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4 w-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetConcernById;

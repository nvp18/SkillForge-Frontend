// ModuleContent.jsx
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ModuleContent = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndOpenPdf = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/course/getModuleContent/${moduleId}`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (response.ok) {
          const blob = await response.blob();
          const pdfUrl = URL.createObjectURL(blob);
          window.open(pdfUrl, "_blank"); // Open PDF in a new tab
        } else {
          console.error("Failed to fetch PDF content");
        }
      } catch (err) {
        console.error("Error fetching PDF:", err);
      }
      navigate(`/course/${courseId}/getModules`); // Navigate back to GetModules page
    };

    fetchAndOpenPdf();
  }, [moduleId, courseId, navigate]);

  // Immediately navigate back to GetModules page
  return navigate(`/course/${courseId}/getModules`), null;
};

export default ModuleContent;

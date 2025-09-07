import axios from "axios";

// Axios instance with base URL
const API = axios.create({
  baseURL: "https://mitoslearning.in/api",
});

// Interceptor to attach the token with every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================
// General Data Fetching APIs
// ==========================

export const fetchSubjects = async () => {
  try {
    const { data } = await API.get("/subjects");
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const fetchPortions = async () => {
  try {
    const { data } = await API.get("/portions");
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const fetchSubjectsByPortions = async (portionId) => {
  try {
    const { data } = await API.get(`/subjects/subject/${portionId}`);
    return data;
  } catch (error) {
    console.error("Error fetching subjects by portion:", error);
    throw error;
  }
};

export const fetchChaptersBySubject = async (subjectId) => {
  try {
    const { data } = await API.get(`/chapters/chapter/${subjectId}`);
    return data;
  } catch (error) {
    console.error("Error fetching chapters by subject:", error);
    throw error;
  }
};

export const fetchChapter = async (subjectId) => {
  try {
    const { data } = await API.get(`/chapters/chapter/${subjectId}`);
    return data;
  } catch (error) {
    console.error("Error fetching chapter:", error);
    throw error;
  }
};

export const fetchChapterTopics = async (chapterId) => {
  try {
    const { data } = await API.get(`/topics/chapter/${chapterId}`);
    return data;
  } catch (error) {
    console.error("Error fetching topics by chapter:", error);
    throw error;
  }
};

export const fetchTopics = (chapterId) => API.get(`/topics/topic/${chapterId}`);
export const fetchQuestionType = () => API.get("/question-types");

export const fetchQuestion = (topicId) =>
  API.get(`/questions?topicId=${topicId}`);

export const fetchQuestions = (topics) => {
  const topicIds = topics.join(",");
  return API.get(`/questions/topics?topicIds=${topicIds}`);
};

export const fetchQuestionsByTypes = (selectedQuestionTypes, chapterId) => {
  const questionTypeIds = selectedQuestionTypes.join(",");
  return API.get(`/questions/questiontype?questionTypeIds=${questionTypeIds}&chapterId=${chapterId}`);
};

export const fetchFullTestQuestion = () => API.get("/questions/fulltest");

export const fetchFullTestByPortion = (portionId) =>
  API.get(`/questions/portion/${portionId}`);

export const fetchFullTestBySubject = (portionId, subjectId) =>
  API.get(`/questions/portion/${portionId}/subject/${subjectId}`);

export const fetchFullTestByChapter = (portionId, subjectId, chapterId) =>
  API.get(`/questions/portion/${portionId}/subject/${subjectId}/chapter/${chapterId}`);

export const fetchCustomTestQuestions = async (
  portionId,
  subjectId,
  chapterId,
  topicIds,
  questionCount
) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please log in.");
  }

  const response = await fetch("https://mitoslearning.in/api/questions/custom", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      portionId,
      subjectId,
      chapterId,
      topicIds,
      questionCount,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch custom test questions");
  }

  return response.json();
};

export const fetchResultByUser = (userId) =>
  API.get(`/tests/${userId}`);

export const fetchLeaderBoard = async () => {
  try {
    const { data } = await API.get(`/tests/a`);
    return data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
};

export const updateBlockStatus = async (type, id, isPremium) => {
  try {
    const { data } = await API.post(
      "/block",
      { type, id, isPremium },
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
    return data;
  } catch (error) {
    console.error("Error updating block status:", error);
    throw error;
  }
};

// ==========================
// Wrong Question Report APIs
// ==========================

export const getAllWrongQuestionReports = async () => {
  try {
    const { data } = await API.get("/wrong-reports");
    return data;
  } catch (error) {
    console.error("Error fetching wrong question reports:", error);
    throw error;
  }
};

export const updateWrongQuestionReportStatus = async (id, status) => {
  try {
    const { data } = await API.patch(`/wrong-reports/${id}`, { status });
    return data;
  } catch (error) {
    console.error("Error updating report status:", error);
    throw error;
  }
};

// Optional: Submit new report
export const submitWrongQuestionReport = async (questionId, reason) => {
  try {
    const { data } = await API.post("/wrong-reports", {
      questionId,
      reason,
    });
    return data;
  } catch (error) {
    console.error("Error submitting wrong question report:", error);
    throw error;
  }
};


// ==========================
// User APIs
// ==========================

// ✅ Get current logged-in user profile
export const fetchCurrentUser = async () => {
  try {
    const { data } = await API.get("/users/me");
    return data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

// ✅ Update current user profile (with file upload)
export const updateUserProfile = async (id, formData) => {
  try {
    const { data } = await API.put(`/users/update-profile/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// 🔒 Admin only: Get all users
export const fetchAllUsers = async () => {
  try {
    const { data } = await API.get("/users");
    return data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

// 🔒 Admin only: Get single user by ID
export const fetchUserById = async (id) => {
  try {
    const { data } = await API.get(`/users/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

// 🔒 Admin only: Create a new user
export const createUser = async (userData) => {
  try {
    const { data } = await API.post("/users", userData);
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// 🔒 Admin only: Delete a user by ID
export const deleteUser = async (id) => {
  try {
    const { data } = await API.delete(`/users/${id}`);
    return data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// ✅ Flip a PDF's premium flag (true / false)
export const updatePdfPremium = async (pdfId, isPremium) => {
  try {
    const { data } = await API.patch(`/pdf/${pdfId}/premium`, { isPremium });
    return data; // { message, pdf }
  } catch (error) {
    console.error("Error updating PDF premium flag:", error);
    throw error;
  }
};

// ✅ Get topics that have topic-level PDFs for a chapter
// (matches GET /chapters/:chapterId/topics-with-topic-pdfs)
export const fetchTopicsWithPDF = async (chapterId) => {
  try {
    const { data } = await API.get(`/pdf/chapters/${chapterId}/topics-with-topic-pdfs`);
    return data; // { chapterId, topics: [...] }
  } catch (error) {
    console.error("Error fetching topics with PDFs:", error);
    throw error;
  }
};

export default API;

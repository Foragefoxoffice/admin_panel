import axios from "axios";

// Axios instance with base URL
const API = axios.create({
  baseURL: "http://localhost:5008/api",
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

export const updateUserSubscription = async (id, payload) => {
  try {
    const { data } = await API.put(`/users/${id}/subscription`, payload);
    return data;
  } catch (error) {
    console.error("Error updating user subscription:", error);
    throw error;
  }
};

// Admin: manually grant/revoke a user's Test Series access
export const fetchUserTSAccess = async (userId) => {
  try {
    const { data } = await API.get(`/test-series/admin/users/${userId}/access`);
    return data;
  } catch (error) {
    console.error("Error fetching user TS access:", error);
    throw error;
  }
};

export const grantUserTSPackage = async (userId, packageId) => {
  try {
    const { data } = await API.post(`/test-series/admin/users/${userId}/grant-package`, { packageId });
    return data;
  } catch (error) {
    console.error("Error granting TS package access:", error);
    throw error;
  }
};

export const revokeUserTSPackage = async (userId, packageId) => {
  try {
    const { data } = await API.delete(`/test-series/admin/users/${userId}/package/${packageId}`);
    return data;
  } catch (error) {
    console.error("Error revoking TS package access:", error);
    throw error;
  }
};

export const grantUserTSBundle = async (userId) => {
  try {
    const { data } = await API.post(`/test-series/admin/users/${userId}/grant-bundle`);
    return data;
  } catch (error) {
    console.error("Error granting TS bundle access:", error);
    throw error;
  }
};

export const revokeUserTSBundle = async (userId) => {
  try {
    const { data } = await API.delete(`/test-series/admin/users/${userId}/bundle`);
    return data;
  } catch (error) {
    console.error("Error revoking TS bundle access:", error);
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

// ==========================
// Free Materials APIs
// ==========================

// Upload Free Material (Admin Only)
export const uploadFreeMaterial = async (formData) => {
  try {
    const { data } = await API.post("/freematerials", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    console.error("Error uploading free material:", error);
    throw error;
  }
};

// Get all free materials by subject
export const fetchFreeMaterialsBySubject = async (subjectId) => {
  try {
    const { data } = await API.get(`/freematerials/subject/${subjectId}`);
    return data;
  } catch (error) {
    console.error("Error fetching free materials by subject:", error);
    throw error;
  }
};

// Get all free materials by chapter
export const fetchFreeMaterialsByChapter = async (chapterId) => {
  try {
    const { data } = await API.get(`/freematerials/chapter/${chapterId}`);
    return data;
  } catch (error) {
    console.error("Error fetching free materials by chapter:", error);
    throw error;
  }
};

// Delete free material (Admin)
export const deleteFreeMaterial = async (id) => {
  try {
    const { data } = await API.delete(`/freematerials/${id}`);
    return data;
  } catch (error) {
    console.error("Error deleting free material:", error);
    throw error;
  }
};

// ==========================
// Notification APIs
// ==========================

// Save FCM token from app (mobile)
export const saveFcmToken = async (fcmToken) => {
  try {
    const { data } = await API.post("/users/save-fcm-token", { fcmToken });
    return data;
  } catch (error) {
    console.error("Error saving FCM token:", error.response?.data || error.message);
    throw error;
  }
};

// Get logged-in user's notifications (for mobile notification page)
export const fetchMyNotifications = async () => {
  try {
    const { data } = await API.get("/notifications/my");
    return data;
  } catch (error) {
    console.error("Error fetching my notifications:", error.response?.data || error.message);
    throw error;
  }
};


// Admin: Send notification (supports templates and multiple users)
// Payload format:
// - Send to all: { title, message, sendToAll: true }
// - Send to specific users: { title, message, userIds: [1, 2, 3] }
// Always upload images to production so mobile can reach them
const PROD_API = axios.create({ baseURL: "https://mitoslearning.in/api" });
PROD_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const sendAdminNotification = async (payload, imageFile) => {
  try {
    let finalPayload = { ...payload };

    // Upload image to production first so the URL is publicly accessible
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      const { data: uploadData } = await PROD_API.post("/notifications/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      finalPayload.imageUrl = uploadData.imageUrl;
    }

    const { data } = await API.post("/notifications/send", finalPayload);
    return data;
  } catch (error) {
    console.error("Error sending notification:", error.response?.data || error.message);
    throw error;
  }
};

/* ======================================================
   COUPON APIs (ADMIN)
====================================================== */

// Create coupon
export const createCoupon = async (payload) => {
  try {
    const { data } = await API.post("/coupons/create", payload);
    return data;
  } catch (error) {
    console.error("Create Coupon Error:", error);
    throw error;
  }
};

// Validate coupon (used before checkout / testing)
export const validateCoupon = async (payload) => {
  try {
    const { data } = await API.post("/coupons/validate", payload);
    return data;
  } catch (error) {
    console.error("Validate Coupon Error:", error);
    throw error;
  }
};


// Get all coupons (admin list)
export const fetchCoupons = async () => {
  try {
    const { data } = await API.get("/coupons/list");
    return data;
  } catch (error) {
    console.error("Fetch Coupons Error:", error);
    throw error;
  }
};

// Update coupon
export const updateCoupon = (id, payload) =>
  API.put(`/coupons/${id}`, payload);

// Toggle coupon status
export const toggleCoupon = (id) =>
  API.patch(`/coupons/${id}/toggle`);

// Delete coupon
export const deleteCoupon = (id) =>
  API.delete(`/coupons/${id}`);

/* ======================================================
   PAYMENT APIs (ADMIN)
====================================================== */

// Logged-in admin – all payments
export const fetchAllPayments = async () => {
  try {
    const { data } = await API.get("/payments/all");
    return data;
  } catch (error) {
    console.error("Fetch Payments Error:", error);
    throw error;
  }
};

// Logged-in user – own payment history
export const fetchMyPayments = async () => {
  try {
    const { data } = await API.get("/payments/my");
    return data;
  } catch (error) {
    console.error("Fetch My Payments Error:", error);
    throw error;
  }
};

// Payment statistics (admin dashboard)
export const fetchPaymentStats = async () => {
  try {
    const { data } = await API.get("/payments/stats");
    return data;
  } catch (error) {
    console.error("Payment Stats Error:", error);
    throw error;
  }
};


/* ======================================================
   NEET PLAN APIs (ADMIN)
====================================================== */

// Get all active NEET plans (with optional platform filter)
export const getNeetPlans = async (platform) => {
  try {
    const params = platform ? `?platform=${platform}` : '';
    const { data } = await API.get(`/neet-plans${params}`);
    return data;
  } catch (error) {
    console.error("Get NEET Plans Error:", error);
    throw error;
  }
};

// Get single NEET plan by ID
export const getNeetPlanById = async (id) => {
  try {
    const { data } = await API.get(`/neet-plans/${id}`);
    return data;
  } catch (error) {
    console.error("Get NEET Plan By ID Error:", error);
    throw error;
  }
};

// Create new NEET plan
export const createNeetPlan = async (payload) => {
  try {
    const { data } = await API.post('/neet-plans', payload);
    return data;
  } catch (error) {
    console.error("Create NEET Plan Error:", error);
    throw error;
  }
};

// Update existing NEET plan
export const updateNeetPlan = async (id, payload) => {
  try {
    const { data } = await API.put(`/neet-plans/${id}`, payload);
    return data;
  } catch (error) {
    console.error("Update NEET Plan Error:", error);
    throw error;
  }
};

// Add/update plan price for a platform
export const upsertNeetPlanPrice = async (payload) => {
  try {
    const { data } = await API.post('/neet-plans/price', payload);
    return data;
  } catch (error) {
    console.error("Upsert NEET Plan Price Error:", error);
    throw error;
  }
};

// Toggle plan active/inactive
export const toggleNeetPlan = async (id) => {
  try {
    const { data } = await API.patch(`/neet-plans/${id}/toggle`);
    return data;
  } catch (error) {
    console.error("Toggle NEET Plan Error:", error);
    throw error;
  }
};

// Toggle price active/inactive
export const toggleNeetPlanPrice = async (id) => {
  try {
    const { data } = await API.patch(`/neet-plans/price/${id}/toggle`);
    return data;
  } catch (error) {
    console.error("Toggle NEET Plan Price Error:", error);
    throw error;
  }
};

// Delete (disable) plan
export const deleteNeetPlan = async (id) => {
  try {
    const { data } = await API.delete(`/neet-plans/${id}`);
    return data;
  } catch (error) {
    console.error("Delete NEET Plan Error:", error);
    throw error;
  }
};


// ================================
//  SUBSCRIPTION FEATURE APIs (ADMIN)
// ================================

export const getSubscriptionFeaturesAdmin = async () => {
  try {
    const { data } = await API.get("/subscription-features/admin");
    return data;
  } catch (error) {
    console.error("Fetch subscription features error:", error);
    throw error;
  }
};

export const createFeatureCategory = async (payload) => {
  try {
    const { data } = await API.post("/subscription-features/categories", payload);
    return data;
  } catch (error) {
    console.error("Create category error:", error);
    throw error;
  }
};

export const updateFeatureCategory = async (id, payload) => {
  try {
    const { data } = await API.put(`/subscription-features/categories/${id}`, payload);
    return data;
  } catch (error) {
    console.error("Update category error:", error);
    throw error;
  }
};

export const deleteFeatureCategory = async (id) => {
  try {
    const { data } = await API.delete(`/subscription-features/categories/${id}`);
    return data;
  } catch (error) {
    console.error("Delete category error:", error);
    throw error;
  }
};

export const createSubscriptionFeature = async (payload) => {
  try {
    const { data } = await API.post("/subscription-features/features", payload);
    return data;
  } catch (error) {
    console.error("Create feature error:", error);
    throw error;
  }
};

export const updateSubscriptionFeature = async (id, payload) => {
  try {
    const { data } = await API.put(`/subscription-features/features/${id}`, payload);
    return data;
  } catch (error) {
    console.error("Update feature error:", error);
    throw error;
  }
};

export const deleteSubscriptionFeature = async (id) => {
  try {
    const { data } = await API.delete(`/subscription-features/features/${id}`);
    return data;
  } catch (error) {
    console.error("Delete feature error:", error);
    throw error;
  }
};

/* ======================================================
   AI DICTIONARY (ADMIN) — batch generation, run in small
   chunks, repeatable over time as new questions get added.
====================================================== */

export const runDictionaryBatch = async (batchSize) => {
  try {
    const { data } = await API.post("/ai/dictionary/generate-batch", { batchSize });
    return data;
  } catch (error) {
    console.error("Run Dictionary Batch Error:", error);
    throw error;
  }
};

export const fetchDictionaryProgress = async () => {
  try {
    const { data } = await API.get("/ai/dictionary/progress");
    return data;
  } catch (error) {
    console.error("Fetch Dictionary Progress Error:", error);
    throw error;
  }
};

export const startDictionaryAutoRun = async () => {
  try {
    const { data } = await API.post("/ai/dictionary/auto/start");
    return data;
  } catch (error) {
    console.error("Start Dictionary Auto Run Error:", error);
    throw error;
  }
};

export const stopDictionaryAutoRun = async () => {
  try {
    const { data } = await API.post("/ai/dictionary/auto/stop");
    return data;
  } catch (error) {
    console.error("Stop Dictionary Auto Run Error:", error);
    throw error;
  }
};

export const fetchDictionaryEntries = async (params) => {
  try {
    const { data } = await API.get("/ai/dictionary/entries", { params });
    return data;
  } catch (error) {
    console.error("Fetch Dictionary Entries Error:", error);
    throw error;
  }
};

export const retryDictionaryTerm = async (term) => {
  try {
    const { data } = await API.post("/ai/dictionary/retry", { term });
    return data;
  } catch (error) {
    console.error("Retry Dictionary Term Error:", error);
    throw error;
  }
};

export const retryFailedDictionaryTerms = async (limit) => {
  try {
    const { data } = await API.post("/ai/dictionary/retry-failed", { limit });
    return data;
  } catch (error) {
    console.error("Retry Failed Dictionary Terms Error:", error);
    throw error;
  }
};

/* ======================================================
   AI DICTIONARY — TEST SERIES — same shape as the regular
   AI Dictionary batch generation above, separate job reading
   from the Test Series question bank instead.
====================================================== */

export const runTestSeriesDictionaryBatch = async (batchSize) => {
  try {
    const { data } = await API.post("/ai/test-series-dictionary/generate-batch", { batchSize });
    return data;
  } catch (error) {
    console.error("Run Test Series Dictionary Batch Error:", error);
    throw error;
  }
};

export const fetchTestSeriesDictionaryProgress = async () => {
  try {
    const { data } = await API.get("/ai/test-series-dictionary/progress");
    return data;
  } catch (error) {
    console.error("Fetch Test Series Dictionary Progress Error:", error);
    throw error;
  }
};

export const startTestSeriesDictionaryAutoRun = async () => {
  try {
    const { data } = await API.post("/ai/test-series-dictionary/auto/start");
    return data;
  } catch (error) {
    console.error("Start Test Series Dictionary Auto Run Error:", error);
    throw error;
  }
};

export const stopTestSeriesDictionaryAutoRun = async () => {
  try {
    const { data } = await API.post("/ai/test-series-dictionary/auto/stop");
    return data;
  } catch (error) {
    console.error("Stop Test Series Dictionary Auto Run Error:", error);
    throw error;
  }
};

export const fetchChatUsage = async () => {
  try {
    const { data } = await API.get("/ai/chat/usage");
    return data;
  } catch (error) {
    console.error("Fetch Chat Usage Error:", error);
    throw error;
  }
};

export const fetchSettings = async () => {
  const { data } = await API.get("/settings");
  return data;
};

export const updateSetting = async (key, value) => {
  const { data } = await API.put(`/settings/${key}`, { value });
  return data;
};

export default API;


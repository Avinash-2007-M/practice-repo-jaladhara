import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

export const apiErrorMessage = (error) => {
  const data = error.response?.data;

  if (data?.errors && typeof data.errors === "object") {
    const messages = Object.values(data.errors).filter(Boolean);
    if (messages.length) return messages.join(" ");
  }

  if (error.response?.status === 401) {
    return "Please log in first to view this page.";
  }

  return (
    data?.message ||
    data?.error ||
    (error.request
      ? "Unable to reach the backend. Check that Express is running on port 3000."
      : "Something went wrong. Please try again.")
  );
};

export default api;

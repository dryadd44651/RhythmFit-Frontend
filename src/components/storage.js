import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";


// 獲取用戶的訓練動作
export const getExercises = async (setExercises) => {
  if (localStorage.getItem('guestMode')) {
    const exercises = JSON.parse(localStorage.getItem('exercises')) || [];
    setExercises(exercises);
    return;
  }

  const accessToken = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(`${API_BASE_URL}/api/exercises/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (Array.isArray(response.data)) {
      setExercises(response.data);
    } else {
      console.error("API response is not an array", response.data);
      setExercises([]);
    }
  } catch (err) {
    console.error("Failed to fetch exercises:", err);
    setExercises([]);
  }
};


// 新增訓練動作
export const addExercise = async (newExercise, setExercises) => {
  if (localStorage.getItem('guestMode')) {
    const exercises = JSON.parse(localStorage.getItem('exercises')) || [];
    exercises.push({ ...newExercise, id: Date.now() });
    localStorage.setItem('exercises', JSON.stringify(exercises));
    setExercises(exercises);
  } else {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.post(`${API_BASE_URL}/api/exercises/`, newExercise, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      getExercises(setExercises);
    } catch (err) {
      console.error("Failed to add exercise:", err);
    }
  }
};

// 刪除訓練動作
export const deleteExercise = async (exerciseId, setExercises) => {
  if (localStorage.getItem('guestMode')) {
    const exercises = JSON.parse(localStorage.getItem('exercises')) || [];
    const updatedExercises = exercises.filter((exercise) => exercise.id !== exerciseId);
    localStorage.setItem('exercises', JSON.stringify(updatedExercises));
    setExercises(updatedExercises);
  } else {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.delete(`${API_BASE_URL}/api/exercises/${exerciseId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      getExercises(setExercises);
    } catch (err) {
      console.error("Failed to delete exercise:", err);
    }
  }
};

// 更新訓練動作
export const updateExercise = async (exerciseId, editedExercise, setExercises) => {
  if (localStorage.getItem('guestMode')) {
    const exercises = JSON.parse(localStorage.getItem('exercises')) || [];
    const updatedExercises = exercises.map((exercise) =>
      exercise.id === exerciseId ? { ...exercise, ...editedExercise } : exercise
    );
    localStorage.setItem('exercises', JSON.stringify(updatedExercises));
    setExercises(updatedExercises);
  } else {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.put(`${API_BASE_URL}/api/exercises/${exerciseId}/`, editedExercise, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      getExercises(setExercises);
    } catch (err) {
      console.error("Failed to update exercise:", err);
    }
  }
};

// 獲取用戶資訊
export const fetchUserProfile = async (navigate, setUsername) => {
  if (localStorage.getItem('guestMode')) {
    setUsername("Guest");
    return;
  }
  let accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    console.error("Access token not found");
    navigate('/login');
    return;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setUsername(localStorage.getItem('username') || "Unknown User");
  } catch (err) {
    console.error(err);
    if (err.response && err.response.status === 401) {
      console.log("Access token expired, attempting to refresh...");
      accessToken = await refreshAccessToken(navigate);
      if (accessToken) {
        return fetchUserProfile(navigate, setUsername); // 再次嘗試請求
      } else {
        console.error("Unable to refresh token");
      }
    }
    navigate('/login');
  }
};

// 刷新存取令牌
export const refreshAccessToken = async (navigate) => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    console.error("Refresh token not found");
    navigate('/login');
    return;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
      refresh: refreshToken,
    });
    localStorage.setItem('accessToken', response.data.access);
    console.log("Access token refreshed");
    return response.data.access;
  } catch (err) {
    console.error("Failed to refresh token:", err);
    navigate('/login');
  }
};

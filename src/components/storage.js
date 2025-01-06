//storage.js
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";


// 獲取用戶的訓練動作
export const getUsername = async (userId) => {
  // let userId = 2;
  const accessToken = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.username;
  } catch (err) {
    console.error("Failed to fetch exercises:", err);
    return '';
  }
};


// 獲取用戶的訓練動作
export const getExercises = async () => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(`${API_BASE_URL}/api/exercises/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (Array.isArray(response.data)) {
      // setExercises(response.data);
      return response.data;
    } else {
      console.error("API response is not an array", response.data);
      // setExercises([]);
      return [];
    }
  } catch (err) {
    console.error("Failed to fetch exercises:", err);
    // setExercises([]);
    return [];
  }
};


// 新增訓練動作
export const addExercise = async (newExercise, setExercises) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.post(`${API_BASE_URL}/api/exercises/`, newExercise, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const updatedExercises = await getExercises();
      setExercises(updatedExercises);
    } catch (err) {
      console.error("Failed to add exercise:", err);
    }
};

// 刪除訓練動作
export const deleteExercise = async (exerciseId, setExercises) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    await axios.delete(`${API_BASE_URL}/api/exercises/${exerciseId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const updatedExercises = await getExercises();
    setExercises(updatedExercises);
  } catch (err) {
    console.error("Failed to delete exercise:", err);
  }
};

// 更新訓練動作
export const updateExercise = async (exerciseId, editedExercise, setExercises) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.put(`${API_BASE_URL}/api/exercises/${exerciseId}/`, editedExercise, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const updatedExercises = await getExercises();
      setExercises(updatedExercises);
    } catch (err) {
      console.error("Failed to update exercise:", err);
    }
};



export const auth = async () => {
  let accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    console.error("Access token not found");
    return false;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // setUsername(localStorage.getItem('username') || "Unknown User");
    return true;
  } catch (err) {
    console.error(err);
    if (err.response && err.response.status === 401) {
      console.log("Access token expired, attempting to refresh...");
      accessToken = await refreshToken();
      if (accessToken) {
        return auth(); // 再次嘗試請求
      } else {
        console.error("Unable to refresh token");
      }
    }
    return false;
  }
};

// 刷新存取令牌
export const refreshAccessToken = async (navigate) => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    console.error("Refresh token not found");
    // navigate('/login');
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

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    console.error("Refresh token not found");
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
  }
};

export const getUserID = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    console.error("Access token not found");
    return -1;
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/workouts/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("id: ", response.data[0]['id']);
    return response.data[0]['id'];
  } catch (err) {
    console.error("Failed to get id", err);
    if (err.response && err.response.status === 401) {
      console.log("Unauthorized access");
      return -1;
    }
    throw err;
  }
};

// 更新循環
export const updateCycle = async () => {
  let currentCycle = await setCurrentCycle(await getCycle());
  console.log("newCycle: ",currentCycle);

  const accessToken = localStorage.getItem('accessToken');
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/workouts/1/`,
      { currentCycle },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Cycle updated successfully on the server.");
    return response.data;
  } catch (err) {
    console.error("Failed to update cycle:", err);
    throw err;
  }
};

export const getCycle = async () => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/workouts/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Cycle: ", response.data[0]['currentCycle']);
    return response.data[0]['currentCycle'];
  } catch (err) {
    console.error("Failed to update cycle:", err);
    throw err;
  }
};



const setCurrentCycle = (prevCycle) => {
  const cycles = ["light", "medium", "heavy", "deload"];
  const nextIndex = (cycles.indexOf(prevCycle) + 1) % cycles.length;
  return cycles[nextIndex];
};
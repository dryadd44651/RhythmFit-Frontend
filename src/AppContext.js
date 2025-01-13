import React, { createContext, useState, useEffect } from "react";
import * as storage from "./components/storage";

// 創建 Context
const AppContext = createContext();

class TrainingSession {
  constructor(id, currentCycle, trainedGroups = [], user) {
    this.id = id;
    this.currentCycle = currentCycle;
    this.trainedGroups = trainedGroups;
    this.user = user;
  }
}


// 創建 Provider
export const AppProvider = ({ children }) => {
  const [exercises, setExercises] = useState([]);
  const [username, setUsername] = useState("");
  // const [currentCycle, setCurrentCycle] = useState("light");
  const [trainingSession, setTrainingSession] = useState(new TrainingSession(-1, "light", [], ""));

  const handleSetTrainingSession = async (newSession) => {
    await storage.updateWorkout(newSession);
    const settedSession = await storage.getWorkout();
    console.log("newSession: ", newSession);
    console.log("settedSession: ", settedSession);
    setTrainingSession(settedSession);
  };
  // const [trainedGroups, setTrainedGroups] = useState(() => {
  //   const stored = localStorage.getItem("trainedGroups");
  //   return stored ? JSON.parse(stored) : [];
  // });

  // 更新週期
  const finishCycle = async () => {
    try {
      await storage.updateCycle();
      const newCycle = await storage.getCycle();
      handleSetTrainingSession({ ...trainingSession, trainedGroups: [], currentCycle: newCycle });
    } catch (error) {
      console.error("Failed to update cycle:", error);
    }
  };

  const auth = async () => {
    let userID = await storage.getUserID();
    // console.log("userID: ", userID);
    if (userID<0) {
      await storage.refreshAccessToken();
      userID = await storage.getUserID();
    }
    // console.log("userID: ", userID);
    if (userID>=0){
      await updateData(userID);
      return true;
    } else{
      return false;
    }
  }

  const updateData = async (userID) => {
    try {
      const user = await storage.getUsername(userID);
      const exercisesData = await storage.getExercises();
      // const cycle = await storage.getCycle();
      const trainingSession = await storage.getWorkout();
      handleSetTrainingSession(trainingSession);
      console.log("trainingSession: ", trainingSession);
      setUsername(user);
      setExercises(exercisesData);
      // setCurrentCycle(cycle);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }    

  // const getExercises = async () => {}

  const addExercise = async(newExercise) =>{
    storage.addExercise(newExercise, setExercises);
  }

  const deleteExercise = async(exerciseId) =>{
    storage.deleteExercise(exerciseId, setExercises);
  }
  const updateExercise = async(exerciseId, editedExercise) =>{
    storage.updateExercise(exerciseId, editedExercise, setExercises);
  }


  return (
    <AppContext.Provider
      value={{
        exercises,
        addExercise,
        deleteExercise,
        updateExercise,        
        finishCycle,
        trainingSession,
        handleSetTrainingSession,
        auth,
        username,
        setUsername,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// 創建消費 Context 的 Hook
export const useAppContext = () => React.useContext(AppContext);

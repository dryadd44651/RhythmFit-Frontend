import React, { createContext, useState, useEffect } from "react";
import * as storage from "./components/storage";

// 創建 Context
const AppContext = createContext();

// 創建 Provider
export const AppProvider = ({ children }) => {
  const [exercises, setExercises] = useState([]);
  const [currentCycle, setCurrentCycle] = useState("light");
  const [trainedGroups, setTrainedGroups] = useState(() => {
    const stored = localStorage.getItem("trainedGroups");
    return stored ? JSON.parse(stored) : [];
  });

  // 加載初始數據
  useEffect(() => {
    console.log("context effect");
    (async () => {
      try {
        const exercisesData = await storage.getExercises();
        const cycle = await storage.getCycle();
        setExercises(exercisesData);
        setCurrentCycle(cycle);
        console.log("initial data: ", exercisesData, cycle)
      } catch (error) {
        console.error("Error loading data:", error);
      }
    })();
  }, []);

  // 更新週期
  const finishCycle = async () => {
    try {
      await storage.updateCycle();
      const newCycle = await storage.getCycle();
      setCurrentCycle(newCycle);
      setTrainedGroups([]); // 清空已訓練組
    } catch (error) {
      console.error("Failed to update cycle:", error);
    }
  };

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
        currentCycle,
        trainedGroups,
        setTrainedGroups,
        finishCycle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// 創建消費 Context 的 Hook
export const useAppContext = () => React.useContext(AppContext);

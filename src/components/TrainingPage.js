import React, { useState, useEffect } from 'react';
import { getExercises, updateExercise, fetchUserProfile, refreshAccessToken } from './storage';
import { useNavigate } from 'react-router-dom';
import './global.css';
import './TrainingPage.css';

const cycles = {
  light: { rm: 60, times: [12, 15], sets: 6 },
  medium: { rm: 70, times: [8, 10], sets: 6 },
  heavy: { rm: 85, times: [3, 5], sets: 5 },
  deload: { rm: 40, times: [25, 30], sets: 6 },
};

const muscleGroups = ["leg", "chest", "back", "shoulder", "arm"];

const TrainingPage = () => {
  const [exercises, setExercises] = useState([]);
  const [newExercise, setNewExercise] = useState({ name: '', max1RM: '', group: '' });
  const [editExerciseId, setEditExerciseId] = useState(null);
  const [editedExercise, setEditedExercise] = useState({ name: '', max1RM: '' });
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const [currentCycle, setCurrentCycle] = useState(() => {
    return localStorage.getItem("currentCycle") || 'light';
  });
  const [trainedGroups, setTrainedGroups] = useState(() => {
    const storedTrainedGroups = localStorage.getItem("trainedGroups");
    return storedTrainedGroups ? JSON.parse(storedTrainedGroups) : [];
  });
  const [expandedGroup, setExpandedGroup] = useState(null);
  
  // 檢查用戶是否已登入
  useEffect(() => {
    fetchUserProfile(navigate, setUsername);
  }, [navigate]);

  // 獲取用戶的訓練動作
  useEffect(() => {
    getExercises(setExercises);
  }, []);

  useEffect(() => {
    localStorage.setItem("currentCycle", currentCycle);
    localStorage.setItem("trainedGroups", JSON.stringify(trainedGroups));
  }, [currentCycle, trainedGroups]);

  const handleDone = (group) => {
    setTrainedGroups([...trainedGroups, group]);
  };

  const handleRetrain = (group) => {
    setTrainedGroups(trainedGroups.filter((g) => g !== group));
  };

  const toggleGroup = (group) => {
    setExpandedGroup(expandedGroup === group ? null : group);
  };

  const finishCycle = () => {
    const untrainedGroups = muscleGroups.filter(group => !trainedGroups.includes(group) && group !== 'arm');
    if (untrainedGroups.length > 0) {
      const confirmNextCycle = window.confirm("There are untrained groups. Are you sure you want to proceed to the next cycle?");
      if (!confirmNextCycle) return;
    }
    setTrainedGroups([]);
    setCurrentCycle((prevCycle) => {
      const cycles = ["light", "medium", "heavy", "deload"];
      const nextIndex = (cycles.indexOf(prevCycle) + 1) % cycles.length;
      return cycles[nextIndex];
    });
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <h1 className="title">Training Page</h1>
        <h2>Current Cycle: {currentCycle.charAt(0).toUpperCase() + currentCycle.slice(1)}</h2>

        {muscleGroups.map((group) => {
          const isTrained = trainedGroups.includes(group);
          const groupExercises = exercises.filter((exercise) => exercise.group === group);

          return (
              <div key={group} className="groupHeader">
                <h3 className="groupTitle" onClick={() => toggleGroup(group)}>
                  {group.charAt(0).toUpperCase() + group.slice(1)}
                </h3>
                {isTrained ? (
                  <button onClick={() => handleRetrain(group)} className="button">Retrain</button>
                ) : (
                  <button onClick={() => handleDone(group)} className="button">Done</button>
                )}
              
              {expandedGroup === group && (
                <div className="exerciseList">
                  {groupExercises.map((exercise) => (
                    <div key={exercise.id} className={isTrained ? "trainedExercise" : "exerciseCard"}>
                      <h4>{exercise.name}</h4>
                      <p>Weight: {Math.round(exercise.max1RM * cycles[currentCycle].rm / 100)} lb</p>
                      <p>Reps: {cycles[currentCycle].times.join(" - ")}</p>
                      <p>Sets: {cycles[currentCycle].sets}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <button onClick={finishCycle} className="finishButton">Finish Cycle</button>
      </div>
    </div>
  );
};

export default TrainingPage;

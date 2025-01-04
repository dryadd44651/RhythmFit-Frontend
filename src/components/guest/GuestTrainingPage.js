import React, { useState, useEffect } from 'react';
import { getExercises, updateCycle, getCycle, fetchUserProfile } from './storage';
import { useNavigate } from 'react-router-dom';
import './global.css';
import './GuestTrainingPage.css';

const cycles = {
  light: { rm: 60, times: [12, 15], sets: 6 },
  medium: { rm: 70, times: [8, 10], sets: 6 },
  heavy: { rm: 85, times: [3, 5], sets: 5 },
  deload: { rm: 40, times: [25, 30], sets: 6 },
};

const muscleGroups = ["leg", "chest", "back", "shoulder", "arm"];

const TrainingPage = () => {
  const [exercises, setExercises] = useState([]);
  const [trainedGroups, setTrainedGroups] = useState(() => {
    const storedTrainedGroups = localStorage.getItem("trainedGroups");
    return storedTrainedGroups ? JSON.parse(storedTrainedGroups) : [];
  });
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [currentCycle, setCurrentCycle] = useState('light');
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Step 1: Fetch user profile to determine authentication
  // useEffect(() => {
  //   const checkAuthentication = async () => {
  //     await fetchUserProfile(navigate, setUsername);
  //     setIsAuthenticated(!localStorage.getItem('guestMode'));
  //   };

  //   checkAuthentication();
  // }, [navigate]);

  // Step 2: Fetch exercises and current cycle after authentication is determined
  useEffect(() => {
      getExercises(setExercises);
      (async () => {
        const cycle = await getCycle();
        setCurrentCycle(cycle);
      })();
  });

  useEffect(() => {
    if (localStorage.getItem('guestMode')) {
      localStorage.setItem("trainedGroups", JSON.stringify(trainedGroups));
    }
  }, [trainedGroups]);

  const handleDone = (group) => {
    setTrainedGroups([...trainedGroups, group]);
  };

  const handleRetrain = (group) => {
    setTrainedGroups(trainedGroups.filter((g) => g !== group));
  };

  const toggleGroup = (group) => {
    setExpandedGroup(expandedGroup === group ? null : group);
  };

  const finishCycle = async () => {
    const untrainedGroups = muscleGroups.filter(
      (group) => !trainedGroups.includes(group) && group !== "arm"
    );

    if (untrainedGroups.length > 0) {
      const confirmNextCycle = window.confirm(
        "There are untrained groups. Are you sure you want to proceed to the next cycle?"
      );
      if (!confirmNextCycle) return;
    }

    setTrainedGroups([]);
    try {
      await updateCycle();
      setCurrentCycle(await getCycle());
    } catch (err) {
      console.error("Failed to update cycle:", err);
      alert("An error occurred while updating the cycle. Please try again.");
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <h1 className="title">Training Page</h1>
        <h2>
          {/* Current Cycle: {currentCycle.charAt(0).toUpperCase() + currentCycle.slice(1)} */}
          Current Cycle: {currentCycle}
        </h2>

        {muscleGroups.map((group) => {
          const isTrained = trainedGroups.includes(group);
          const groupExercises = exercises.filter(
            (exercise) => exercise.group === group
          );

          return (
            <div key={group} className="groupHeader">
              <h3 className="groupTitle" onClick={() => toggleGroup(group)}>
                {group.charAt(0).toUpperCase() + group.slice(1)}
              </h3>
              {isTrained ? (
                <button onClick={() => handleRetrain(group)} className="button">
                  Retrain
                </button>
              ) : (
                <button onClick={() => handleDone(group)} className="button">
                  Done
                </button>
              )}

              {expandedGroup === group && (
                <div className="exerciseList">
                  {groupExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className={isTrained ? "trainedExercise" : "exerciseCard"}
                    >
                      <h4>{exercise.name}</h4>
                      <p>
                        Weight:{" "}
                        {Math.round(
                          exercise.max1RM * cycles[currentCycle].rm / 100
                        )}{" "}
                        lb
                      </p>
                      <p>Reps: {cycles[currentCycle].times.join(" - ")}</p>
                      <p>Sets: {cycles[currentCycle].sets}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <button onClick={finishCycle} className="finishButton">
          Finish Cycle
        </button>
      </div>
    </div>
  );
};

export default TrainingPage;

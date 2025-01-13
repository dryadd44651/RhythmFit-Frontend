import React, { useState, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import './global.css';
import './TrainingPage.css';
  
class TrainingSession {
  constructor(id, currentCycle, trainedGroups, user) {
    this.id = id;
    this.currentCycle = currentCycle;
    this.trainedGroups = trainedGroups;
    this.user = user;
  }
}

const cycles = {
  light: { rm: 60, times: [12, 15], sets: 6 },
  medium: { rm: 70, times: [8, 10], sets: 6 },
  heavy: { rm: 85, times: [3, 5], sets: 5 },
  deload: { rm: 40, times: [25, 30], sets: 6 },
};


const muscleGroups = ["Legs", "Chest", "Back", "Shoulder", "Arm"];

const TrainingPage = () => {
  const [expandedGroup, setExpandedGroup] = useState(null);
  // const [username, setUsername] = useState('');


  const {
    exercises,
    trainingSession,
    handleSetTrainingSession,
    finishCycle,
  } = useAppContext();  

  const handlefinishCycle = async () => { 
    const untrainedGroups = muscleGroups.filter(
      (group) => !trainingSession.trainedGroups.includes(group) && group !== "arm"
    );

    if (untrainedGroups.length > 0) {
      const confirmNextCycle = window.confirm(
        "There are untrained groups. Are you sure you want to proceed to the next cycle?"
      );
      if (!confirmNextCycle) return;
    }

    try {
      await finishCycle();
    } catch (err) {
      console.error("Failed to update cycle:", err);
      alert("An error occurred while updating the cycle. Please try again.");
    }
  };


  const handleDone = (group) => {
    // setTrainedGroups([...trainingSession.trainedGroups, group]);
    const newSession = new TrainingSession(trainingSession.id, trainingSession.currentCycle, [...trainingSession.trainedGroups, group], trainingSession.user);
    // console.log("group: ", group);
    // console.log("newSession: ", newSession);
    handleSetTrainingSession(newSession);
  };

  const handleRetrain = (group) => {
    // setTrainedGroups(trainingSession.trainedGroups.filter((g) => g !== group));
    handleSetTrainingSession(new TrainingSession(trainingSession.id, trainingSession.currentCycle, trainingSession.trainedGroups.filter((g) => g !== group), trainingSession.user));
  };

  const toggleGroup = (group) => {
    setExpandedGroup(expandedGroup === group ? null : group);
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <h1 className="title">Training Page</h1>
        <h2>
          {/* Current Cycle: {currentCycle.charAt(0).toUpperCase() + currentCycle.slice(1)} */}
          Current Cycle: {trainingSession.currentCycle}
        </h2>

        {muscleGroups.map((group) => {
          // console.log("trainingSession.trainedGroups: ", trainingSession.trainedGroups);
          const isTrained = trainingSession.trainedGroups.includes(group);
            const groupExercises = exercises.filter(
            (exercise) => exercise.group.slice(0, 3).toUpperCase() === group.slice(0, 3).toUpperCase()
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
                          exercise.max1RM * cycles[trainingSession.currentCycle].rm / 100
                        )}{" "}
                        lb
                      </p>
                      <p>Reps: {cycles[trainingSession.currentCycle].times.join(" - ")}</p>
                      <p>Sets: {cycles[trainingSession.currentCycle].sets}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <button onClick={handlefinishCycle} className="finishButton">
          Finish Cycle
        </button>
      </div>
    </div>
  );
};

export default TrainingPage;

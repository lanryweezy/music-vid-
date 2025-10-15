import React from 'react';
import { useAppState } from '../context/AppStateContext';

interface ProgressStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

const ProgressIndicator: React.FC = () => {
  const { audioFile, sourceImageFile, prompt } = useAppState();

  const steps: ProgressStep[] = [
    {
      id: 1,
      title: 'Upload & Analyze',
      description: 'Upload your audio file',
      completed: !!audioFile,
      active: !audioFile,
    },
    {
      id: 2,
      title: 'Add Your Image',
      description: 'Optional image upload',
      completed: !!sourceImageFile,
      active: !!audioFile && !sourceImageFile,
    },
    {
      id: 3,
      title: 'Create Your Visuals',
      description: 'Describe your vision',
      completed: !!prompt.trim(),
      active: (!!audioFile || !!sourceImageFile) && !prompt.trim(),
    },
  ];

  const currentStep = steps.find(step => step.active) || steps[steps.length - 1];
  const progressPercentage = (steps.filter(step => step.completed).length / steps.length) * 100;

  return (
    <div className="progress-indicator" role="progressbar" aria-valuenow={Math.round(progressPercentage)} aria-valuemin={0} aria-valuemax={100} aria-label="Music video creation progress">
      <div className="progress-header">
        <h2 className="progress-title">Create Your Music Video</h2>
        <div className="progress-bar" aria-hidden="true">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="progress-percentage" aria-live="polite">{Math.round(progressPercentage)}% Complete</p>
      </div>
      
      <div className="steps-container">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className={`step ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}
            role="listitem"
            aria-label={`Step ${step.id}: ${step.title} - ${step.description}`}
          >
            <div className="step-indicator" aria-hidden="true">
              {step.completed ? (
                <i className="fa-solid fa-check"></i>
              ) : (
                <span className="step-number">{step.id}</span>
              )}
            </div>
            <div className="step-content">
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className={`step-connector ${step.completed ? 'completed' : ''}`} aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;

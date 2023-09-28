import React, { useEffect, useRef } from 'react';

const ProgressBar = ({ stages, currentStage }) => {
   const container = useRef(null);
   //   useEffect(() => {
   const ProgressBar = {};
   ProgressBar.singleStepAnimation = 1500;

   const renderingWaitDelay = 200;

   const createElement = (type, className, style, text) => {
      const elem = document.createElement(type);
      elem.className = className;
      for (const prop in style) {
         elem.style[prop] = style[prop];
      }
      elem.innerHTML = text;
      return elem;
   };

   const createStatusBar = (stages, stageWidth, currentStageIndex) => {
      const statusBar = createElement('div', 'status-bar', { width: 100 - stageWidth + '%' }, '');
      const currentStatus = createElement('div', 'current-status', {}, '');

      setTimeout(() => {
         currentStatus.style.width = (100 * currentStageIndex) / (stages.length - 1) + '%';
         currentStatus.style.transition = 'width ' + (currentStageIndex * ProgressBar.singleStepAnimation) + 'ms linear';
      }, renderingWaitDelay);

      statusBar.appendChild(currentStatus);
      return statusBar;
   };

   const createCheckPoints = (stages, stageWidth, currentStageIndex) => {
      const ul = createElement('ul', 'progress_bar', {}, '');
      let animationDelay = renderingWaitDelay;

      for (let index = 0; index < stages.length; index++) {
         const li = createElement('li', 'section', { width: stageWidth + '%' }, stages[index]);
         if (currentStageIndex >= index) {
            setTimeout((li, currentStageIndex, index) => {
               li.className += currentStageIndex > index ? ' visited' : ' visited current';
            }, animationDelay, li, currentStageIndex, index);
            animationDelay += ProgressBar.singleStepAnimation;
         }
         ul.appendChild(li);
      }
      return ul;
   };

   const createHTML = (wrapper, stages, currentStage) => {
      const stageWidth = 100 / stages.length;
      const currentStageIndex = stages.indexOf(currentStage);

      const statusBar = createStatusBar(stages, stageWidth, currentStageIndex);
      wrapper.appendChild(statusBar);

      const checkpoints = createCheckPoints(stages, stageWidth, currentStageIndex);
      wrapper.appendChild(checkpoints);
   };

   const validateParameters = (stages, currentStage, container) => {
      if (!(Array.isArray(stages) && stages.length && typeof stages[0] === 'string')) {
         console.error('Expecting an array of strings for the "stages" parameter.');
         return false;
      }
      if (typeof currentStage !== 'string') {
         console.error('Expecting a string for the "current stage" parameter.');
         return false;
      }
      if (typeof container !== 'string' && typeof container !== 'undefined') {
         console.error('Expecting string for the "container" parameter.');
         return false;
      }
      return true;
   };

   function init(stages, currentStage, container) {
      if (validateParameters(stages, currentStage, container)) {
         let wrapper = document.getElementsByClassName(container);
         if (wrapper.length > 0) {
            wrapper = wrapper[0];
         } else {
            wrapper = createElement('div', 'progress-bar-wrapper', {}, '');
            document.body.appendChild(wrapper);
         }
         createHTML(wrapper, stages, currentStage);
      }
   };

   // Initialize the progress bar only once
   //  if (typeof ProgressBar.init !== 'function') {


   //  }
   //   }, []);

   return (
      <div className="progress-bar-wrapper" ref={container}>
         {
            init(
               stages, currentStage, 
            )
         }
      </div>
   )
};

export default ProgressBar;

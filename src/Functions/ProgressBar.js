// export class ProgressBar {
//    constructor() {
//       this.singleStepAnimation = 1000; // Default value
//       // This delay is required as the browser will need some time for rendering and processing CSS animations.
//       this.renderingWaitDelay = 200;
//       this.initialized = false; // Added initialization flag
//    }

//    // A utility function to create an element
//    createElement(type, className, style, text) {
//       const elem = document.createElement(type);
//       elem.className = className;
//       for (const prop in style) {
//          elem.style[prop] = style[prop];
//       }
//       elem.innerHTML = text;
//       return elem;
//    }

//    createStatusBar(stages, stageWidth, currentStageIndex) {
//       const statusBar = this.createElement('div', 'status-bar', { width: 100 - stageWidth + '%' }, '');
//       const currentStatus = this.createElement('div', 'current-status', {}, '');

//       setTimeout(() => {
//          currentStatus.style.width = (100 * currentStageIndex) / (stages.length - 1) + '%';
//          currentStatus.style.transition = 'width ' + (currentStageIndex * this.singleStepAnimation) + 'ms linear';
//       }, this.renderingWaitDelay);

//       statusBar.appendChild(currentStatus);
//       return statusBar;
//    }

//    createCheckPoints(stages, stageWidth, currentStageIndex) {
//       const ul = this.createElement('ul', 'progress_bar', {}, '');
//       let animationDelay = this.renderingWaitDelay;

//       for (let index = 0; index < stages.length; index++) {
//          const li = this.createElement('li', 'section', { width: stageWidth + '%' }, stages[index]);
//          if (currentStageIndex >= index) {
//             setTimeout((li, currentStageIndex, index) => {
//                li.className += currentStageIndex > index ? ' visited' : ' visited current';
//             }, animationDelay, li, currentStageIndex, index);
//             animationDelay += this.singleStepAnimation;
//          }
//          ul.appendChild(li);
//       }
//       return ul;
//    }

//    createHTML(wrapper, stages, currentStage) {
//       const stageWidth = 100 / stages.length;
//       const currentStageIndex = stages.indexOf(currentStage);

//       // Create status bar
//       const statusBar = this.createStatusBar(stages, stageWidth, currentStageIndex);
//       wrapper.appendChild(statusBar);

//       // Create checkpoints
//       const checkpoints = this.createCheckPoints(stages, stageWidth, currentStageIndex);
//       wrapper.appendChild(checkpoints);

//       return wrapper;
//    }

//    validateParameters(stages, currentStage, container) {
//       if (!(Array.isArray(stages) && stages.length && typeof stages[0] === 'string')) {
//          console.error('Expecting an array of strings for the "stages" parameter.');
//          return false;
//       }
//       if (typeof currentStage !== 'string') {
//          console.error('Expecting a string for the "current stage" parameter.');
//          return false;
//       }
//       if (typeof container !== 'string' && typeof container !== 'undefined') {
//          console.error('Expecting a string for the "container" parameter.');
//          return false;
//       }
//       return true;
//    }

//    // Expose this function to the user
//    init(stages, currentStage, container) {
//       if (this.initialized) {
//          console.error('Progress bar already initialized.');
//          return;
//       }

//       if (this.validateParameters(stages, currentStage, container)) {
//          let wrapper = document.getElementsByClassName(container);
//          if (wrapper.length > 0) {
//             wrapper = wrapper[0];
//          } 
      
         
//          else {
//             wrapper = this.createElement('div', 'progress-bar-wrapper', {}, '');
//             document.body.appendChild(wrapper);
//          }
//          this.createHTML(wrapper, stages, currentStage);
//          this.initialized = true; // Mark as initialized
//       }
//    }
// };

// progressBar.js

// A utility function to create an element
function createElement(type, className, style, text) {
   const elem = document.createElement(type);
   elem.className = className;
   for (const prop in style) {
      elem.style[prop] = style[prop];
   }
   elem.innerHTML = text;
   return elem;
}

function createStatusBar(stages, stageWidth, currentStageIndex, singleStepAnimation, renderingWaitDelay) {
   const statusBar = createElement('div', 'status-bar', { width: 100 - stageWidth + '%' }, '');
   const currentStatus = createElement('div', 'current-status', {}, '');

   setTimeout(() => {
      currentStatus.style.width = (100 * currentStageIndex) / (stages.length - 1) + '%';
      currentStatus.style.transition = 'width ' + (currentStageIndex * singleStepAnimation) + 'ms linear';
   }, renderingWaitDelay);

   statusBar.appendChild(currentStatus);
   return statusBar;
}

function createCheckPoints(stages, stageWidth, currentStageIndex, singleStepAnimation, renderingWaitDelay) {
   const ul = createElement('ul', 'progress_bar', {}, '');
   let animationDelay = renderingWaitDelay;

   for (let index = 0; index < stages.length; index++) {
      const li = createElement('li', 'section', { width: stageWidth + '%' }, stages[index]);
      if (currentStageIndex >= index) {
         setTimeout((li, currentStageIndex, index) => {
            li.className += currentStageIndex > index ? ' visited' : ' visited current';
         }, animationDelay, li, currentStageIndex, index);
         animationDelay += singleStepAnimation;
      }
      ul.appendChild(li);
   }
   return ul;
}

function createHTML(stages, currentStage, container, singleStepAnimation = 1000, renderingWaitDelay = 200) {
   const stageWidth = 100 / stages.length;
   const currentStageIndex = stages.indexOf(currentStage);

   let wrapper = document.getElementsByClassName(container);
   if (wrapper.length > 0) {
      wrapper = wrapper[0];
   } else {
      wrapper = createElement('div', 'progress-bar-wrapper', {}, '');
      document.body.appendChild(wrapper);
   }

   // Create status bar
   const statusBar = createStatusBar(stages, stageWidth, currentStageIndex, singleStepAnimation, renderingWaitDelay);
   wrapper.appendChild(statusBar);

   // Create checkpoints
   const checkpoints = createCheckPoints(stages, stageWidth, currentStageIndex, singleStepAnimation, renderingWaitDelay);
   wrapper.appendChild(checkpoints);

   return wrapper;
}

function validateParameters(stages, currentStage, container) {
   if (!(Array.isArray(stages) && stages.length && typeof stages[0] === 'string')) {
      console.error('Expecting an array of strings for the "stages" parameter.');
      return false;
   }
   if (typeof currentStage !== 'string') {
      console.error('Expecting a string for the "current stage" parameter.');
      return false;
   }
   if (typeof container !== 'string' && typeof container !== 'undefined') {
      console.error('Expecting a string for the "container" parameter.');
      return false;
   }
   return true;
}

// Expose this function to the user
function initProgressBar(stages, currentStage, container) {
   if (validateParameters(stages, currentStage, container)) {
      createHTML(stages, currentStage, container);
   }
}

export { initProgressBar };

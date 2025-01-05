class Semaphore {

    

    constructor(maxConcurrency) {
      this.maxConcurrency = maxConcurrency;
      this.currentCount = 0;
      this.queue = [];
      this.activeAbortControllers = new Set(); // Track active AbortControllers
      
    }
  
    async acquire() {
      if (this.currentCount < this.maxConcurrency) {
        this.currentCount++;
      } else {
        await new Promise(resolve => this.queue.push(resolve));
      }
    }
  
    release() {
      if (this.queue.length > 0) {
        const nextResolve = this.queue.shift();
        nextResolve();
      } else {
        this.currentCount--;
      }
    }

    

    async waitUntilEmpty() {
        return new Promise(resolve => {
          const checkQueue = () => {
            if (this.queue.length === 0 && this.currentCount === 0) {
              resolve();
            } else {
              setTimeout(checkQueue, 50); // Check again after a short delay
            }
          };
          checkQueue();
        });
      }

      getAbortController() {
        const controller = new AbortController();
        this.activeAbortControllers.add(controller); // Add to active controllers
    
        controller.signal.addEventListener('abort', () => {
          this.activeAbortControllers.delete(controller); // Remove when aborted
        });
    
        return controller;
      }
    
      cancelAll= () => {
        for (const controller of this.activeAbortControllers) {
          controller.abort(); // Abort all active controllers
        }
        this.activeAbortControllers.clear(); // Clear the set
      }
      
  }
  
  export default Semaphore;
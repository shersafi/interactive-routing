// PriorityQueue class
class PriorityQueue {
    constructor() {
      this.items = [];
    }
  
    enqueue(node, priority) {
      const item = { node, priority };
      let added = false;
      for (let i = 0; i < this.items.length; i++) {
        if (item.priority < this.items[i].priority) {
          this.items.splice(i, 0, item);
          added = true;
          break;
        }
      }
      if (!added) {
        this.items.push(item);
      }
    }
  
    dequeue() {
      if (this.isEmpty()) {
        return null;
      }
      return this.items.shift().node;
    }
  
    isEmpty() {
      return this.items.length === 0;
    }
  }

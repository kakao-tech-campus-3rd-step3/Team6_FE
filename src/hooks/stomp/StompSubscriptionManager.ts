import type { StompSubscription } from "@stomp/stompjs";

class StompSubscriptionManager {
  private static instance: StompSubscriptionManager;
  private activeSubscriptions = new Map<string, StompSubscription>();

  static getInstance() {
    if (!this.instance) {
      this.instance = new StompSubscriptionManager();
    }
    return this.instance;
  }

  isSubscribed(destination: string): boolean {
    return this.activeSubscriptions.has(destination);
  }

  addSubscription(destination: string, subscription: StompSubscription) {
    if (!this.activeSubscriptions.has(destination)) {
      this.activeSubscriptions.set(destination, subscription);
    }
  }

  removeSubscription(destination: string): StompSubscription | null {
    const subscription = this.activeSubscriptions.get(destination);
    if (subscription) {
      this.activeSubscriptions.delete(destination);
      return subscription;
    }
    return null;
  }

  getSubscription(destination: string): StompSubscription | undefined {
    return this.activeSubscriptions.get(destination);
  }

  clear() {
    this.activeSubscriptions.clear();
  }
}

export const subscriptionManager = StompSubscriptionManager.getInstance();

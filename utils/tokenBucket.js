export class TokenBucket {
  constructor(capacity, fillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.fillRate = fillRate;
    this.lastRefill = Date.now();
  }

  refill() {
    const now = Date.now();
    const secondsPassed = (now - this.lastRefill) / 1000;
    const tokensToAdd = secondsPassed * this.fillRate;
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  tryRemoveToken() {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}

export const userBuckets = new Map();

export const getUserBucket = (email) => {
  if (!userBuckets.has(email)) {
    userBuckets.set(email, new TokenBucket(5, 1));
  }
  return userBuckets.get(email);
};

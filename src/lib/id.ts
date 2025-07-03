// Utility to generate unique IDs for chat messages
export function generateId() {
  return Date.now().toString() + Math.random().toString(36).slice(2, 8);
}

import { hashString } from "./seed";

export function childSeed(parentComponentSeed: string, childSlot: string, childIndex = 0) {
  return hashString(`${parentComponentSeed}:${childSlot}:${childIndex}`);
}

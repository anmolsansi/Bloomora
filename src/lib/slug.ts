import { v4 as uuidv4 } from "uuid";

export function generateSlug(): string {
  const uuid = uuidv4();
  const shortId = uuid.replace(/-/g, "").slice(0, 8);
  return `bq_${shortId}`;
}

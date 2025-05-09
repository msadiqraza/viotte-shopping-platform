export async function loadJSON<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return (await response.json()) as T;
}
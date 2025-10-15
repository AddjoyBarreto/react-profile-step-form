export function submitApplication<T>(data: T): Promise<{ ok: true; id: string }> {
  //console.log(data); // Debug log
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ok: true, id: Math.random().toString(36).slice(2) }), 800);
  });
}

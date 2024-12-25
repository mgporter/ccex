export async function httpget<T>(url: string, options?: RequestInit): Promise<T | null> {
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(res => {
        if (res.status === 404) return null;
        return res.json();
      })
      .then(data => resolve(data))
      .catch(error => {
        reject(error)
      })
  });

}
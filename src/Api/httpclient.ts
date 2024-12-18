export async function httpget<T>(url: string, options?: RequestInit): Promise<T> {
  console.log(url)
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(res => res.json())
      .then(data => resolve(data as T))
      .catch(error => {
        reject(error)
      })
  });

}
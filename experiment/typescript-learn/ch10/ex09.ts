async function delay<T>(ms: number, value: T) {
  await new Promise(() => {
    setTimeout(() => {}, ms);
  })
  return value;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>(() => setTimeout(() => {
    throw new Error("Qua thoi gian"); 
  }, ms));
  return Promise.race([timeout, promise]);
}


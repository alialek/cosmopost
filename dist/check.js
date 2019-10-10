const check = () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('No Service Worker support!');
  }
  if (!('PushManager' in window)) {
    throw new Error('No Push API Support!');
  }
};

const registerServiceWorker = async () => {
  const swRegistration = await navigator.serviceWorker.register('/service.js'); //notice the file name
  return swRegistration;
};
const main = async () => {
  //notice I changed main to async function so that I can use await for registerServiceWorker
  check();
  const swRegistration = await registerServiceWorker();
};
main();

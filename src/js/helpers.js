import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    //API
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    //Convert to Obj
    const data = await res.json();

    //Error handling
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err; //reject promise, send from this async func to other
  }
};

// export const getJSON = async function (url) {
//   try {
//     //API
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//     //Convert to Obj
//     const data = await res.json();

//     //Error handling
//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     throw err; //reject promise, send from this async func to other
//   }
// };

// export const sendJSON = async function (url, uploadData) {
//   try {
//     //API
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     //Convert to Obj
//     const data = await res.json();

//     //Error handling
//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     throw err; //reject promise, send from this async func to other
//   }
// };

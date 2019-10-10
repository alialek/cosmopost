export default function authHeader() {
  let user = localStorage.getItem('user');
  if (user) {
    return {
      authorization: 'Bearer ' + user,
      'Content-Type': 'application/json'
    };
  } else {
    return {};
  }
}

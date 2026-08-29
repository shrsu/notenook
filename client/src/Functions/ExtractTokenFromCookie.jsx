function extractTokenFromCookie() {
  const cookies = document.cookie;
  if (cookies) {
    const tokenCookie = cookies
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="));

    if (tokenCookie) {
      return tokenCookie.split("=")[1];
    }
  }
  return null;
}

export default extractTokenFromCookie;

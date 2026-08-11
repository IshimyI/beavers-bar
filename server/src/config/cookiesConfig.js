module.exports = {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24,
  };
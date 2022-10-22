let token = "";
export async function getAccessToken() {
  const payload = await fetch(
    "https://accounts.spotify.com/api/token?" +
      [
        `client_id=${process.env.SPOTIFY_CLIENT_ID}`,
        `client_secret=${process.env.SPOTIFY_CLIENT_SECRET}`,
        `grant_type=client_credentials`,
      ].join("&"),
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  const { access_token } = await payload.json();
  if (access_token) {
    token = access_token;
  }
  return access_token;
}
export async function getMyTracks() {
  const payload = await fetch("https://api.spotify.com/v1/me/tracks?limit=48", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const { error, data } = await payload.json();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function getTracks(trackIds: string[]) {
  const qs = encodeURI(trackIds.join(","));
  const payload = await fetch("https://api.spotify.com/v1/tracks?ids=" + qs, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const { error, tracks } = await payload.json();
  if (error) {
    throw new Error(error.message);
  }
  return { tracks };
}

let token = "";
export async function getAccessToken() {
  const payload = await fetch(
    "https://accounts.spotify.com/api/token?" +
      [
        `grant_type=refresh_token`,
        `refresh_token=${process.env.MANUALLY_OBTAINED_SPOTIFY_REFRESH_TOKEN}`,
      ].join("&"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            [
              process.env.SPOTIFY_CLIENT_ID,
              process.env.SPOTIFY_CLIENT_SECRET,
            ].join(":")
          ).toString("base64"),
      },
    }
  );
  const res = await payload.json();
  token = res.access_token;
}
export async function getMyTracks() {
  const payload = await fetch("https://api.spotify.com/v1/me/tracks?limit=48", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const { error, items } = await payload.json();
  if (error) {
    throw new Error(error.message);
  }
  return items;
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

import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

type TODO = any;
type SpotifyTrack = TODO;
type SpotifyArtist = TODO;
type SpotifyItem = TODO;

type Track = {
  uri: string;
  href: string;
  artists: string;
  name: string;
  image: string;
};

type HomeProps = {
  tracks: Track[];
};

const Home: NextPage<HomeProps> = ({ tracks }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Top of the Month</title>
        <meta name="description" content="Music curation of the past month" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Top of the month</h1>

        <ul className={styles.list}>
          {tracks.map((track) => (
            <li key={track.uri} className={styles.listitem}>
              <a href={track.href} target="_blank" rel="noreferrer">
                <Image
                  src={track.image}
                  width="300"
                  height="300"
                  alt={`Cover picture for ${track.name}`}
                />
                {/* {track.name} - {track.artists} */}
              </a>
            </li>
          ))}
        </ul>
      </main>

      <footer className={styles.footer}>
        <a href="https://github.com/xavhan/top-of-the-month">Source</a>
      </footer>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  var authOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  const auth = await fetch(
    "https://accounts.spotify.com/api/token?" +
      [
        "grant_type=authorization_code",
        "client_id=" + process.env.SPOTIFY_CLIENT_ID,
        "client_secret=" + process.env.SPOTIFY_CLIENT_SECRET,
        "code=" + process.env.SPOTIFY_CODE,
        "scope=user-library-read",
        "redirect_uri=https://top-of-the-month.netlify.app/",
      ].join("&"),
    authOptions
  );
  const authPayload = await auth.json();
  console.log(authPayload);

  const res = await fetch(
    `https://api.spotify.com/v1/me/tracks?access_token=${authPayload.access_token}&limit=48`,
    {
      // 3*16
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  const payload1 = await res.json();
  console.log(payload1);
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const favTracks = payload1.items
    .filter((item: SpotifyItem) => new Date(item.added_at) > lastMonthDate)
    .map((item: SpotifyItem) => item.track.id);
  const qs = encodeURI(favTracks.join(","));
  const res2 = await fetch(
    `https://api.spotify.com/v1/tracks?access_token=${authPayload.access_token}&ids=` +
      qs,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  const payload2 = await res2.json();

  const tracks = payload2.tracks.map((track: SpotifyTrack) => ({
    name: track.name,
    artists: track.artists
      .map((artist: SpotifyArtist) => artist.name)
      .join(", "),
    uri: track.uri,
    href: track.external_urls.spotify,
    image: track.album.images[1].url,
  }));

  return {
    props: {
      tracks,
    },
    revalidate: 60 * 60 * 6, // 6h
  };
};

export default Home;

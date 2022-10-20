import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { TRACKS } from "../data/2022-09";
import styles from "../styles/Home.module.css";

type TODO = any;
type SpotifyTrack = TODO;
type SpotifyArtist = TODO;

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
        <h1 className={styles.title}>Top of last month</h1>

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
  const qs = encodeURI(TRACKS.map((url) => url.split("track/")[1]).join(","));
  const res = await fetch("https://api.spotify.com/v1/tracks?ids=" + qs, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.SPOTIFY_OAUTH_TOKEN,
    },
  });
  const payload = await res.json();
  const tracks = payload.tracks.map((track: SpotifyTrack) => ({
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
  };
};

export default Home;

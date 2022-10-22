import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { getAccessToken, getMyTracks, getTracks } from "../spotify/api";
import styles from "../styles/Home.module.css";
import { September2022 } from "../data/2022_09";
import { SpotifyArtist, SpotifyTrack, Track } from "../spotify/types";

type HomeProps = {
  tracks: Track[];
};

const Home: NextPage<HomeProps> = ({ tracks }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Top of the Month</title>
        <meta name="description" content="Music curation for September 2022" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Top of the month</h1>
        <h2>September 2022</h2>

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
  await getAccessToken();
  const favTracks = September2022.slice(0, 48).map(
    (url) => url.split("track/")[1]
  );
  const { tracks } = await getTracks(favTracks);
  const myTracks = tracks.map((track: SpotifyTrack) => ({
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
      tracks: myTracks,
    },
  };
};

export default Home;

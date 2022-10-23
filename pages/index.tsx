import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { getAccessToken, getMyTracks, getTracks } from "../spotify/api";
import styles from "../styles/Home.module.css";
import {
  SpotifyArtist,
  SpotifyItem,
  SpotifyTrack,
  Track,
} from "../spotify/types";

type HomeProps = {
  tracks: Track[];
};

const Home: NextPage<HomeProps> = ({ tracks }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Latest musical discoveries</title>
        <meta name="description" content="@xavhan latest musical discoveries" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>My latest musical discoveries</h1>

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
  const favTracks = await getMyTracks();
  const { tracks } = await getTracks(
    favTracks.map((i: SpotifyItem) => i.track.id)
  );
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
    revalidate: 60 * 60 * 6,
  };
};

export default Home;

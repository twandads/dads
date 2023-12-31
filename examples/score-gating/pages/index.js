import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Gate from "../components/gate";

export default function Home() {
  return (
    <>
      <Head>
        <title>Score Gating</title>
        <meta
          name="description"
          content="A sample app to demonstrate using the Gitcoin passport scorer API"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <div>
            <a
              href="https://www.gitcoin.co/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/gitcoinWordLogo.svg"
                alt="Gitcoin Logo"
                className={styles.gitcoinLogo}
                width={150}
                height={34}
                priority
              />
            </a>
          </div>
          <ConnectButton />
        </div>

        <div className={styles.center}>
          <Gate />
        </div>

        <div className={styles.grid} />
      </main>
    </>
  );
}

import React, { useState } from 'react';
import Header from '../components/header/header.component';
import Player from '../components/player/player.component';
import { PlayerContextProvider } from '../context/playerContex';
import styles from '../styles/app.module.scss';
import '../styles/global.scss';

function MyApp({ Component, pageProps }) {
    return (
        <PlayerContextProvider>
            <div className={styles.appWrapper}>
                <main>
                    <Header />
                    <Component {...pageProps} />
                </main>
                <Player />
            </div>
        </PlayerContextProvider>
    )
}

export default MyApp
import React from 'react';

import Header from '../components/header/header.component';
import Player from '../components/player/player.component';

import styles from '../styles/app.module.scss';
import '../styles/global.scss';

function MyApp({ Component, pageProps }) {
    return (
        <div className={styles.appWrapper}>
            <main>
                <Header/>
                <Component {...pageProps}/>
            </main>
            <Player/>
        </div>
    )
}

export default MyApp
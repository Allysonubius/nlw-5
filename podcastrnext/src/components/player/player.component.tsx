import { useEffect, useRef, useState } from 'react';
import {  usePlayer } from '../../context/playerContex';
import styles from './styles.module.scss';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

const Player: React.FunctionComponent = () => {

    const audioRef = useRef<HTMLAudioElement>(null);

    const [progress, setProgress] = useState(0);

    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        hasNext,
        hasPrevious,
        isLooping,
        isShuffling,
        toggleShuffle,
        toggleLoop,
        togglePlay,
        setPlayingState,
        playNext,
        playPrevious,
        clearPlayerState
    } = usePlayer();

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying])

    function setupProgressListener(){
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () =>{
            setProgress(Math.floor(audioRef.current.currentTime));
        });
    }

    function handleSeek(amount: number){
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded(){
        if(hasNext){
            playNext()
        }else{
            clearPlayerState()
        }
    }

    const episode = episodeList[currentEpisodeIndex]

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="./playing.svg" alt="Tocando agora." />
                <strong>Tocando agora</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image width={592} height={600} src={episode.thumbnail} objectFit="cover"/>
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir.</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider onChange={handleSeek} max={episode.duration} value={progress} trackStyle={{ backgroundColor: 'var(--green-500)' }}  railStyle={{backgroundColor: 'var(--white)' }}  handleStyle={{ borderColor: 'var(--gray-800)', borderWidth:4}}/>
                        ) : (
                                <div className={styles.emptySlider} />
                            )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio src={episode.url} ref={audioRef} onPlay={() => setPlayingState(true)} onEnded={handleEpisodeEnded} onPause={() => setPlayingState(false)} autoPlay loop={isLooping} onLoadedMetadata={setupProgressListener}/>
                )}

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode || episodeList.length == 1 } onClick={toggleShuffle} className={isShuffling ? styles.isActive : ''}>
                        <img src="./shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-previous.svg" alt="Tocar proximo" />
                    </button>
                    <button type="button"  className={styles.playButton} disabled={!episode} onClick={togglePlay}>
                        {isPlaying ? <img src="./pause.svg" alt="Pause" />
                            : <img src="./play.svg" alt="Play" />
                        }
                    </button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="./play-next.svg" alt="Tocar anterior" />
                    </button>
                    <button type="button" disabled={!episode} onClick={toggleLoop} className={isLooping ? styles.isActive : ''}>
                        <img src="./repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    )
}

export default Player;
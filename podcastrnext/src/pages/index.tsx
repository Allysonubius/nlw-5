import React, { useContext } from "react";
import  { format ,parseISO } from 'date-fns'
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import api from "../services/api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import { ptBR } from "date-fns/locale";

import styles from './home.module.scss';
import { PlayerContext } from "../context/playerContex";

type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    members:string;
    duration:number;
    durationAsString:string;
    url:string;
    publishedAt:string;
}

type HomeProps = {
    latestEpisodes: Episode[];
    allEpisodes: Episode[];
}

export default function Home({latestEpisodes, allEpisodes}:HomeProps) {

    const { play } = useContext(PlayerContext);
    
    return (
        <div className={styles.homepage}>
            <section className={styles.latestEpisodes}>
                <h2>Ultimos lançamentos { play } </h2>
                <ul>
                    {latestEpisodes.map(episode => {
                        return(
                            <li key={episode.id}>
                                <Image 
                                    width={200} 
                                    height={300} 
                                    src={episode.thumbnail} 
                                    alt={episode.title}
                                    objectFit="cover"
                                />

                                <div className={styles.episodesDetails}>
                                    <Link href={`/episodes/${episode.id}`}>
                                        <a>{episode.title}</a>
                                    </Link>
                                    <p>{episode.members}</p>
                                    <span>{episode.publishedAt}</span>
                                    <span>{episode.durationAsString}</span>
                                </div>
                                <button type="button" onClick={() => play (episode)}>
                                    <img src="./play-green.svg" alt="Tocar episodio"/>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </section>
            <section className={styles.allEpisodes}>
                <h2>Todos episodios</h2>
                <table cellSpacing={0}>
                    <thead>
                        <th></th>
                        <th>Podcast</th>
                        <th>Integrantes</th>
                        <th>Data</th>
                        <th>Duração</th>
                        <th></th>
                    </thead>
                    <tbody>
                        {allEpisodes.map(episode =>{
                            return(
                                <tr key={episode.id}>
                                    <td style={{width:80}}>
                                        <Image 
                                            width={120}
                                            height={120}
                                            src={episode.thumbnail}
                                            alt={episode.title}
                                            objectFit="cover"
                                        />
                                    </td>
                                    <td>
                                        <Link href={`/episodes/${episode.id}`}>
                                           <a>{episode.title}</a>
                                        </Link>
                                    </td>
                                    <td>{episode.members}</td>
                                    <td style={{width:110}}>{episode.publishedAt}</td>
                                    <td>{episode.durationAsString}</td>
                                    <td>
                                        <button type="button">
                                            <img src="./play-green.svg" alt="Tocar episodio"/>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </section>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const { data } = await api.get('episodes',{
        params:{
        _limit: 10,
        _sort:'published_at',
        _order:'desc',
        }
    })

    const episodes = data.map(episode => {
        return {
            id: episode.id,
            title: episode.title,
            thumbnail: episode.thumbnail,
            members: episode.members,
            publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR }),
            duration: Number(episode.file.duration),
            durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
            url: episode.file.url,    
        }
    })

    const latestEpisodes = episodes.slice(0,2);
    const allEpisodes = episodes.slice(2, episodes.length);

    return {
        props: {
            latestEpisodes,
            allEpisodes,
        },
        revalidate: 60 * 60 * 8
    }
}

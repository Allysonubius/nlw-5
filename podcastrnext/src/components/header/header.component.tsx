import styles from './styles.module.scss'
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR'

const Header:React.FunctionComponent = () => {

    const currentDate = format(new Date(), 'EEEE, dd MMMM',{
        locale:ptBR,
    });

    return(
        <header className={styles.headerContainer}>
            <img src="./logo.svg" alt="`Podcastr"/>
            <p>O melhor para você ouvir , sempre.</p>
            <span>{currentDate}</span>
        </header>
    )
}

export default Header;
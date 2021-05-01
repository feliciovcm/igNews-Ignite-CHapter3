import { SignInButton } from "../SignInButton";
import styles from "./styles.module.scss";
import { ActiveLink } from "../ActiveLink";

//PARA MELHORAR PERFORMACE, ISAREMOS O COMPONENT LINK DO NEXT/LINK. ELE PERMITE,
// APROVEITAR O MÁXIMO DA PERFORMACE DO NEXT E REACT. CARREGANDO SOMENTE O NECESSÁRIO,
// ENTRE UMA PÁGINA E OUTRA.

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="logo" />
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts">
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}

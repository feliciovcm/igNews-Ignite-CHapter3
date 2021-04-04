import { GetStaticProps } from "next";
import Head from "next/head";

import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";

import styles from "./home.module.scss";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

// Existem três formas de fazer uma chamada API utilizando next.JS
// 1. Client Side rendering - Chamadas não custosas, que não possuem a necessidade de serem indexissadas por motores de busca
// SERÁ REALIZADA SOMENTE APÓS A TELA SER CARREGADA, INFORMAÇÕES QUE NÃO POSSUEM NECESSIDADE DE SEREM EXIBIDAS NO CARREGAMENTO DA TELA
//                              Ex: não precisa de idexissação, informação carregada por uma ação do usuário, seção de comentários em blog...

// 2. Server side rendering - Chamadas que precisam ser Indexissadas por motores de busca e devem ser realizadas a cada acesso.
//                              Ex: Dados dinâmicos da seção do usuário, informações do usuário que está acessando...
// AS CHAMADAS SÃO REALIZADAS ANTES, E APÓS COMPLETAS, A TELA É CARREGADA. INFORMAÇÕES QUE DEVEM SER EXIBIDAS EM TELA, LOGO NO CARREGAMENTO.

// 3. Static side generation - Chamadas indexissafas por motores de busca que seus dados a serem exibidos não irão se alterar de
// usuario para usuário, acessando a aplicação. 
//                              Ex: Home de blog, posts de blogs, página de um produto em ecommerce...
// AS CHAMADAS SÃO FEITAS DE TEMPO EM TEMPO DEFINIDO. NESSE MEIO TEMPO, A INFORMAÇÃO DA CHAMDA ANTERIOR É SALVA E EXIBIDA EM TODOS OS ACESSOS NESSE PERÍODO.


export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Inicio | igNews</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="girl coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  //buscar as informações do preço do produto. Usar a pripria biblioteca api do stripe,
  //passando o price api id, que pode ser adquirido no site da stripe, dentro do produto cadastrado.
  const price = await stripe.prices.retrieve("price_1IcEwdHpdfK0unIquLg4SwAu", {
    expand: ["product"],
  });
  //o expand product é utilizado para buscar todas as informações do produto, titulo, imagem, etc, possibilitando utilizar
  //essas informações na aplicação.

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, //24hrs
  };
};

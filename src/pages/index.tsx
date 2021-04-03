import { GetServerSideProps } from "next";
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
          <SubscribeButton priceId={product.priceId}/>
        </section>

        <img src="/images/avatar.svg" alt="girl coding" />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
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
  };
};

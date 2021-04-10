//Como será utilizada a chave secreta do stripe, é necessário criar esse arquivo, pois, os únicos lugares, seguros, que simulam um backend
// em uma aplicação que se utiliza de next.js são:
// 1- getServerSideProps
// 2- getStaticProps
// 3- api roots (pasta api)
// como getserverside e getstatic são funções executadas somente no momento em que a página é exibida, não sendo funcionais para quando,
// o usuário executar alguma ação, usaremos a api root, criando esse aquivo.

import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../services/stripe";
import { getSession } from "next-auth/client";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // primeira coisa que devemos verificar é se o método utilizado, é um post. Pois, estaremos criando alguma coisa no banco, e como
  // foi explicitado na documentação do stripe, o método a ser utilizadado é um post.

  if (req.method === "POST") {
    const session = await getSession({ req });
    // O método getSession pega os dados das sessão do usuário logado, que está armazedado dentro dos cookies, que por sua vez,
    // estão dentro da req (requisição).

    //Primeiramente vamos identificar o usuário dentro do banco Faunadb
    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index("user_by_email"), q.Casefold(session.user.email)))
    );

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      //Criar o usuário dentro do banco do STRIPE, para reconhecimento do pagamento dentro da plataforma do stripe.
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        // metadata
      });

      await fauna.query(
        q.Update(q.Ref(q.Collection("users"), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        })
      );
      
      customerId = stripeCustomer.id;
    }

    //Para não criar um novo usuário que já subscreveu no banco do stripe cada vez que esse clicar em subscrição,
    // Vamos salvar o id dele no stripe dentro do fauna, e fazer essa verificação

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      // Necessário passar os dados do usuário dentro do banco do STRIPE, como criado acima.
      customer: customerId,
      // Definir a forma de pagamento
      payment_method_types: ["card"],
      // Definir se será necessário ou não o endereço de cobrança
      billing_address_collection: "required",
      // Definir os itens que serão 'vendidos', no caso, somente um item, de quantidade unica (subscrição)
      line_items: [{ price: "price_1IcEwdHpdfK0unIquLg4SwAu", quantity: 1 }],
      // Definir o modo de cobraça, unica ou recorrente. No caso, "subscription", ou seja, recorrente => mensal.
      mode: "subscription",
      // Definir se irá permitir o uso de cupons para desconto
      allow_promotion_codes: true,
      // Definir a url na qual o usuário será redirecionado quando a subscrição for um sucesso
      success_url: process.env.STRIPE_SUCCESS_URL,
      // Definir a url na qual o usuário será redirecionado quando a subscrição for um fracasso
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });
    // retorno da função, sendo 200 de sucesso, e passando o sessionId, do stripe, como token de auth.
    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    // Se der errado, ou seja, se a requisição não for um Post como esperado, defininr um erro 405, e a menssagem a ser exibida.
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};

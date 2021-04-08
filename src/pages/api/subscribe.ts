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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // primeira coisa que devemos verificar é se o método utilizado, é um post. Pois, estaremos criando alguma coisa no banco, e como
  // foi explicitado na documentação do stripe, o método a ser utilizadado é um post.

  if (req.method === "POST") {
    const session = await getSession({ req });

    const stripeCustomer= await stripe.customers.create({
      email: session.user.email,
      // metadata
    })

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [{ price: "price_1IcEwdHpdfK0unIquLg4SwAu", quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return res.status(200).json({sessionId: stripeCheckoutSession.id})
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};

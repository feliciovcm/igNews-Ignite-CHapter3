import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

// // CÓDIGO PRONTO ACHADO NA INTERNT PARA CONVERTER UMA REQ (READABLE POR PADRÃO) EM UM OBJETO QUE NOS PERMITA USAR SUAS INFORMAÇÕES.
async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

// // Como iremos consumir as informações da req como Stream. Temos que desabilitar o body parser do next. Como detalhado na documentação do next!

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvent = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const secret = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_LISTEN_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    const { type } = event;

    if (relevantEvent.has(type)) {
      try {
        switch (type) {
          case "customer.subscription.updated":
          case "customer.subscription.deleted":

            const subscription = event.data.object as Stripe.Subscription;

            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false,
            );
              // Na ,inha acima, o valor do terceiro parâmetro será true somente para o caso explicitado. Pois irá retornar true.
            break;
          case "checkout.session.completed":
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;

            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            );

            break;

          default:
            throw new Error("Unhandled event.");
        }
      } catch (error) {
        return res.json({ error: "Webhook handler failed" });
      }
    }

    res.json({ received: true });
  } else {
    // Se der errado, ou seja, se a requisição não for um Post como esperado, defininr um erro 405, e a menssagem a ser exibida.
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};

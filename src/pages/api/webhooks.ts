import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";

// CÓDIGO PRONTO ACHADO NA INTERNT PARA CONVERTER UMA REQ (READABLE POR PADRÃO) EM UM OBJETO QUE NOS PERMITA USAR SUAS INFORMAÇÕES.
async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

// Como iremos consumir as informações da req como Stream. Temos que desabilitar o body parser do next. Como detalhado na documentação do next!

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvent = new Set(["checkout.session.completed"]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const secret = req.headers["stripes-signatures"];

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
      console.log("Evento recebido", event);
    }

    res.status(200).json({ ok: true });
  } else {
    // Se der errado, ou seja, se a requisição não for um Post como esperado, defininr um erro 405, e a menssagem a ser exibida.
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};

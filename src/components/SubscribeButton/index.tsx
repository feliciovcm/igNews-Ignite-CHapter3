import { signIn, useSession } from "next-auth/client";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    try {
      // rota subscribe, pois há um file subscribe.ts dentro da pasta api, em pages.
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;
      // A CONSTANTE STRIPE A BAIXO É DIFERENTE DA CONSTRANTE STRIPE CRIADA EM STRIPE.TS, ESSA É UMA CONST PARA SER USADA NO FRONTEND
      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <button
      onClick={handleSubscribe}
      type="button"
      className={styles.subscribeButton}
    >
      Subscribe now
    </button>
  );
}

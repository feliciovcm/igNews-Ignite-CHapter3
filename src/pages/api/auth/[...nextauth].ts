import { query as q } from "faunadb";

import NextAuth from "next-auth";
import Providers from "next-auth/providers";

import { fauna } from "../../../services/fauna";

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: "read:user",
    }),
  ],
  callbacks: {
    async session (session) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                q.Get(
                  q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                'active'
              )
            ])
          )
        )
        return {
          ...session,
          activeSubscription: userActiveSubscription
        }
      } catch {
        return {
          ...session,
          activeSubscription: null,
        }
      }
      
    },
    async signIn(user, account, profile) {
      const { email } = user;
      try {
        await fauna.query(
          // garantir que não crie um novo dado no banco, se o usuário já existe
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index("user_by_email"), q.Casefold(user.email))
              )
            ),
            q.Create(q.Collection("users"), { data: { email } }),
            q.Get(q.Match(q.Index("user_by_email"), q.Casefold(user.email)))
          )
        );

        return true;
      } catch {
        return false;
      }
    },
  },
});

// executar função fauna.query => passar como parametro q.Create apra inserir informação no banco,
// passar como prop de q.create, a collection na qual será inserida a informação. Sendo essa passada na forma de
// q.collection('nome_da_collection'),{nome_do_campo: {nome_do_termo}}. Como no site do fauna foi colocado data.email
// ficaria q.collection('users'), {data: {email}}

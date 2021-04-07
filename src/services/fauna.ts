import { Client } from "faunadb";

export const fauna = new Client({
  secret: process.env.FAUNADB_KEY
});

// As chamadas a API que utilizam dessas chaves secretas, process.env. Todas devem
// ser realizadas pelo lado do servidor, e não pelo lado do cliente (Browser).
// Nesses casos, para se manter em segredo, no caso do next, essas chamadas ao banco, no
// devem ser realziadas, ou dentro da pasta api, que serve como um servidor para o next, ou
// dentro das funções getStaticProps, ou, getServerSideProps. Que são funções executadas dentro
// do servidor node que faz parte do next.
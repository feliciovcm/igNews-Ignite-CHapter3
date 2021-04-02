import Document, { Html, Head, Main, NextScript } from "next/document";

//Esse file deve ser feito como um Class component,
//pois o next não tem um suporte bom para ele, caso seja um functional component.

// O return do componente, é como se fosse uma tag HTML:5, porém
// é necessário importar a tag Html do next, e Head. Não é necessário deixas os
// metas e o doctype, tradicionais do boilerplate do html.

//A div que possuia a id="root", será substituida pelo componente Main, do next.
// Além disso, é necessário ter uma tag NextScript, para o react renderizar os
// componentes em javascript.

// Todas as importações de fontes, etc, que eram feitas dentro do html, serão feitas aqui.

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

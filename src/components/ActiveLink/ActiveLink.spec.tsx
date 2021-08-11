import { render, screen } from "@testing-library/react";
import React from "react";
import { ActiveLink } from ".";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});
// Toda vez que houver uma importação do useRouter dentro do activeLink, ele irá
// retornar a função useRouter, e de dentro dessa função eu irei retornar o asPath
// que é utilizado dentro da função.

describe("ActiveLink component", () => {
  it("renders correctly", () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();

    //Após ele fazer a renderização do componente, ele irá buscar pelo texto Home e
    // Verificar se ele está sendo exibido em tela.
  });

  // Nesse caso, é necessário mockar o useRouter, pq? Pois o useRouter possui sua
  // funcionalidade externa ao componente, é uma função do react, e não uma função declarada,
  // dentro do componente, logo precisamos mockar esses dados usando a propria biblioteca
  // do jest.

  it("Adds active class if link is active", () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    /**
     * Se verificar dentro do componete ActiveLink iremos ver que se o asPath, for igual
     * ao href do activeLink, o link estará ativo e ele deverá receber a activeClass,
     * iremos verificar se isso de fato ocorre aqui.
     */
    expect(screen.getByText("Home")).toHaveClass("active");
  });
});

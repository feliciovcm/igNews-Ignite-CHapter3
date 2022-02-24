import { render, screen } from "@testing-library/react";
import React from "react";
import { Header } from ".";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

jest.mock("next-auth/client", () => {
  return {
    useSession() {
      return [null, false];
    },
  };
});

//Mockando esses dados, pois, no componente Header, existe um componente signInButton
// que utiliza a função useSession que vem de dentro do next-auth/client

describe("Header component", () => {
  it("renders correctly", () => {
    render(<Header />);

    screen.logTestingPlaygroundURL()

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Posts")).toBeInTheDocument();
  });
});

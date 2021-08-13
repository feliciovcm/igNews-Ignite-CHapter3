import { render, screen } from "@testing-library/react";
import { SignInButton } from ".";
import { mocked } from "ts-jest/utils";
import { useSession } from "next-auth/client";

jest.mock("next-auth/client");

//Mockando esses dados, pois, no componente Header, existe um componente signInButton
// que utiliza a função useSession que vem de dentro do next-auth/client

describe("Header component", () => {
  it("renders correctly when user is not autheticated", () => {
    const useSessionMocked = mocked(useSession);
    // Como temos funcionalidades diferentes para usuario logado e deslogado, não podemos
    // mockar o retorno do useSession, de maneira estática para ambos os testes. Para isso
    // utilizaremos a lib ts-jest que possibilita adicionar retornos diferentes para essas
    // funções provenientes de libs externas à aplicação.

    useSessionMocked.mockReturnValueOnce([null, false]);

    // Nesse caso, mockamos o useSession utilizando o mocked, e utilizamos o metodo
    // mockReturnValueOnce que retorna o que é passado dentro do parenteses, na proxima
    // vez no qual o useSession for utilizado. Utilizando o mockReturnValue, ele irá mockar
    // o valor para todas as proximas vezes que o useSession aparecer.

    render(<SignInButton />);

    expect(screen.getByText("Sign In with GitHub")).toBeInTheDocument();
  });

  it("renders correctly when user is autheticated", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([
      {
        user: { name: "John Doe", email: "johndoe@example.com" }, expires: "fake-expires"
      },
      false,
    ]);

    render(<SignInButton />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});

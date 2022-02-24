import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Async } from ".";

test("it renders correctly", async () => {
  render(<Async />);

  expect(screen.getByText("Hello World")).toBeInTheDocument();
  // expect(
  //   await screen.findByText("Button", {}, { timeout: 4000 })    // metodo find fica monitorando por um tempo e se não encontrar, ele da erro
  // ).toBeInTheDocument();  1 maneira de se fazer quando há um resultado async

  // await waitFor(
  //   () => {
  //     return expect(screen.getByText("Button")).toBeInTheDocument();  // metodo get é de forma sincrona e se não encontrar, erro
  //   },
  //   { timeout: 4000 }  2 maneira de se fazer quando há um resultado async
  // );

  // Começando o button como true e removendo ele da tela

  // await waitForElementToBeRemoved(screen.queryByText("Button"), {
  //   timeout: 4000,
  // });

  await waitFor(
    () => {
      return expect(screen.queryByText("Button")).not.toBeInTheDocument(); // metodo query tbm é sincrono, porem não da erro se não encotnrar
    },
    { timeout: 4000 }
  );
});

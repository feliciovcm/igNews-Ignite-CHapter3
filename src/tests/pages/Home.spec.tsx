import { render, screen } from "@testing-library/react";
import React from "react";
import Home, { getStaticProps } from "../../pages";
import { stripe } from "../../services/stripe";
import { mocked } from "ts-jest/utils";

jest.mock("next-auth/client", () => {
  return {
    useSession: () => [null, false],
  };
});
jest.mock("next/router");

jest.mock("../../services/stripe");

describe("Home page", () => {
  it("renders correctly", () => {
    render(<Home product={{ priceId: "fake-priceID", amount: "R$100,00" }} />);

    expect(screen.getByText("for R$100,00 month")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve);

    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: "fake-data-id",
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});
    
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "fake-data-id",
            amount: "$10.00",
          },
        },
      })
    );
  });
});

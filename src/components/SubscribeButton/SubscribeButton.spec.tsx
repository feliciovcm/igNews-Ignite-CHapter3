import { render, screen, fireEvent } from "@testing-library/react";
import { SubscribeButton } from ".";
import { mocked } from "ts-jest/utils";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";

jest.mock("next-auth/client");

jest.mock("next/router");

describe("Subscribe button component", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);
    render(<SubscribeButton />);

    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });

  it("redirects users to sign in when not autheticated", () => {
    const signInMocked = mocked(signIn);
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it("redirects to posts when user already has a subscription", () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);
    const pushMock = jest.fn();
    useRouterMocked.mockReturnValueOnce({ push: pushMock } as any);
    useSessionMocked.mockReturnValueOnce([
      {
        user: { name: "John Doe", email: "johndoe@example.com" },
        expires: "fake-expires",
        activeSubscription: "fake-subscription",
      },
      false,
    ] as any);
    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith('/posts');
  });
});

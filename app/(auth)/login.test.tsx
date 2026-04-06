import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "./login";

jest.mock("expo-router");
jest.mock("@/lib/supabase");
jest.mock("@/lib/auth", () => ({
  signIn: jest.fn(),
}));

describe("LoginScreen", () => {
  it("renders login form", () => {
    const { getByTestId } = render(<LoginScreen />);
    expect(getByTestId("email-input")).toBeTruthy();
    expect(getByTestId("password-input")).toBeTruthy();
    expect(getByTestId("login-button")).toBeTruthy();
  });

  it("calls signIn when form is submitted", async () => {
    const { signIn } = require("@/lib/auth");
    signIn.mockResolvedValueOnce({ user: { id: "1" }, session: {} });

    const { getByTestId } = render(<LoginScreen />);

    fireEvent.changeText(getByTestId("email-input"), "test@example.com");
    fireEvent.changeText(getByTestId("password-input"), "password123");
    fireEvent.press(getByTestId("login-button"));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("shows error when signIn fails", async () => {
    const { signIn } = require("@/lib/auth");
    signIn.mockRejectedValueOnce(new Error("Invalid credentials"));

    const { getByTestId, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByTestId("email-input"), "test@example.com");
    fireEvent.changeText(getByTestId("password-input"), "wrong");
    fireEvent.press(getByTestId("login-button"));

    await waitFor(() => {
      expect(getByText("Invalid credentials")).toBeTruthy();
    });
  });
});

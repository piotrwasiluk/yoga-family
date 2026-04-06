import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import RegisterScreen from "./register";

jest.mock("expo-router");
jest.mock("@/lib/supabase");
jest.mock("@/lib/auth", () => ({
  signUp: jest.fn(),
}));

describe("RegisterScreen", () => {
  it("renders registration form", () => {
    const { getByTestId } = render(<RegisterScreen />);
    expect(getByTestId("name-input")).toBeTruthy();
    expect(getByTestId("email-input")).toBeTruthy();
    expect(getByTestId("password-input")).toBeTruthy();
    expect(getByTestId("register-button")).toBeTruthy();
  });

  it("calls signUp when form is submitted", async () => {
    const { signUp } = require("@/lib/auth");
    signUp.mockResolvedValueOnce({ user: { id: "1" }, session: {} });

    const { getByTestId } = render(<RegisterScreen />);

    fireEvent.changeText(getByTestId("name-input"), "Test User");
    fireEvent.changeText(getByTestId("email-input"), "test@example.com");
    fireEvent.changeText(getByTestId("password-input"), "password123");
    fireEvent.press(getByTestId("register-button"));

    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith("test@example.com", "password123", "Test User");
    });
  });

  it("shows error when signUp fails", async () => {
    const { signUp } = require("@/lib/auth");
    signUp.mockRejectedValueOnce(new Error("Email already exists"));

    const { getByTestId, getByText } = render(<RegisterScreen />);

    fireEvent.changeText(getByTestId("name-input"), "Test");
    fireEvent.changeText(getByTestId("email-input"), "test@example.com");
    fireEvent.changeText(getByTestId("password-input"), "password123");
    fireEvent.press(getByTestId("register-button"));

    await waitFor(() => {
      expect(getByText("Email already exists")).toBeTruthy();
    });
  });
});

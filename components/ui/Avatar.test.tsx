import React from "react";
import { render } from "@testing-library/react-native";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("renders initials when no image url", () => {
    const { getByText } = render(<Avatar name="John Doe" />);
    expect(getByText("JD")).toBeTruthy();
  });

  it("renders single initial for single-word name", () => {
    const { getByText } = render(<Avatar name="John" />);
    expect(getByText("J")).toBeTruthy();
  });
});

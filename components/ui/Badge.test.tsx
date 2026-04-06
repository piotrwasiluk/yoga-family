import React from "react";
import { render } from "@testing-library/react-native";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders label text", () => {
    const { getByText } = render(<Badge label="Great" />);
    expect(getByText("Great")).toBeTruthy();
  });
});

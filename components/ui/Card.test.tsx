import React from "react";
import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import { Card } from "./Card";

describe("Card", () => {
  it("renders children", () => {
    const { getByText } = render(
      <Card>
        <Text>Card content</Text>
      </Card>,
    );
    expect(getByText("Card content")).toBeTruthy();
  });
});

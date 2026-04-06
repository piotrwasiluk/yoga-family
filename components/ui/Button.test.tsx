import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Button } from "./Button";

describe("Button", () => {
  it("renders the label text", () => {
    const { getByText } = render(<Button label="Press me" onPress={jest.fn()} />);
    expect(getByText("Press me")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button label="Press me" onPress={onPress} />);
    fireEvent.press(getByText("Press me"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("disables press when disabled", () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button label="Press me" onPress={onPress} disabled />);
    fireEvent.press(getByText("Press me"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("shows loading indicator when loading", () => {
    const { getByTestId, queryByText } = render(
      <Button label="Press me" onPress={jest.fn()} loading />,
    );
    expect(getByTestId("button-loading")).toBeTruthy();
    expect(queryByText("Press me")).toBeNull();
  });
});

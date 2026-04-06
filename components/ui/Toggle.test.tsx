import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Toggle } from "./Toggle";

jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (component: unknown) => component,
    },
    useAnimatedStyle: () => ({}),
    withTiming: (value: unknown) => value,
  };
});

describe("Toggle", () => {
  it("renders label", () => {
    const { getByText } = render(
      <Toggle value={false} onValueChange={jest.fn()} label="Enable notifications" />,
    );
    expect(getByText("Enable notifications")).toBeTruthy();
  });

  it("calls onValueChange when pressed", () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <Toggle value={false} onValueChange={onValueChange} label="Toggle" />,
    );
    fireEvent.press(getByRole("switch"));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it("calls onValueChange with false when toggled off", () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <Toggle value={true} onValueChange={onValueChange} label="Toggle" />,
    );
    fireEvent.press(getByRole("switch"));
    expect(onValueChange).toHaveBeenCalledWith(false);
  });

  it("has correct accessibility state", () => {
    const { getByRole } = render(
      <Toggle value={true} onValueChange={jest.fn()} label="Toggle" />,
    );
    const toggle = getByRole("switch");
    expect(toggle.props.accessibilityState).toEqual({ checked: true });
  });
});

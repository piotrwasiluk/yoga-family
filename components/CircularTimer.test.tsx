import React from "react";
import { render } from "@testing-library/react-native";
import { CircularTimer } from "./CircularTimer";

jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (component: unknown) => component,
    },
    useAnimatedStyle: () => ({}),
    useDerivedValue: (fn: () => unknown) => ({ value: fn() }),
    withTiming: (value: unknown) => value,
    interpolateColor: (_progress: number, _input: number[], output: string[]) =>
      output[0],
  };
});

describe("CircularTimer", () => {
  it("renders remaining time", () => {
    const { getByText } = render(
      <CircularTimer duration={60} elapsed={0} />,
    );
    expect(getByText("1:00")).toBeTruthy();
  });

  it("renders elapsed time correctly", () => {
    const { getByText } = render(
      <CircularTimer duration={60} elapsed={45} />,
    );
    expect(getByText("0:15")).toBeTruthy();
  });

  it("renders zero when fully elapsed", () => {
    const { getByText } = render(
      <CircularTimer duration={30} elapsed={30} />,
    );
    expect(getByText("0:00")).toBeTruthy();
  });

  it("renders with custom size", () => {
    const { getByText } = render(
      <CircularTimer duration={90} elapsed={0} size={150} />,
    );
    expect(getByText("1:30")).toBeTruthy();
  });
});

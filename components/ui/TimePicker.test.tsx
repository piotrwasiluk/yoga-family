import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TimePicker } from "./TimePicker";

describe("TimePicker", () => {
  it("renders label", () => {
    const { getByText } = render(
      <TimePicker value="20:00" onChange={jest.fn()} label="Reminder Time" />,
    );
    expect(getByText("Reminder Time")).toBeTruthy();
  });

  it("displays time in 12-hour format", () => {
    const { getByText } = render(
      <TimePicker value="20:00" onChange={jest.fn()} label="Time" />,
    );
    expect(getByText("PM")).toBeTruthy();
    expect(getByText("00")).toBeTruthy();
  });

  it("increments hour", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <TimePicker value="20:00" onChange={onChange} label="Time" />,
    );
    fireEvent.press(getByLabelText("Increase hour"));
    expect(onChange).toHaveBeenCalledWith("21:00");
  });

  it("decrements hour", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <TimePicker value="20:00" onChange={onChange} label="Time" />,
    );
    fireEvent.press(getByLabelText("Decrease hour"));
    expect(onChange).toHaveBeenCalledWith("19:00");
  });

  it("increments minutes by 15", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <TimePicker value="20:00" onChange={onChange} label="Time" />,
    );
    fireEvent.press(getByLabelText("Increase minutes"));
    expect(onChange).toHaveBeenCalledWith("20:15");
  });

  it("wraps hour from 23 to 0", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <TimePicker value="23:00" onChange={onChange} label="Time" />,
    );
    fireEvent.press(getByLabelText("Increase hour"));
    expect(onChange).toHaveBeenCalledWith("00:00");
  });

  it("wraps minutes from 45 to 00", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <TimePicker value="20:45" onChange={onChange} label="Time" />,
    );
    fireEvent.press(getByLabelText("Increase minutes"));
    expect(onChange).toHaveBeenCalledWith("20:00");
  });
});

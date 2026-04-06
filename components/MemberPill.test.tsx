import React from "react";
import { render } from "@testing-library/react-native";
import { MemberPill } from "./MemberPill";

jest.mock("expo-image", () => ({
  Image: "Image",
}));

describe("MemberPill", () => {
  it("renders member name", () => {
    const { getByText } = render(
      <MemberPill name="John Doe" checkedIn={false} />,
    );
    expect(getByText("John Doe")).toBeTruthy();
  });

  it("shows check mark when checked in", () => {
    const { getByText } = render(
      <MemberPill name="John Doe" checkedIn={true} />,
    );
    expect(getByText("John Doe")).toBeTruthy();
  });
});

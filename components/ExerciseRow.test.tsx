import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ExerciseRow } from "./ExerciseRow";
import type { Exercise } from "@/lib/types";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        "plan.sidesCount": `${opts?.count ?? 0} sides`,
      };
      return translations[key] ?? key;
    },
  }),
}));

const mockExercise: Exercise = {
  id: "ex-1",
  plan_id: "plan-1",
  name: "Forward Fold",
  duration_seconds: 30,
  sides: 1,
  image_url: null,
  sort_order: 0,
  notes: null,
};

describe("ExerciseRow", () => {
  it("renders exercise name and duration", () => {
    const { getByText } = render(
      <ExerciseRow exercise={mockExercise} index={0} />,
    );
    expect(getByText("Forward Fold")).toBeTruthy();
    expect(getByText("30s")).toBeTruthy();
  });

  it("renders index number", () => {
    const { getByText } = render(
      <ExerciseRow exercise={mockExercise} index={2} />,
    );
    expect(getByText("3")).toBeTruthy();
  });

  it("formats minutes correctly", () => {
    const exercise = { ...mockExercise, duration_seconds: 90 };
    const { getByText } = render(
      <ExerciseRow exercise={exercise} index={0} />,
    );
    expect(getByText("1m 30s")).toBeTruthy();
  });

  it("shows sides count when sides > 1", () => {
    const exercise = { ...mockExercise, sides: 2 };
    const { getByText } = render(
      <ExerciseRow exercise={exercise} index={0} />,
    );
    expect(getByText("2 sides")).toBeTruthy();
  });

  it("does not show sides when sides is 1", () => {
    const { queryByText } = render(
      <ExerciseRow exercise={mockExercise} index={0} />,
    );
    expect(queryByText(/sides/)).toBeNull();
  });

  it("shows notes when present", () => {
    const exercise = { ...mockExercise, notes: "Breathe deeply" };
    const { getByText } = render(
      <ExerciseRow exercise={exercise} index={0} />,
    );
    expect(getByText("Breathe deeply")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ExerciseRow exercise={mockExercise} index={0} onPress={onPress} />,
    );
    fireEvent.press(getByText("Forward Fold"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

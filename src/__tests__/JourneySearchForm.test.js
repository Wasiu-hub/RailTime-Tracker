import React from "react";
import { render, screen } from "@testing-library/react";
import JourneySearchForm from "../components/JourneySearchForm";

test("renders search form correctly", () => {
  render(<JourneySearchForm fields={{}} setFields={() => {}} />);

  const buttonText = screen.getByText(/search/i);
  expect(buttonText).toBeInTheDocument();
});

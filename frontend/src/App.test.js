import { render, screen } from "@testing-library/react";
import App from "./App";

test("shows placeholder before any upload", () => {
  render(<App />);
  expect(
    screen.getByText(/Les résumés apparaîtront ici après traitement/i)
  ).toBeInTheDocument();
});

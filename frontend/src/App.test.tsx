import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("App", () => {
  it("renders the CRM heading", () => {
    render(<App />);

    expect(screen.getByText(/Lightweight CRM \/ Sales Pipeline Platform/i)).toBeTruthy();
  });
});

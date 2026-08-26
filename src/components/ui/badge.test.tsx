import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders its children", () => {
    render(<Badge>فعّال</Badge>);
    expect(screen.getByText("فعّال")).toBeInTheDocument();
  });
});

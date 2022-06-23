import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Currency from "../src/components/Currency";

const mockPairData = {
  pairName: "XXBTZUSD",
  h: ["50000.00", "51000.00"] as [string, string],
};

describe("Currency", () => {
  it("renders pair name", () => {
    render(<Currency pairData={mockPairData} />);
    expect(screen.getByDisplayValue("XXBTZUSD")).toBeInTheDocument();
  });

  it("displays the highest value", () => {
    render(<Currency pairData={mockPairData} />);
    const highInput = screen.getByLabelText("High value");
    expect(highInput).toHaveValue("51000");
  });

  it("calculates total price based on quantity", () => {
    render(<Currency pairData={mockPairData} />);
    const quantityInput = screen.getByLabelText("Quantity");

    fireEvent.change(quantityInput, { target: { value: "3" } });

    expect(screen.getByDisplayValue("153000")).toBeInTheDocument();
  });

  it("defaults quantity to 1", () => {
    render(<Currency pairData={mockPairData} />);
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
  });
});

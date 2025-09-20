import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PropertyCard } from "../components/PropertyCard";
import type { InternalProperty } from "../types";

const base: InternalProperty = {
  fullAddress: "10 Example St, Carlton VIC 3053",
  lotPlan: { lot: "12", plan: "PS123456" },
  volumeFolio: { volume: null, folio: null },
  status: "UnknownVolFol",
  sourceTrace: { provider: "VIC-DDP", requestId: "REQ-12345" },
};

it("opens and closes modal", async () => {
  const user = userEvent.setup();
  render(<PropertyCard initial={base} />);

  await user.click(screen.getByRole("button", { name: /edit volume\/folio/i }));
  const dialog = screen.getByRole("dialog", { name: /edit volume\/folio/i });
  expect(dialog).toBeInTheDocument();

  // Click footer Close (not the ✕ icon)
  await user.click(within(dialog).getByText("Close"));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("shows validation errors for bad inputs", async () => {
  const user = userEvent.setup();
  render(<PropertyCard initial={base} />);

  await user.click(screen.getByRole("button", { name: /edit volume\/folio/i }));
  const dialog = screen.getByRole("dialog", { name: /edit volume\/folio/i });

  const volInput = within(dialog).getByLabelText(/volume/i);
  const folInput = within(dialog).getByLabelText(/folio/i);

  await user.clear(volInput);
  await user.type(volInput, "1234567"); // invalid (7 digits)
  await user.clear(folInput);
  await user.type(folInput, "abc");     // invalid (non-digits)

  await user.click(within(dialog).getByRole("button", { name: /confirm/i }));

  expect(within(dialog).getByText(/volume must be 1–6 digits/i)).toBeInTheDocument();
  expect(within(dialog).getByText(/folio must be 1–5 digits/i)).toBeInTheDocument();
});

it("confirm updates the display", async () => {
  const user = userEvent.setup();
  render(<PropertyCard initial={base} />);

  await user.click(screen.getByRole("button", { name: /edit volume\/folio/i }));
  const dialog = screen.getByRole("dialog", { name: /edit volume\/folio/i });

  const volInput = within(dialog).getByLabelText(/volume/i);
  const folInput = within(dialog).getByLabelText(/folio/i);

  await user.clear(volInput);
  await user.type(volInput, "123");
  await user.clear(folInput);
  await user.type(folInput, "45");

  await user.click(within(dialog).getByRole("button", { name: /confirm/i }));

  expect(screen.getByTestId("vf-display").textContent).toContain("123/45");
  expect(screen.getByText(/KnownVolFol/)).toBeInTheDocument();
});

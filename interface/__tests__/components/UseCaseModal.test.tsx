import React from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import UseCaseModal from "../../components/UseCaseModal";
import { Community } from "../../utils/account-requests";

jest.mock("next/router", () => require("next-router-mock"));
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

const existingScorers = [
  {
    name: "Existing 1",
    description: "asdfasdf",
    id: 7,
    created_at: "2023-03-20T20:27:02.425Z",
    use_case: "Airdrop Protection",
  },
  {
    name: "Existing 2",
    description: "a",
    id: 8,
    created_at: "2023-03-20T22:19:22.363Z",
    use_case: "Airdrop Protection",
  },
] as Community[];

describe("UseCaseModal", () => {
  it("should display a list of use cases", async () => {
    render(
      <UseCaseModal
        existingScorers={existingScorers}
        isOpen={true}
        onClose={() => {}}
      />
    );
    const useCaseItems = screen.getAllByTestId("use-case-item");

    expect(screen.getByText("Select a Use Case")).toBeInTheDocument();
    expect(useCaseItems.length).toBe(4);
  });

  it("continue button should only be enabled when a use case is selected", async () => {
    render(
      <UseCaseModal
        existingScorers={existingScorers}
        isOpen={true}
        onClose={() => {}}
      />
    );

    const useCaseItem = screen.getAllByTestId("use-case-item")[0];
    const continueButton = screen.getByText(/Continue/i).closest("button");

    expect(continueButton).toBeDisabled();

    fireEvent.click(useCaseItem as HTMLElement);

    expect(continueButton).toBeEnabled();
  });

  it("should switch to use case details step when continue button is clicked on first step", async () => {
    render(
      <UseCaseModal
        existingScorers={existingScorers}
        isOpen={true}
        onClose={() => {}}
      />
    );

    const useCaseItem = screen.getAllByTestId("use-case-item")[0];
    const continueButton = screen.getByText(/Continue/i).closest("button");

    fireEvent.click(useCaseItem as HTMLElement);

    fireEvent.click(continueButton as HTMLElement);

    expect(screen.getByText("Use Case Details")).toBeInTheDocument();
  });

  it("continue button should only be enabled when a use case name and description is filled", async () => {
    render(
      <UseCaseModal
        existingScorers={existingScorers}
        isOpen={true}
        onClose={() => {}}
      />
    );

    const useCaseItem = screen.getAllByTestId("use-case-item")[0];
    const firstContinueButton = screen.getByText(/Continue/i).closest("button");

    fireEvent.click(useCaseItem as HTMLElement);

    fireEvent.click(firstContinueButton as HTMLElement);

    const nameInput = screen.getByTestId("use-case-name-input");
    const descriptionInput = screen.getByTestId("use-case-description-input");
    const secondContinueButton = screen
      .getByText(/Continue/i)
      .closest("button");

    expect(secondContinueButton).toBeDisabled();

    fireEvent.change(nameInput, { target: { value: "My Use Case" } });
    fireEvent.change(descriptionInput, {
      target: { value: "This is my use case description" },
    });

    expect(secondContinueButton).toBeEnabled();
  });

  it("should show duplication error if scorer has duplicate name", async () => {
    render(
      <UseCaseModal
        existingScorers={existingScorers}
        isOpen={true}
        onClose={() => {}}
      />
    );
    const useCaseItem = screen.getAllByTestId("use-case-item")[0];
    const firstContinueButton = screen.getByText(/Continue/i).closest("button");

    fireEvent.click(useCaseItem as HTMLElement);

    fireEvent.click(firstContinueButton as HTMLElement);

    const nameInput = screen.getByTestId("use-case-name-input");
    const descriptionInput = screen.getByTestId("use-case-description-input");
    const secondContinueButton = screen
      .getByText(/Continue/i)
      .closest("button");

    expect(secondContinueButton).toBeDisabled();

    fireEvent.change(nameInput, { target: { value: "Existing 2" } });
    fireEvent.change(descriptionInput, {
      target: { value: "This is my use case description" },
    });

    expect(secondContinueButton).toBeEnabled();

    if (!secondContinueButton) throw new Error("Button not found");
    fireEvent.click(secondContinueButton);

    await waitFor(() => {
      expect(
        screen.getByText("A scorer with this name already exists")
      ).toBeInTheDocument();
    });
  });
});

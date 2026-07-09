import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { ImportRepositoryDialog } from "../import-repository-dialog"

jest.mock("@/hooks/queries/use-repositories", () => ({
    useAvailableRepositories: jest.fn(),
    useImportRepository: jest.fn(),
    useImportedRepositories: jest.fn()
}))

import {
  useAvailableRepositories,
  useImportedRepositories,
  useImportRepository,
} from "@/hooks/queries/use-repositories"

const mockedUseAvailableRepositories = useAvailableRepositories as jest.Mock
const mockedUseImportedRepositories = useImportedRepositories as jest.Mock
const mockedUseImportRepository = useImportRepository as jest.Mock

describe("Import Repository Dialog Component", () => {
    const mockMutate = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()

        mockedUseAvailableRepositories.mockReturnValue({ data: [], isLoading: false, isError: false })
        mockedUseImportedRepositories.mockReturnValue({ data: [], isLoading: false, isError: false })
        mockedUseImportRepository.mockReturnValue({ mutate: mockMutate, isLoading: false, isError: false })
    })

    it("should open the dialog when clicking the trigger button", async () => {
        const user = userEvent.setup()
        render(<ImportRepositoryDialog />)

        const importRepositoryButton = screen.getByRole("button", { name: /import repository/i })

        expect(importRepositoryButton).toBeInTheDocument()

        await user.click(importRepositoryButton)

        expect(screen.getByText(/import a repository/i)).toBeInTheDocument()
    })

    it("should render the skeleton loaders when available repositories are loading", async () => {
        mockedUseAvailableRepositories.mockReturnValue({ data: undefined, isLoading: true, isError: false })
        
        const user = userEvent.setup()

        render(<ImportRepositoryDialog />)

        const importRepositoryButton = screen.getByRole("button", { name: /import repository/i })

        expect(importRepositoryButton).toBeInTheDocument()

        await user.click(importRepositoryButton)

        const skeletonElement = screen.getByTestId("loading-skeletons")

        expect(screen.queryByRole("list")).not.toBeInTheDocument()
        expect(skeletonElement).toBeInTheDocument()
    })

    it("should display repositories and recognize which ones are already imported", async () => {
        mockedUseImportedRepositories.mockReturnValue({
            data: [{ github_id: 100, name: "repo-already-imported" }]
        })

        mockedUseAvailableRepositories.mockReturnValue({
            data: [
                { id: 100, name: "repo-already-imported", private: false, language: "TypeScript" },
                { id: 200, name: "repo-new", private: true, language: "Go" }
            ],
            isLoading: false,
            isError: false
        })

        const user = userEvent.setup()

        render(<ImportRepositoryDialog />)
        
        const importRepositoryButton = screen.getByRole("button", { name: /import repository/i})

        await user.click(importRepositoryButton)

        expect(screen.getByText("repo-already-imported")).toBeInTheDocument()
        expect(screen.getAllByText(/imported/i).length).toBeGreaterThan(0);

        expect(screen.getByText("repo-new")).toBeInTheDocument()
        const importButton = screen.getByRole("button", { name: /^import$/i })
        expect(importButton).toBeInTheDocument()
    })

    it("should trigger handleImport with proper parameters when clicking import button", async () => {
        const repoToImport = { id: 200, name: "repo-new", private: false, language: "Go" }
        mockedUseAvailableRepositories.mockReturnValue({
            data: [repoToImport],
            isLoading: false,
            isError: false
        })

        const user = userEvent.setup()
        render(<ImportRepositoryDialog />)
        await user.click(screen.getByRole("button", { name: /import repository/i}))

        const importButton = screen.getByRole("button", { name: /^import$/i })
        await user.click(importButton)

        expect(mockMutate).toHaveBeenCalledWith(
            { github_id: 200, full_name: "repo-new" },
            expect.any(Object)
        )
    })
})
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { UserMenu } from "../user-menu"
import { useCurrentUser, useLogout } from "@/hooks/queries/use-auth"

jest.mock("@/hooks/queries/use-auth", () => ({ 
    useCurrentUser: jest.fn(), 
    useLogout: jest.fn(), 
}));

const mockedUseCurrentUser = useCurrentUser as jest.Mock
const mockedUseLogout = useLogout as jest.Mock

describe("User Menu Component", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should render initials when user does not have an avatar", async () => {
        mockedUseCurrentUser.mockReturnValue({
            data: { username: "Alex", avatar_url: null }
        })
        mockedUseLogout.mockReturnValue({ isPending: false, mutate: jest.fn() })

        render(<UserMenu />)
        
        expect(screen.getByText("AL")).toBeInTheDocument()
    })

    it("should trigger logout mutation when clicking the logout button", async () => {
        const mockMutate = jest.fn()
        mockedUseCurrentUser.mockReturnValue({
            data: { username: "Alex", avatar_url: null }
        })
        mockedUseLogout.mockReturnValue({ isPending: false, mutate: mockMutate })

        const user = userEvent.setup()
        render(<UserMenu />)

        await user.click(screen.getByRole("button", { name: /account menu/i }))

        const logoutButton = await screen.findByRole("menuitem", { name: /log out/i })
        await user.click(logoutButton)

        expect(mockMutate).toHaveBeenCalledTimes(1)
    })
})
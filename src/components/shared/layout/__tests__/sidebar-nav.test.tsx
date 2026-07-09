import { render, screen } from "@testing-library/react";
import { SidebarNav } from "../sidebar-nav";

jest.mock("next/navigation", () => ({
    usePathname: jest.fn()
}))

import { usePathname } from "next/navigation";
const mockedUsePathname = usePathname as jest.Mock

describe("Sidebar-nav Component", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should apply active class when pathname is /dashboard", () => {
        mockedUsePathname.mockReturnValue('/dashboard')

        render(<SidebarNav />)

        const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
        const repositoriesLink = screen.getByRole('link', { name: /repositories/i })

        expect(dashboardLink).toHaveClass('active')
        expect(repositoriesLink).not.toHaveClass('active')
    })

    it("should render links with the correct destinations", () => {
        mockedUsePathname.mockReturnValue("/dashboard")

        render(<SidebarNav />)

        const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
        const repositoriesLink = screen.getByRole('link', { name: /repositories/i })

        expect(dashboardLink).toHaveAttribute("href", "/dashboard")
        expect(repositoriesLink).toHaveAttribute("href", "/repositories")
    })
})
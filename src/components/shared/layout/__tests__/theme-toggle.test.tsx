import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import { ThemeToggle } from "../theme-toggle"
import { useTheme } from "next-themes"

jest.mock("next-themes", () => ({
    useTheme: jest.fn()
}))

const mockedUseTheme = useTheme as jest.Mock

describe("ThemeToggle Component", () => {
    const setTheme = jest.fn()

    beforeEach(() => {
        setTheme.mockClear()
    })
    
    it("should render the sun icon when theme is light", () => {
        mockedUseTheme.mockReturnValue({ resolvedTheme: "light", setTheme })

        render(<ThemeToggle />)

        const buttons = screen.getByRole("button")
        expect(buttons.querySelector("svg")).toHaveClass("lucide-sun")
    })

    it("should render the moon icon when theme is dark", () => {
        mockedUseTheme.mockReturnValue({ resolvedTheme: "dark", setTheme })

        render(<ThemeToggle />)

        const button = screen.getByRole("button")
        expect(button.querySelector("svg")).toHaveClass("lucide-moon")
    })

    it("should call setTheme with the opposite theme on click", () => {
        mockedUseTheme.mockReturnValue({ resolvedTheme: "light", setTheme })

        render(<ThemeToggle />)

        fireEvent.click(screen.getByRole("button"))

        expect(setTheme).toHaveBeenCalledWith("dark")
    })
})
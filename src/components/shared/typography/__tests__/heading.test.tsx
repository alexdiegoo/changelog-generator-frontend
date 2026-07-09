import { render, screen } from "@testing-library/react" 
import { Heading } from "../heading"

describe("Heading Component", () => {
    it("should render the tag passed via props", () => {
        render(<Heading as="h2">Testing</Heading>)

        const heading = screen.getByRole("heading", {
            level: 2
        })

        expect(heading).toBeInTheDocument()
    })

    it("should render the H1 by default", () => {
        render(<Heading>Testing</Heading>)

        const heading = screen.getByRole("heading", {
            level: 1
        })

        expect(heading).toBeInTheDocument()
    })
})
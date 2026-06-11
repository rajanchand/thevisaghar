import React from "react";
import { render, screen } from "@testing-library/react";
import { ServiceCard } from "@/components/ui/ServiceCard";

// Mock framer-motion to prevent issues with Jest/JSDOM and filter out custom props
jest.mock("framer-motion", () => {
  const MotionDiv = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>>(
    function MotionDiv({ children, ...props }, ref) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { whileHover, whileTap, whileInView, viewport, initial, animate, exit, transition, variants, ...domProps } = props;
      return (
        <div ref={ref} {...domProps}>
          {children}
        </div>
      );
    }
  );
  return {
    motion: { div: MotionDiv },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe("ServiceCard Component", () => {
  const mockProps = {
    title: "UK Student Visa",
    description: "Study at top UK universities with expert visa guidance.",
    icon: "graduation-cap",
    slug: "uk-student-visa",
  };

  it("should render the title and description correctly", () => {
    render(<ServiceCard {...mockProps} />);

    expect(screen.getByText("UK Student Visa")).toBeInTheDocument();
    expect(screen.getByText("Study at top UK universities with expert visa guidance.")).toBeInTheDocument();
  });

  it("should output the correct link href based on the slug", () => {
    render(<ServiceCard {...mockProps} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/services/uk-student-visa");
  });
});

import { contactSchema, bookingSchema, loginSchema } from "@/lib/validations";

describe("Validations Unit Tests", () => {
  describe("contactSchema", () => {
    it("should pass with valid data", () => {
      const validData = {
        name: "Ram Bahadur",
        email: "ram@example.com",
        phone: "+9779841234567",
        visaType: "UK Student Visa",
        message: "I would like to inquire about the intake dates and requirements for UK student visa.",
      };
      const result = contactSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail with invalid email", () => {
      const invalidData = {
        name: "Ram Bahadur",
        email: "not-an-email",
        visaType: "UK Student Visa",
        message: "I would like to inquire about requirements.",
      };
      const result = contactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Please enter a valid email address");
      }
    });

    it("should fail with short name", () => {
      const invalidData = {
        name: "R",
        email: "ram@example.com",
        visaType: "UK Student Visa",
        message: "I would like to inquire about requirements.",
      };
      const result = contactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Name must be at least 2 characters");
      }
    });

    it("should fail with short message", () => {
      const invalidData = {
        name: "Ram Bahadur",
        email: "ram@example.com",
        visaType: "UK Student Visa",
        message: "Short",
      };
      const result = contactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Message must be at least 10 characters");
      }
    });
  });

  describe("bookingSchema", () => {
    it("should pass with valid data", () => {
      const validData = {
        name: "Sita Kumari",
        email: "sita@example.com",
        phone: "9841123456",
        visaType: "UK Skilled Worker Visa",
        preferredDate: "2026-07-15",
        message: "Requesting a slot in the afternoon.",
      };
      const result = bookingSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail with short phone number", () => {
      const invalidData = {
        name: "Sita Kumari",
        email: "sita@example.com",
        phone: "123",
        visaType: "UK Skilled Worker Visa",
        preferredDate: "2026-07-15",
      };
      const result = bookingSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Please enter a valid phone number");
      }
    });
  });

  describe("loginSchema", () => {
    it("should pass with valid credentials", () => {
      const validData = {
        email: "admin@thevisaghar.com",
        password: "securePassword123",
      };
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail with short password", () => {
      const invalidData = {
        email: "admin@thevisaghar.com",
        password: "123",
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Password must be at least 6 characters");
      }
    });
  });
});

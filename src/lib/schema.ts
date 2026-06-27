import { z } from "zod";
import { SESSIONS, INTERESTS } from "./seminar";

const sessionIds = SESSIONS.map((s) => s.id) as [string, ...string[]];

// Accepts (816) 555-1234, 816-555-1234, 8165551234, +1 816 555 1234, etc.
const phoneRegex = /^\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

// Letters (incl. accents), spaces, hyphens, apostrophes, periods.
const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ'.\- ]+$/;

export const registrationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100, "Name is too long.")
    .regex(nameRegex, "Please use letters, spaces, hyphens, or apostrophes only."),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid US phone number."),
  email: z.email("Please enter a valid email address.").max(254, "Email is too long."),
  guests: z.coerce
    .number({ error: "Please choose a number." })
    .int("Please enter a whole number.")
    .min(0, "Cannot be negative.")
    .max(10, "Please call us for groups larger than 10."),
  session: z.enum(sessionIds, { error: "Please choose a session." }),
  interests: z.array(z.enum(INTERESTS)).optional().default([]),
  comments: z
    .string()
    .trim()
    .max(500, "Please keep comments under 500 characters.")
    .optional()
    .default(""),
  consent: z.literal(true, { error: "Please agree to be contacted to register." }),
  // Honeypot — bots fill it, humans don't. Named/labelled so browsers won't
  // autofill it. NOT validated on the client (an autofilled, validated honeypot
  // was silently blocking real users); the server checks it instead.
  botField: z.string().optional().default(""),
});

export type RegistrationInput = z.input<typeof registrationSchema>;
export type RegistrationData = z.output<typeof registrationSchema>;

// Normalize a phone to +1XXXXXXXXXX where possible (PRD §6.1).
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return raw.trim();
}

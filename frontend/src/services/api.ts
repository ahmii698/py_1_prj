export type Role = "student" | "teacher" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher";
}

/* ---------------------------------------------------------
   Backend ready hone par USE_MOCK ko false kar dena
--------------------------------------------------------- */
const USE_MOCK = true;
const BASE_URL = "http://localhost:8000/api";

/* ---------------- Real API ---------------- */

async function request<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.detail || data.message || "Something went wrong");
  }
  return data as T;
}

/* ---------------- Mock API (sirf testing ke liye) ---------------- */

interface MockUser extends User {
  password: string;
}

type OtpMap = Record<string, { otp: string; expires: number }>;

const USERS_KEY = "mock_users_v2";
const OTP_KEY = "mock_otps";
const OTP_LIFETIME_MS = 5 * 60 * 1000;

const wait = (ms = 500) => new Promise((r) => setTimeout(r, ms));
const clean = (email: string) => email.trim().toLowerCase();

function getUsers(): MockUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) return JSON.parse(raw) as MockUser[];

  // Ye accounts pehle se maujood rahenge (testing ke liye)
  const seed: MockUser[] = [
    { id: 1, name: "Admin", email: "xahmedmalik30600@gmail.com", password: "password", role: "admin" },
    { id: 2, name: "Student", email: "student@gmail.com", password: "password", role: "student" },
    { id: 3, name: "Teacher", email: "teacher@gmail.com", password: "password", role: "teacher" },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(seed));
  return seed;
}

function saveUsers(users: MockUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getOtps(): OtpMap {
  const raw = localStorage.getItem(OTP_KEY);
  return raw ? (JSON.parse(raw) as OtpMap) : {};
}

function saveOtps(map: OtpMap) {
  localStorage.setItem(OTP_KEY, JSON.stringify(map));
}

function checkOtp(email: string, otp: string) {
  const entry = getOtps()[email];
  if (!entry) throw new Error("Please request an OTP first");
  if (Date.now() > entry.expires) throw new Error("OTP has expired, please request a new one");
  if (entry.otp !== otp) throw new Error("Invalid OTP");
}

const mock = {
  async register(data: RegisterData): Promise<{ message: string }> {
    await wait();
    const users = getUsers();
    const email = clean(data.email);

    if (users.some((u) => u.email === email)) {
      throw new Error("This email is already registered");
    }
    if (data.role !== "student" && data.role !== "teacher") {
      throw new Error("Invalid role");
    }

    users.push({
      id: Date.now(),
      name: data.name.trim(),
      email,
      password: data.password,
      role: data.role,
    });
    saveUsers(users);
    return { message: "Account created successfully" };
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    await wait();
    const found = getUsers().find(
      (u) => u.email === clean(email) && u.password === password
    );
    if (!found) throw new Error("Invalid email or password");

    return {
      token: `mock-token-${found.id}`,
      user: { id: found.id, name: found.name, email: found.email, role: found.role },
    };
  },

  async sendOtp(email: string): Promise<{ message: string }> {
    await wait();
    const e = clean(email);
    if (!getUsers().some((u) => u.email === e)) {
      throw new Error("Email not found");
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const map = getOtps();
    map[e] = { otp, expires: Date.now() + OTP_LIFETIME_MS };
    saveOtps(map);

    // Asli backend mein ye OTP email par jayega, yahan console mein dikhta hai
    console.log(`%c[MOCK OTP] ${e} -> ${otp}`, "color:#6d4aff;font-weight:bold");
    return { message: "OTP sent to your email" };
  },

  async verifyOtp(email: string, otp: string): Promise<{ message: string }> {
    await wait();
    checkOtp(clean(email), otp.trim());
    return { message: "OTP verified" };
  },

  async resetPassword(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<{ message: string }> {
    await wait();
    const e = clean(email);
    checkOtp(e, otp.trim());

    const users = getUsers();
    const idx = users.findIndex((u) => u.email === e);
    if (idx === -1) throw new Error("Email not found");

    users[idx].password = newPassword;
    saveUsers(users);

    const map = getOtps();
    delete map[e];
    saveOtps(map);

    return { message: "Password reset successfully" };
  },
};

/* ---------------- Public functions ---------------- */

export const registerUser = (data: RegisterData) =>
  USE_MOCK ? mock.register(data) : request<{ message: string }>("/auth/register", data);

export const loginUser = (email: string, password: string) =>
  USE_MOCK
    ? mock.login(email, password)
    : request<AuthResponse>("/auth/login", { email, password });

export const sendOtp = (email: string) =>
  USE_MOCK
    ? mock.sendOtp(email)
    : request<{ message: string }>("/auth/forgot-password", { email });

export const verifyOtp = (email: string, otp: string) =>
  USE_MOCK
    ? mock.verifyOtp(email, otp)
    : request<{ message: string }>("/auth/verify-otp", { email, otp });

export const resetPassword = (email: string, otp: string, newPassword: string) =>
  USE_MOCK
    ? mock.resetPassword(email, otp, newPassword)
    : request<{ message: string }>("/auth/reset-password", {
        email,
        otp,
        new_password: newPassword,
      });
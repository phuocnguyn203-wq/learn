import { Key } from "node:readline";

interface AppConfig {
  apiUrl: string;
  timeoutMs: number;
  features: { darkMode: boolean };
}

interface SignupForm {
  email: string;
  age: number;
  acceptTerms: boolean;
}

interface RequiredObject {
  id: number;
}

function sortById<T extends RequiredObject>(items: T[]) {
  const sortedArr = [...items].sort((a, b) => a.id - b.id);
  return sortedArr;
}

function getSetting<Key extends keyof AppConfig>(config: AppConfig, key: Key) {
  return config[key];
}

function updateField<Key extends keyof SignupForm>(form: SignupForm, key: Key, value: SignupForm[Key]) {
  const newObj = { ...form };
  newObj[key] = value;
  return newObj;
}

const config: AppConfig = {
  apiUrl: "https://api.example.com",
  timeoutMs: 5000,
  features: { darkMode: true },
};

const form: SignupForm = { email: "", age: 0, acceptTerms: false };

const sorted = sortById([{ id: 2, name: "B" }, { id: 1, name: "A" }]);
const nm: string = sorted[0].name; // phải OK
// @ts-expect-error
sortById([{ name: "A" }]);

const url: string = getSetting(config, "apiUrl");
const timeout: number = getSetting(config, "timeoutMs");
// @ts-expect-error
getSetting(config, "retries");

updateField(form, "age", 21);      // OK
// @ts-expect-error
updateField(form, "age", "21");
// @ts-expect-error
updateField(form, "phone", "090");



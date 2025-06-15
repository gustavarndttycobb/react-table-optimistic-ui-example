# Optimistic UI Table Example

This project demonstrates the use of **Optimistic UI** in a React + TypeScript application with **Material UI**, focusing on how to handle temporary data before it is persisted in the backend. It also showcases how to generate **temporary unique IDs using generator functions**, contrasting this approach with the use of global variables.

## 🚀 Project Purpose

The goal of this repository is to serve as a practical example of:

* ✅ Optimistic UI for creating and deleting items in a table.
* ✅ Temporary ID generation before persistence.
* ✅ Function generators as a clean and isolated strategy for ID generation.
* ✅ The risks of using global mutable state.

While normally IDs should not be displayed directly in a UI, this example shows them **explicitly for educational purposes**, to clarify the transition from temporary IDs to real, persisted IDs.

## 📦 Stack & Dependencies

* [React](https://reactjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Material UI](https://mui.com/)
* [Vitest](https://vitest.dev/) – testing
* [React Testing Library](https://testing-library.com/)

To install all dependencies:

```bash
npm install
```

## ▶️ Running the Project

```bash
npm run dev
```

Then access: [http://localhost:5173](http://localhost:5173)

## 🧪 Running the Tests

```bash
npm run test
```

## ✨ Optimistic UI Explained

**Optimistic UI** is a technique where the frontend assumes a request (e.g., a POST to create an item) will succeed, and **immediately reflects that change in the UI**, instead of waiting for the backend response.

This approach enhances perceived speed and interactivity.

In this project:

* A temporary item is added to the table immediately after clicking "Add".
* The temporary item uses a temporary ID.
* When the real response arrives, the item is updated with the real backend ID.
* If the request fails, the item is marked with an error state.

## 🧠 Why Temporary IDs?

When an item is created in the UI before it exists in the database, we still need a **way to uniquely identify it**. For instance:

* To show it in a list with `key={id}`.
* To allow removal or editing before it's persisted.

This is where **temporary IDs** come in.

## ⚙️ Why Use Function Generators?

We use a generator function to produce temporary IDs:

```ts
function* tempIdGenerator(prefix = 'temp') {
  let count = 1;
  while (true) {
    yield `${prefix}-${count++}`;
  }
}
```

Then we instantiate it once:

```ts
export const idGen = tempIdGenerator();
```

### ✅ Advantages:

* Fully isolated and scoped.
* No dependency on global mutable state.
* Predictable and testable.

### ❌ Why not use a global variable?

A global counter like `let id = 0` can lead to bugs:

* Values can be reset accidentally.
* Multiple components using the same counter may clash.
* Tests may interfere with each other.

### ✅ Demonstrated in Tests

See `src/utils/__tests__/idGenerator.test.ts`:

* The test shows how global state can accidentally lead to repeated IDs.
* The generator-based strategy keeps each instance self-contained.

---

## 📂 Project Structure

```
src/
├── components/         # React components (OptimisticTable)
├── models/             # Type definitions (Item)
├── services/           # Fake API to simulate persistence
├── utils/              # Utility logic (id generator)
├── __tests__/          # Unit tests (ID generator comparison)
```

## ✅ Summary

This project is a focused educational example showing:

* Optimistic UI in practice.
* Temporary state management.
* Proper use of generators for ID creation.
* Dangers of shared global state.


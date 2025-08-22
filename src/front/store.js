// /src/front/store.js
export const initialStore = () => {
  return {
    message: null,
    jwt: sessionStorage.getItem("jwt") || null,
    user: null,
    todos: [
      { id: 1, title: "Make the bed", background: null },
      { id: 2, title: "Do my homework", background: null },
    ],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return { ...store, message: action.payload };

    case "add_task":
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };

    // Preferred JWT actions
    case "set_jwt":
      sessionStorage.setItem("jwt", action.payload?.jwt || "");
      return {
        ...store,
        jwt: action.payload?.jwt || null,
        user: action.payload?.user || null,
      };

    case "clear_jwt":
      sessionStorage.removeItem("jwt");
      return { ...store, jwt: null, user: null };

    // Backward-compat if something dispatches old names
    case "set_token":
      sessionStorage.setItem("jwt", action.payload?.token || "");
      return {
        ...store,
        jwt: action.payload?.token || null,
        user: action.payload?.user || null,
      };

    case "clear_token":
      sessionStorage.removeItem("jwt");
      return { ...store, jwt: null, user: null };

    default:
      throw Error("Unknown action.");
  }
}

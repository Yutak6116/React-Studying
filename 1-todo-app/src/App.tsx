import localforage from "localforage";
import { useEffect, useState } from "react";
import { isTodos } from "./lib/isTodos";
import { MdDelete, MdRestore, MdAdd } from "react-icons/md";

type Todo = {
  value: string;
  readonly id: number;
  checked: boolean;
  removed: boolean;
};

type Filter = "all" | "checked" | "unchecked" | "removed";

export const App = () => {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  const filteredTodos = todos.filter((todo) => {
    // filter ステートの値に応じて異なる内容の配列を返す
    switch (filter) {
      case "all":
        // 削除されていないもの
        return !todo.removed;
      case "checked":
        // 完了済 **かつ** 削除されていないもの
        return todo.checked && !todo.removed;
      case "unchecked":
        // 未完了 **かつ** 削除されていないもの
        return !todo.checked && !todo.removed;
      case "removed":
        // 削除済みのもの
        return todo.removed;
      default:
        return todo;
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = () => {
    if (!text) return;

    const newTodo: Todo = {
      value: text,
      id: new Date().getTime(),
      checked: false,
      removed: false,
    };

    setTodos((todos) => [newTodo, ...todos]);
    setText("");
  };

  const handleTodo = <K extends keyof Todo, V extends Todo[K]>(
    id: number,
    key: K,
    value: V
  ) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, [key]: value };
        } else {
          return todo;
        }
      });

      return newTodos;
    });
  };

  const handleFilter = (filter: Filter) => {
    setFilter(filter);
  };

  const handleEmpty = () => {
    // シャローコピーで事足りる
    setTodos((todos) => todos.filter((todo) => !todo.removed));
  };

  useEffect(() => {
    localforage
      .getItem("todo-20200101")
      .then((values) => isTodos(values) && setTodos(values));
  }, []);

  useEffect(() => {
    localforage.setItem("todo-20200101", todos);
  }, [todos]);

  return (
    <div className="container">
      <header className="header">
        <h1>My Todo App</h1>
        <p>Stay organized and productive</p>
      </header>
      <section className="controls">
        <div className="filter-group">
          <label htmlFor="filter-select">フィルター:</label>
          <select
            id="filter-select"
            value={filter}
            onChange={(e) => handleFilter(e.target.value as Filter)}
          >
            <option value="all">すべてのタスク</option>
            <option value="checked">完了したタスク</option>
            <option value="unchecked">現在のタスク</option>
            <option value="removed">ごみ箱</option>
          </select>
          {filter === "removed" && (
            <button
              className="empty-btn"
              onClick={handleEmpty}
              disabled={todos.filter((todo) => todo.removed).length === 0}
            >
              ごみ箱を空にする
            </button>
          )}
        </div>
        {filter !== "checked" && filter !== "removed" && (
          <form
            className="todo-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <input
              type="text"
              placeholder="新しいタスクを入力..."
              value={text}
              onChange={handleChange}
              aria-label="New task"
            />
            <button type="submit" aria-label="タスク追加">
              <MdAdd size={24} />
            </button>
          </form>
        )}
      </section>
      <section className="todo-list" aria-live="polite">
        <ul>
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className={`todo-item ${todo.removed ? "removed" : ""}`}
            >
              <div className="todo-item-main">
                <input
                  type="checkbox"
                  disabled={todo.removed}
                  checked={todo.checked}
                  onChange={() => handleTodo(todo.id, "checked", !todo.checked)}
                  aria-label="Complete task"
                />
                <input
                  type="text"
                  value={todo.value}
                  disabled={todo.checked || todo.removed}
                  onChange={(e) => handleTodo(todo.id, "value", e.target.value)}
                  aria-label="Edit task"
                />
              </div>
              <button
                className="remove-btn"
                onClick={() => handleTodo(todo.id, "removed", !todo.removed)}
                aria-label={todo.removed ? "タスク復元" : "タスク削除"}
              >
                {todo.removed ? (
                  <MdRestore size={20} />
                ) : (
                  <MdDelete size={20} />
                )}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  apiAddTodo,
  deleteTodo,
  getTodos,
  patchTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './Components/Header';
import { TodoList } from './Components/TodoList';
import { Footer } from './Components/Footer';
import { FilterType } from './types/FilterType';
import { ErrorNotification } from './Components/ErrorNotification';
// import { TodoItem } from './Components/TodoItems';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setLoading(true);
    getTodos()
      .then(data => {
        setTodos(data);
        setError(null);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log(err);
        setError('Unable to load todos');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === FilterType.Active) {
      return !todo.completed;
    }

    if (filter === FilterType.Completed) {
      return todo.completed;
    }

    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  const hasCompleted = todos.some(todo => todo.completed);

  const onClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setLoading(true);

    Promise.all(completedTodos.map(todo => deleteTodo(todo.id)))
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
      })
      .catch(() => {
        setError('Unable to delete some todos');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');

      return;
    }

    const temp: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(temp);
    setLoading(true);
    setError(null);

    apiAddTodo({
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setLoading(false);
      });
  };

  const onDelete = (id: Todo['id']) => {
    setLoading(true);
    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toggleTodo = (id: number) => {
    const currentTodo = todos.find(todo => todo.id === id);

    if (!currentTodo) {
      return;
    }

    patchTodo(id, { completed: !currentTodo.completed })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id
              ? { ...todo, completed: updatedTodo.completed }
              : todo,
          ),
        );
      })
      .catch(() => {
        setError('Failed to update todo');
      });
  };

  const onToggleAll = () => {
    setTodos(prevTodos => {
      const allCompleted = prevTodos.every(todo => todo.completed);

      return prevTodos.map(todo => ({
        ...todo,
        completed: !allCompleted,
      }));
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <ErrorNotification
        error={error}
        isVisible={!!error}
        onClose={() => setError(null)}
      />

      <div className="todoapp__content">
        <Header
          todos={todos}
          title={title}
          setTitle={setTitle}
          setError={setError}
          handleSubmit={handleSubmit}
          onToggleAll={onToggleAll}
          loading={loading}
          inputRef={inputRef}
        />
        {todos.length > 0 && (
          <TodoList
            filteredTodos={filteredTodos}
            loading={loading}
            onDelete={onDelete}
            onToggle={toggleTodo}
          />
        )}
        {tempTodo && (
          <div data-cy="Todo" className="todo">
            <label
              className="todo__status-label"
              htmlFor={`todo-${tempTodo.id}`}
            >
              <input
                id={`todo-${tempTodo.id}`}
                type="checkbox"
                className="todo__status"
                checked={tempTodo.completed}
                disabled
              />
            </label>
            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}

        {/* {tempTodo && (
          <TodoItem
            todo={tempTodo}
            onDelete={() => {}}
            onToggle={() => {}}
            // isUpdating={true}
            isTemporary={true}
          />
        )} */}
        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            filter={filter}
            hasCompleted={hasCompleted}
            handleFilterChange={handleFilterChange}
            onClearCompleted={onClearCompleted}
          />
        )}
      </div>
    </div>
  );
};
// /* eslint-disable jsx-a11y/label-has-associated-control */
// /* eslint-disable jsx-a11y/control-has-associated-label */
// import React, { useEffect, useRef, useState } from 'react';
// import { UserWarning } from './UserWarning';
// import {
//   apiAddTodo,
//   deleteTodo,
//   getTodos,
//   patchTodo,
//   USER_ID,
// } from './api/todos';
// import { Todo } from './types/Todo';
// import { Header } from './Components/Header';
// import { TodoList } from './Components/TodoList';
// import { Footer } from './Components/Footer';
// import { FilterType } from './types/FilterType';
// import { ErrorNotification } from './Components/ErrorNotification';
// import { TodoItem } from './Components/TodoItems';

// export const App: React.FC = () => {
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [tempTodo, setTempTodo] = useState<Todo | null>(null);
//   const [title, setTitle] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [filter, setFilter] = useState<FilterType>(FilterType.All);

//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     inputRef.current?.focus();
//   }, []);

//   useEffect(() => {
//     if (!USER_ID) {
//       return;
//     }

//     setLoading(true);
//     getTodos()
//       .then(data => {
//         setTodos(data);
//         setError(null);
//       })
//       .catch(err => {
//         // eslint-disable-next-line no-console
//         console.log(err);
//         setError('Unable to load todos');
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => {
//         setError(null);
//       }, 3000);

//       return () => clearTimeout(timer);
//     }
//   }, [error]);

//   useEffect(() => {
//     if (!loading) {
//       const timer = setTimeout(() => {
//         inputRef.current?.focus();
//       }, 100);

//       return () => clearTimeout(timer);
//     }
//   }, [loading]);

//   if (!USER_ID) {
//     return <UserWarning />;
//   }

//   const filteredTodos = todos.filter(todo => {
//     if (filter === FilterType.Active) {
//       return !todo.completed;
//     }

//     if (filter === FilterType.Completed) {
//       return todo.completed;
//     }

//     return true;
//   });

//   const activeCount = todos.filter(todo => !todo.completed).length;
//   const handleFilterChange = (newFilter: FilterType) => {
//     setFilter(newFilter);
//   };

//   const hasCompleted = todos.some(todo => todo.completed);

//   const onClearCompleted = () => {
//     setTodos(todos.filter(todo => !todo.completed));
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const trimmedTitle = title.trim();

//     if (!trimmedTitle) {
//       setError('Title should not be empty');

//       return;
//     }

//     // Создаем временное задание с id 0 и флагом isTemporary
//     const temp: Todo = {
//       id: 0, // временный id, который не конфликтует с реальными (например, реальные id > 0)
//       title: trimmedTitle,
//       completed: false,
//       userId: USER_ID,
//       // Вы можете добавить свойство isTemporary, если хотите проверять его в TodoItem:
//       // isTemporary: true,
//     };

//     setTempTodo(temp);
//     setLoading(true);
//     setError(null);

//     // Отправляем запрос на создание todo
//     apiAddTodo({
//       title: trimmedTitle,
//       completed: false,
//       userId: USER_ID,
//     })
//       .then(newTodo => {
//         // Добавляем реальный todo в список
//         setTodos(prev => [...prev, newTodo]);
//         setTitle('');
//       })
//       .catch(() => {
//         setError('Unable to add a todo');
//       })
//       .finally(() => {
//         // После получения ответа (успех или ошибка) скрываем tempTodo
//         setTempTodo(null);
//         // Здесь можно добавить искусственную задержку, если нужно, чтобы temp todo был виден дольше:
//         setTimeout(() => {
//           setLoading(false);
//         }, 500);
//       });
//   };

//   // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//   //   e.preventDefault();

//   //   if (!title.trim()) {
//   //     return;
//   //   }

//   //   setLoading(true);
//   //   setError(null);

//   //   apiAddTodo({
//   //     title,
//   //     completed: false,
//   //     userId: USER_ID,
//   //   })
//   //     .then(newTodo => {
//   //       setTodos(prev => [...prev, newTodo]);
//   //       setTitle('');
//   //     })
//   //     .catch(() => {
//   //       setError('Unable to add a todo');
//   //     })
//   //     .finally(() => {
//   //       setLoading(false);
//   //     });
//   // };

//   const onDelete = (id: Todo['id']) => {
//     deleteTodo(id);
//     setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
//   };

//   const toggleTodo = (id: number) => {
//     const currentTodo = todos.find(todo => todo.id === id);

//     if (!currentTodo) {
//       return;
//     }

//     patchTodo(id, { completed: !currentTodo.completed })
//       .then(updatedTodo => {
//         setTodos(prevTodos =>
//           prevTodos.map(todo =>
//             todo.id === id
//               ? { ...todo, completed: updatedTodo.completed }
//               : todo,
//           ),
//         );
//       })
//       .catch(() => {
//         setError('Failed to update todo');
//       });
//   };

//   const onToggleAll = () => {
//     setTodos(prevTodos => {
//       const allCompleted = prevTodos.every(todo => todo.completed);

//       return prevTodos.map(todo => ({
//         ...todo,
//         completed: !allCompleted,
//       }));
//     });
//   };
//   // eslint-disable-next-line padding-line-between-statements, no-console
//   console.log(loading, `1`);

//   return (
//     <div className="todoapp">
//       <h1 className="todoapp__title">todos</h1>

//       <ErrorNotification
//         error={error}
//         isVisible={!!error}
//         onClose={() => setError(null)}
//       />

//       <div className="todoapp__content">
//         <Header
//           todos={todos}
//           title={title}
//           setTitle={setTitle}
//           setError={setError}
//           handleSubmit={handleSubmit}
//           onToggleAll={onToggleAll}
//           loading={loading}
//           inputRef={inputRef}
//         />
//         {todos.length > 0 && (
//           <TodoList
//             filteredTodos={filteredTodos}
//             loading={loading}
//             onDelete={onDelete}
//             onToggle={toggleTodo}
//           />
//         )}
//         {tempTodo && (
//           <div data-cy="TempTodo">
//             {/* Можно использовать тот же компонент TodoItem, если он умеет показывать loader */}
//             <TodoItem
//               todo={tempTodo}
//               onDelete={() => {}} // temp todo не удаляем вручную
//               onToggle={() => {}}
//             />
//             {/* Отображаем overlay с загрузчиком */}
//             <div data-cy="TodoLoader" className="modal overlay is-active">
//               <div className="modal-background has-background-white-ter" />
//               <div className="loader" />
//             </div>
//           </div>
//         )}
//         {/* Hide the footer if there are no todos
//         Скрыть нижний колонтитул, если задач нет */}
//         {todos.length > 0 && (
//           <Footer
//             activeCount={activeCount}
//             filter={filter}
//             hasCompleted={hasCompleted}
//             handleFilterChange={handleFilterChange}
//             onClearCompleted={onClearCompleted}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

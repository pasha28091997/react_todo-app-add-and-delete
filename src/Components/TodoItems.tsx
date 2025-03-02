/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable prettier/prettier */
import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type TodoItemProps = {
  todo: Todo;
  onDelete: (id: Todo['id']) => void;
  onToggle: (id: number) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
  isTemporary?: boolean;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDelete,
  onToggle,
  isUpdating = false,
  isDeleting = false,
  isTemporary = false,
}) => {
  const { id, title, completed } = todo;

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
      <label className="todo__status-label" htmlFor={`todo-${id}`}>
        <input
          id={`todo-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onToggle(id)}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isTemporary || isUpdating || isDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

// import classNames from 'classnames';
// import { Todo } from '../types/Todo';
// // import classNames from 'classnames';

// type TodoItemProps = {
//   todo: Todo;
//   onDelete: (id: Todo['id']) => void;
//   onToggle: (id: number) => void;
//   isTemporary?: boolean;
// };

// export const TodoItem: React.FC<TodoItemProps> = ({
//   todo,
//   onDelete,
//   onToggle,
//   isTemporary = false,
// }) => {
//   const { id, title, completed } = todo;

//   return (
//     <div data-cy="Todo" className={classNames(`todo ${completed ? 'completed' : ''}`)}>
//       <label className="todo__status-label">
//         <input
//           data-cy="TodoStatus"
//           type="checkbox"
//           className="todo__status"
//           id={`todo-status-${id}`}
//           checked={completed}
//           onChange={() => onToggle(id)}
//         />
//         {/* <span className="visually-hidden">Toggle todo status</span> */}
//       </label>
//       <span data-cy="TodoTitle" className="todo__title">
//         {title}
//       </span>

//       <button
//         type="button"
//         className="todo__remove"
//         data-cy="TodoDelete"
//         onClick={() => onDelete(id)}
//       >
//         ×
//       </button>

//       {/* {isTemporary && ( */}
//       <div
//         data-cy="TodoLoader"
//         className={classNames(`modal overlay ${!isTemporary ? 'hidden' : ''}`)}
//       >
//         <div
//           className="modal-background has-background-white-ter"
//         />
//         <div
//           className="loader"
//         />
//       </div>
//       {/* // )} */}

//       {/* overlay will cover the todo while it is being deleted or updated
//             наложение будет покрывать задачу,
//             пока она удаляется или обновляется */}
//       {/* {isTemporary && (
//         <div data-cy="TodoLoader" className="modal overlay is-active">
//           <div className="modal-background has-background-white-ter" />
//           <div className="loader" />
//         </div>
//       )} */}
//     </div>
//   );
// };
// className={cn(`modal overlay ${!isTemporary ? 'is-active' : ''}`)}


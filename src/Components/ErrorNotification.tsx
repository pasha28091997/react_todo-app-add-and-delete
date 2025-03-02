import React from 'react';
import classNames from 'classnames';

type Props = {
  error: string | null;
  isVisible: boolean;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  isVisible,
  onClose,
  // }) => {
  //   if (!isVisible || !error) {
  //     return null;
  //   }

  //   return (
  //     <div
  //       className={classNames(
  //         'notification',
  //         'is-danger',
  //         'is-light',
  //         'has-text-weight-normal',
  //         // { hidden: !isVisible },
  //       )}
  //       data-cy="ErrorNotification"
  //     >
  //       <button
  //         data-cy="HideErrorButton"
  //         type="button"
  //         className="delete"
  //         onClick={onClose}
  //       />
  //       {error}
  //     </div>
  //   );
  // };
}) => (
  <div
    className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !isVisible },
    )}
    data-cy="ErrorNotification"
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onClose}
    />
    {error}
  </div>
);

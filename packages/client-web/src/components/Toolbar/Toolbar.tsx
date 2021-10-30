import { useState } from 'react';

import styles from './Toolbar.module.css';

interface ToolbarProps {
  readonly isReadonly: boolean;
  onSelect: (dependency: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ isReadonly, onSelect }) => {
  const [name, setName] = useState<string>();

  function handleChange(event) {
    setName(event.target.value);
  }

  return (
    <div className={styles.toolbar}>
      <input
        placeholder="example: react/16.13.0"
        onChange={handleChange}
        readOnly={isReadonly}
        autoFocus
      />
      <button onClick={() => onSelect(name)} disabled={isReadonly}>
        Load dependencies
      </button>
    </div>
  );
};

export { Toolbar };

import { useState } from 'react';

import { Toolbar } from '../components/Toolbar';
import { TreeView } from '../components/TreeView';
import { getPackage } from '../services/getPackage';

import styles from './index.module.css';

enum MODE {
  SHOWING,
  LOADING,
}

function IndexPage() {
  const [mode, setMode] = useState<MODE>(MODE.SHOWING);
  const [dependencies, setDependencies] = useState<Record<string, unknown> | null>(null);

  const handleSelect = async (npmPackage: string) => {
    setMode(MODE.LOADING);
    setDependencies({});

    try {
      const dependencies = await getPackage(npmPackage);
      setDependencies(dependencies ?? null);
    } catch (error) {
      console.error(error);
    }

    setMode(MODE.SHOWING);
  };

  return (
    <>
      <div className={styles.container}>
        <Toolbar
          isReadonly={mode === MODE.LOADING}
          onSelect={handleSelect}
        />
        {mode === MODE.SHOWING ? (
          <TreeView dependencies={dependencies} />
        ) : (
          <div className={styles.loader}>
            Retrieving dependencies data, please wait ...
          </div>
        )}
      </div>
    </>
  );
}

export default IndexPage;

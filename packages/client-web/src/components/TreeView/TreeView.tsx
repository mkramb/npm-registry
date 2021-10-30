import dynamic from 'next/dynamic';

import styles from './TreeView.module.css';

const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false });

interface TreeViewProps {
  readonly dependencies: Record<string, unknown>;
}

const TreeView: React.FC<TreeViewProps> = ({ dependencies }) => {
  return (
    <div className={styles.tree}>
      {dependencies && (
        <DynamicReactJson
          src={dependencies}
          enableClipboard={false}
          displayDataTypes={false}
          displayObjectSize={false}
        />
      )}
    </div>
  );
};

export { TreeView };

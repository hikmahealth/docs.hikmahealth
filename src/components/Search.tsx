import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { DocSearchModal, useDocSearchKeyboardEvents } from "@docsearch/react";
import "@docsearch/css";

const docSearchConfig = {
  appId: import.meta.env.PUBLIC_DOCSEARCH_APP_ID,
  apiKey: import.meta.env.PUBLIC_DOCSEARCH_API_KEY,
  indexName: import.meta.env.PUBLIC_DOCSEARCH_INDEX_NAME,
};

function Hit({
  hit,
  children,
}: {
  hit: { url: string };
  children: React.ReactNode;
}) {
  return <a href={hit.url}>{children}</a>;
}

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [modifierKey, setModifierKey] = useState<string>();

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useDocSearchKeyboardEvents({ isOpen, onOpen, onClose });

  useEffect(() => {
    setModifierKey(
      /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? "⌘" : "Ctrl "
    );
  }, []);

  return (
    <>
      <button
        type="button"
        className="flex items-center w-full gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
        onClick={onOpen}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span>Search docs</span>
        {modifierKey && (
          <kbd className="ml-auto text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5">
            {modifierKey}K
          </kbd>
        )}
      </button>
      {isOpen &&
        createPortal(
          <DocSearchModal
            {...docSearchConfig}
            initialScrollY={window.scrollY}
            onClose={onClose}
            hitComponent={Hit}
            navigator={{
              navigate({ itemUrl }) {
                window.location.href = itemUrl;
              },
            }}
          />,
          document.body
        )}
    </>
  );
}

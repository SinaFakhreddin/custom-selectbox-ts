import React, { useEffect, useState } from "react";
import styles from "./App.module.css";
import { useRef } from "react";

export type OptionProps = {
  label: string;
  value: number;
};

type SingleSelectBoxProps = {
  multiple?: false;
  value: OptionProps | undefined;
  onChange: (op: OptionProps | undefined) => void;
  // options: OptionProps[];
};

type MultiSelectBoxProps = {
  multiple: true;
  value: OptionProps[];
  onChange: (op: OptionProps[]) => void;
};

type SelectBoxProps = {
  options: OptionProps[];
} & (MultiSelectBoxProps | SingleSelectBoxProps);

const SelectBox = ({ multiple, options, value, onChange }: SelectBoxProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const [isJumpUp, setIsJumpUp] = useState<boolean>(false);
  const [isDeletedValue, setIsDeletedValue] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      setIsJumpUp(false);
      setIsDeletedValue(false);
    }, 500);
  }, [value]);

  const isSelectedOption = (op: OptionProps) => {
    return JSON.stringify(value) === JSON.stringify(op);
  };

  useEffect(() => {
    setHighlightedIndex(0);
  }, [isOpen]);

  const clearValue = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeletedValue(true);
    setTimeout(() => {
      multiple ? onChange([]) : onChange(undefined);
    }, 400);
  };

  const labelHandler = (op: OptionProps) => {
    if (multiple) {
      if (
        value.some((val) => val.label === op.label && val.value === op.value)
      ) {
        setIsDeletedValue(true);
        setTimeout(() => {
          onChange(value.filter((o) => o.label !== op.label));
        }, 400);
      } else {
        setIsJumpUp(true);
        setTimeout(() => {
          onChange([...value, op]);
        }, 400);
      }
    } else {
      if (JSON.stringify(value) !== JSON.stringify(op)) {
        onChange(op);
        setIsJumpUp(true);
        setIsOpen(false);
      } else {
        setIsDeletedValue(true);
        setTimeout(() => {
          onChange(undefined);
        }, 400);
      }
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target !== containerRef.current) return;
      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen(!isOpen);
          if (isOpen) labelHandler(options[highlightedIndex]);
          break;

        case "ArrowDown":
        case "ArrowUp":
          if (!isOpen) setIsOpen(true);
          if (isOpen) {
            const newHighlightedIndex =
              highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
            if (
              newHighlightedIndex >= 0 &&
              newHighlightedIndex <= options.length
            ) {
              setHighlightedIndex(newHighlightedIndex);
            }
          }
          break;
      }
    };

    containerRef.current?.addEventListener("keydown", handler);

    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    };
  }, [highlightedIndex, isOpen]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onBlur={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
      className={`${styles.container} ${
        isJumpUp ? styles["h-2"] : styles["mh-2"]
      }`}
    >
      <div
        className={`${styles.value} ${isJumpUp ? styles["go-up-value"] : ""} ${
          isDeletedValue ? styles["go-down-value"] : ""
        }`}
      >
        {multiple
          ? value.map((val) => {
              return (
                <button
                  className={`${styles["multiple-btn"]} ${
                    isDeletedValue ? styles["go-down-value"] : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeletedValue(true);
                    labelHandler(val);
                  }}
                >
                  <span>{val.label}</span>
                  <span className={styles.times}>&times;</span>{" "}
                </button>
              );
            })
          : value?.label}
      </div>
      <div className={styles["right-child"]}>
        <div>
          <button
            onClick={(e) => clearValue(e)}
            className={styles["btn-clear"]}
          >
            &times;
          </button>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.caret}></div>
      </div>
      <ul className={`${styles.ul} ${isOpen ? styles.show : ""}`}>
        {options.map((op, index) => {
          return (
            <li
              className={`${styles.li} ${
                index === highlightedIndex ? styles["li-hover"] : ""
              }
              ${isSelectedOption(op) ? styles.selected : ""}
              `}
              key={op.value}
              onMouseEnter={() => {
                setHighlightedIndex(index);
              }}
              onClick={(e) => {
                e.stopPropagation();
                labelHandler(op);
                // setIsJumpUp(true);
                // setIsOpen(false);
              }}
            >
              {op.value}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SelectBox;

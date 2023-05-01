import React, { useState } from "react";
import styles from "./App.module.css";
import SelectBox, { OptionProps } from "./SelectBox";

function App() {
  const options = [
    { label: "First", value: 1 },
    { label: "Second", value: 2 },
    { label: "Third", value: 3 },
    { label: "Fourth", value: 4 },
    { label: "Fifth", value: 5 },
    { label: "Sixth", value: 6 },
    { label: "seventh", value: 7 },
    { label: "eighth", value: 8 },
    { label: "ninth", value: 9 },
    { label: "ten", value: 10 },
  ];
  const [value1, setValue1] = useState<OptionProps | undefined>(options[0]);
  const [value2, setValue2] = useState<OptionProps[]>([]);

  return (
    <div className={styles.App}>
      <SelectBox
        multiple={false}
        options={options}
        value={value1}
        onChange={(op) => setValue1(op)}
      />
      <br />
      <SelectBox
        multiple={true}
        options={options}
        value={value2}
        onChange={(op) => {
          setValue2(op);
        }}
      />
    </div>
  );
}

export default App;

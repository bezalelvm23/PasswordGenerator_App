import React, { useLayoutEffect, useState } from "react";
import "./Card.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

export const Card = () => {
  const [conditions, setConditions] = useState([
    { name: "uppercase", enabled: false, values: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
    { name: "lowercase", enabled: false, values: "abcdefghijklmnopqrstuvwxyz" },
    { name: "numbers", enabled: false, values: "0123456789" },
    { name: "symbols", enabled: false, values: "!@#$%^&*()_+=-][{}<>?,." },
  ]);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [rangeValue, setRangeValue] = useState(0);
  const [conditionCount, setConditionCount] = useState(0);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  useLayoutEffect(() => {
    manageConditionsCount();
    changeStrengthColor();
  }, [conditions, checkboxHandler]);

  function manageConditionsCount() {
    const conditionsCount = conditions.filter(
      (condition) => condition.enabled === true
    ).length;
    setConditionCount(conditionsCount);
  }

  function generatePassword() {
    const conditionSelected =
      conditions.filter((condition) => condition.enabled === true).length > 0
        ? true
        : false;

    if (!conditionSelected) {
      showMessage("err", "select atleast 1 condition");
      return;
    }

    if (rangeValue === 0) {
      showMessage("err", "select password Length");
      return;
    }

    let selected: string[] = conditions
      .filter((condition) => condition.enabled === true)
      .map((condition) => {
        return condition.values;
      });

    function generateIndex() {
      return Math.floor(Math.random() * selected.length);
    }

    let password = "";
    let i = 0;
    let previousIndex = 0;
    while (i < rangeValue) {
      let randomIndex = generateIndex();
      if (randomIndex === previousIndex && selected.length > 1) {
        while (randomIndex === previousIndex) {
          randomIndex = generateIndex();
        }
      }
      previousIndex = randomIndex;
      let selectedItem = selected[randomIndex];
      password += selectedItem.charAt(
        Math.floor(Math.random() * selectedItem.length)
      );
      i++;
    }

    setGeneratedPassword(password);
    return password;
  }

  function checkboxHandler(e: any) {
    const { name, checked } = e.target;
    setConditions((prevValues) => {
      let updated = prevValues.map((data) => {
        if (data.name === name) {
          data.enabled = checked;
        }
        return data;
      });
      return updated;
    });
    setMessage({ type: "", text: "" });
  }

  function rangeHandler(e: any) {
    setRangeValue(e.target.value);
    resetMessage();
  }

  async function copyPassword() {
    if (generatedPassword) {
      await navigator.clipboard.writeText(generatedPassword);
      showMessage("success", "copied");
    }
  }

  function changeStrengthColor() {
    const levels: any = document.querySelectorAll(".level");
    for (let index = 0; index < conditionCount; index++) {
      levels[index].style.backgroundColor = "#f4e110";
      levels[index].style.borderColor = "#f4e110";
    }
    for (let index = 3; index >= conditionCount; index--) {
      levels[index].style.backgroundColor = "";
      levels[index].style.borderColor = "#fff";
    }
  }

  function resetMessage() {
    setMessage({ type: "", text: "" });
  }

  function showMessage(inputType: string, inputText: string) {
    setMessage({ type: inputType, text: inputText });
    if (inputType !== "err") {
      setTimeout(() => {
        resetMessage();
      }, 2000);
    }
  }

  return (
    <div className="card-container">
      <h4>password generator</h4>
      <div className="password-container">
        <p className="password">{generatedPassword}</p>
        <button onClick={copyPassword}>
          <FontAwesomeIcon icon={faCopy} className="copy-icon" />
        </button>
      </div>
      <div className="bottom-container">
        <div className="length-container">
          <div>
            <p>character length</p>
            <p className="range">{rangeValue}</p>
          </div>
          <input
            type="range"
            defaultValue={rangeValue}
            max={20}
            onChange={rangeHandler}
            className="custom-range"
          />
        </div>
        <div className="conditions-container">
          <div>
            <input
              type="checkbox"
              id="upper"
              name="uppercase"
              onClick={checkboxHandler}
            />
            <label htmlFor="upper">include uppercase letters</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="lower"
              name="lowercase"
              onClick={checkboxHandler}
            />
            <label htmlFor="lower">include lowercase letters</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="numbers"
              name="numbers"
              onClick={checkboxHandler}
            />
            <label htmlFor="numbers">include numbers</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="symbols"
              name="symbols"
              onClick={checkboxHandler}
            />
            <label htmlFor="symbols">include symbols</label>
          </div>
        </div>
        <div className="strength-container">
          <p>Strength</p>
          <div className="level-container">
            <p>
              {conditionCount === 1
                ? "easy"
                : conditionCount === 2
                ? "normal"
                : conditionCount === 3
                ? "medium"
                : conditionCount === 4
                ? "strong"
                : ""}
            </p>
            <div className="level"></div>
            <div className="level"></div>
            <div className="level"></div>
            <div className="level"></div>
          </div>
        </div>
        <button onClick={generatePassword} className="generate-btn">
          generate
        </button>
      </div>
      <p
        className="msg"
        style={{ color: message.type === "err" ? "red" : "#54d165" }}
      >
        {message.text}
      </p>
    </div>
  );
};

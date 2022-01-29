import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext({ modal: {} });
export const useModal = () => {
  const { modal } = useContext(ModalContext);
  return modal;
};

export const ModalContextProvider = ({ children }) => {
  const [show, setShow] = useState(false);
  const [Title, setTitle] = useState("");
  const [Body, setBody] = useState("");
  const [ButtonTitle, setButtonTitle] = useState(null);
  const [ButtonAction, setButtonAction] = useState(null);

  const setModalStates = ({ title, body, button, action }) => {
    setTitle(title ?? "");
    setBody(body ?? "");
    setButtonTitle(button);
    setButtonAction(() => action);
    setShow(true);
  };

  const contextValue = {
    modal: {
      show: (props) => setModalStates(props),
      showPendingTx: (tx) => {
        const txHash = tx.hash;
        setModalStates({
          title: "Pending",
          body: `Check tx ${txHash} on Etherscan`,
          button: "Etherscan",
          action: () => {
            const url = `https://rinkeby.etherscan.io/tx/${txHash}`;
            window.open(url, "_blank");
          },
        });
      },
    },
  };

  const handleClose = () => {
    setShow(false);
    setTitle("");
    setBody("");
    setButtonTitle(null);
    setButtonAction(null);
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      <div className={`modal ${show && "modal-open"}`}>
        <div className="modal-box">
          <p className="text-lg font-bold">{Title}</p>
          <p className="text-sm">{Body}</p>
          <div className="modal-action">
            <label
              htmlFor="my-modal-2"
              className={`btn btn-primary`}
              onClick={ButtonAction ?? (() => {})}
            >
              {ButtonTitle}
            </label>
            <label htmlFor="my-modal-2" className="btn" onClick={handleClose}>
              Close
            </label>
          </div>
        </div>
      </div>
    </ModalContext.Provider>
  );
};

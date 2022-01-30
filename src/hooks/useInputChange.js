import React from "react";

export const useInputChange = () => {
    const [input, setInput] = React.useState({
        publicKey: "",
        amount: "",
        projectName:"",
        symbol: "",
        contractAddress: "",
    });

    const handleInputChange = (e) => {
        if (e.target.type === "number") {
            if (e.target.keyCode === 69) {
                return;
            }
        }
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });
    };

    return [input, handleInputChange, setInput];
};
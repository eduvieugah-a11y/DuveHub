import "./Button.css";

function Button({text, type = ""}) {
    return(
        <button className={`btn ${type}`}>
            {text}
        </button>
    )
}

export default Button;
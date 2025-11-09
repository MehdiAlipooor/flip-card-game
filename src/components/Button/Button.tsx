import "./style.css";
type ButtonType = "success" | "danger";

interface Props {
	title: string;
	onClick?: () => void;
	type?: ButtonType;
}
export const Button = ({ onClick, title, type = "danger" }: Props) => {
	return (
		<button className={`button ${type}`} onClick={onClick}>
			{title}
		</button>
	);
};

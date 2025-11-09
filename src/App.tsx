import { useRef, useState } from "react";
import { Alert, Button, FlipCard, type FlipCardRef } from "./components";

function App() {
	const [isGameStarted, setIsGameStarted] = useState(false);

	const flipCardRef = useRef<FlipCardRef>(null);

	const onStartClick = () => {
		setIsGameStarted(true);
		setTimeout(() => {
			flipCardRef.current?.start();
		}, 2000);
	};

	return (
		<div className="main">
			<Alert />
			<div className={`body ${isGameStarted && "active"}`}>
				<div className="control-section">
					<div className="inner">
						<p>به بازی کارت ها خوش اومدی</p>
						<Button title={"شروع بازی"} onClick={onStartClick} type="danger" />
					</div>
				</div>
				<div className="wrapper">
					<FlipCard ref={flipCardRef}/>
				</div>
			</div>
		</div>
	);
}

export default App;

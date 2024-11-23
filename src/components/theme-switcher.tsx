import { makePersisted } from "@solid-primitives/storage";
import { TbMoonStars, TbSunFilled } from "solid-icons/tb";
import { Show, createEffect, createSignal } from "solid-js";
import { IconButton } from "./ui/icon-button";

export default function ThemeSwitcher() {
	const [darkMode, setDarkMode] = makePersisted(createSignal(false), {
		name: "theme",
	});

	createEffect(() => {
		if (darkMode()) {
			document.body.classList.add("dark");
		} else {
			document.body.classList.remove("dark");
		}
	});

	return (
		<IconButton variant="outline" onClick={() => setDarkMode((prev) => !prev)}>
			<Show when={darkMode()} fallback={<TbMoonStars />}>
				<TbSunFilled />
			</Show>
		</IconButton>
	);
}

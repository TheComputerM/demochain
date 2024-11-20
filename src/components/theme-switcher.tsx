import { createEffect, createSignal, Show } from "solid-js";
import { IconButton } from "./ui/icon-button";
import { TbMoon, TbMoonFilled, TbMoonStars, TbSunFilled } from "solid-icons/tb";
import { makePersisted } from "@solid-primitives/storage";

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

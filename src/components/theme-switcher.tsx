import { makePersisted } from "@solid-primitives/storage";
import { Show, createEffect, createSignal } from "solid-js";
import { IconButton } from "./ui/icon-button";
import TablerMoonStars from "~icons/tabler/moon-stars";
import TablerSunFilled from "~icons/tabler/sun-filled";

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
		<IconButton variant="ghost" onClick={() => setDarkMode((prev) => !prev)}>
			<Show when={darkMode()} fallback={<TablerMoonStars />}>
				<TablerSunFilled />
			</Show>
		</IconButton>
	);
}

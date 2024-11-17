import type { RouteSectionProps } from "@solidjs/router";

export default function AppLayout(props: RouteSectionProps) {
  return <div>{props.children}</div>;
}
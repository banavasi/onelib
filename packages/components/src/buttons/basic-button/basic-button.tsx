// Source: Sera UI (seraui.com)
// TODO: Port actual component from Sera UI
export function BasicButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return <button {...props}>{children}</button>;
}

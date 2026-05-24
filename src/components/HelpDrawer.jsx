export default function HelpDrawer({ title = "About this tool", children }) {
  return <details className="help-drawer"><summary>{title}</summary><div>{children}</div></details>;
}

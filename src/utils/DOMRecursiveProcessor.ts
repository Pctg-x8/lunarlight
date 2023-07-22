export function recursiveProcessDOMNodes(root: Node, action: (element: Node) => void) {
  for (const child of root.childNodes) {
    action(child);
    recursiveProcessDOMNodes(child, action);
  }
}

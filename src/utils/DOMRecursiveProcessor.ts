export function recursiveProcessDOMNodes(root: Node, action: (element: Node) => void) {
  function rec(x: ChildNode) {
    action(x);
    for (const child of x.childNodes) rec(child);
  }

  for (const child of root.childNodes) rec(child);
}

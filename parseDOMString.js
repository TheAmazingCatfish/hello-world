function parse(html) {
  // 步骤 1: 分词
  const tokens = html.match(/<\/?[\w\s="']+>|[^<>]+/g);

  // 步骤 2: 构建节点树
  function createNode(token) {
    const isTag = /<\/?[\w\s="']+>/.test(token);
    if (isTag) {
      const tagMatch = token.match(/<\/?(\w+)/);
    	if (tagMatch) return { tag: tagMatch[1], children: [] };
    } else return { text: token.trim() };
  }

  const root = { tag:'root', children: [] };
	const stack = [root];

  tokens.forEach(token => {
    const node = createNode(token);
		if (!node) return;

    if (token.startsWith('</')) stack.pop(); // 结束标签，弹出栈顶
    else if (node.tag) {
      const parent = stack[stack.length - 1]; // 获取当前栈顶元素作为父节点
      parent.children.push(node); // 将当前节点添加到父节点的 children 中
      // 自闭合标签不入栈
      if (!token.endsWith('/>')) stack.push(node); // 将当前节点入栈，成为下一个节点的潜在父节点
    }
  });

  return root.children[0]; // 返回根节点下的 HTML 节点
}

// 示例代码
let doc = parse(`
  <html>
    <head>
      <title>Hello</title>
    </head>
    <body>
      <div id="container">
        <div class="header"></div>
        <div class="content"></div>
        <div class="footer"></div>
      </div>
    </body>
  </html>
`);

console.log(JSON.stringify(doc, undefined, 2));

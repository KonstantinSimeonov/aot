import * as ts from "typescript"

const hl = (x: string) => `\033[94;1;40m${x}\033[0m`

const run = (file: string) => {
  const prg = ts.createProgram([file], {})
  const src_file = prg.getSourceFile(file)
  if (!src_file) {
    console.error(`typescript borked`)
    process.exit(1)
  }

  const checker = prg.getTypeChecker()

  ts.forEachChild(src_file, node => {
    if (!ts.isTypeAliasDeclaration(node) || !node.name) return

    const pos = src_file.getLineAndCharacterOfPosition(node.pos)
    const symbol = checker.getSymbolAtLocation(node.name)
    const symbol_type = checker.getWidenedType(checker.getDeclaredTypeOfSymbol(symbol!))
    const type_string = checker.typeToString(
      symbol_type,
      undefined,
      ts.TypeFormatFlags.NoTruncation
    )
    const binding = node.getChildAt(1).getText()

    console.log(`line ${pos.line}:${hl(binding)} -> ${hl(type_string)}`)
  })
}

run(process.argv[2])

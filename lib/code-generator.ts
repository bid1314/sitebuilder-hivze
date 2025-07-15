"use client"

import type { GridLayout, ColumnData, ComponentData } from "./types"

export function generateReactCode(layout: GridLayout): string {
  const imports = generateImports(layout)
  const helperComponents = generateHelperComponents(layout)
  const componentCode = generateComponentCode(layout)

  return `${imports}
${helperComponents}
export default function GeneratedUI() {
  return (
${componentCode}
  );
}`
}

function generateImports(layout: GridLayout): string {
  const importMap: Record<string, Set<string>> = {
    react: new Set(["useState", "useEffect"]),
  }

  // Helper – make sure a Set exists for a given module then add the symbol
  const addImport = (module: string, symbol: string) => {
    if (!importMap[module]) importMap[module] = new Set()
    importMap[module]!.add(symbol)
  }

  // Helper function to analyze components in columns
  const analyzeComponents = (columns: ColumnData[] = []) => {
    if (!columns) return

    columns.forEach((column) => {
      if (!column) return

      if (column.components) {
        column.components.forEach((component) => {
          if (!component) return

          switch (component.type) {
            case "button":
              addImport("@/components/ui", "Button")
              break
            case "input":
              addImport("@/components/ui", "Input")
              break
            // Add other component imports as needed
            case "text-rotate":
              addImport("@/components/ui", "TextRotate")
              importMap["motion/react"] = importMap["motion/react"] || new Set()
              importMap["motion/react"].add("LayoutGroup")
              importMap["motion/react"].add("motion")
              break
            case "hero-title":
            case "hero-subtitle":
            case "hero-section":
              // These use standard HTML elements, no special imports needed
              break
            case "gooey-text":
              addImport("@/components/ui", "GooeyText")
              break
            case "reveal-image-list":
              addImport("@/components/ui", "RevealImageList")
              break
            case "navbar-menu":
              addImport("@/components/ui/navbar-menu", "Menu")
              addImport("@/components/ui/navbar-menu", "MenuItem")
              addImport("@/components/ui/navbar-menu", "ProductItem")
              addImport("@/components/ui/navbar-menu", "HoveredLink")
              addImport("react", "useState")
              addImport("next/link", "default as Link")
              addImport("next/image", "default as Image")
              addImport("@/lib/utils", "cn")
              break
            case "gradient-headline":
              addImport("@/components/ui", "GradientHeadline")
              break
            case "product-card":
              addImport("@/components/ui", "ProductCard")
              break
            case "masonry-gallery":
              addImport("@/components/ui", "MasonryGallery")
              break
          }
        })
      }

      // Recursively analyze nested columns
      if (column.childColumns && column.childColumns.length > 0) {
        analyzeComponents(column.childColumns)
      }
    })
  }

  // Start analysis from root columns
  analyzeComponents(layout.columns)

  // Generate import statements
  let importStatements = ""

  for (const [module, components] of Object.entries(importMap)) {
    if (components.size > 0) {
      importStatements += `import { ${Array.from(components).join(", ")} } from "${module}";\n`
    }
  }

  return importStatements
}

// NEW: Helper function to generate components like navbar
function generateHelperComponents(layout: GridLayout): string {
  let funcs = ""
  const seenNavbars = new Set<string>()

  const findNavbars = (columns: ColumnData[] = []) => {
    if (!columns) return
    columns.forEach((col) => {
      if (!col) return
      if (col.components) {
        col.components.forEach((comp) => {
          if (comp.type === "navbar-menu" && !seenNavbars.has(comp.id)) {
            funcs += generateNavbarMenuComponent(comp)
            seenNavbars.add(comp.id)
          }
        })
      }
      if (col.childColumns) findNavbars(col.childColumns)
    })
  }
  findNavbars(layout.columns)
  return funcs
}

const getNavbarComponentName = (id: string) => `NavbarMenu_${id.replace(/-/g, "_")}`

function generateNavbarMenuComponent(component: ComponentData): string {
  const componentName = getNavbarComponentName(component.id)
  const { props } = component
  const items = props.items || []

  return `
function ${componentName}() {
  const [active, setActive] = useState(null);
  const items = ${JSON.stringify(items, null, 2)};

  const getWidth = (w) => ({
    1: "w-1/12",
    2: "w-2/12",
    3: "w-3/12",
    4: "w-4/12",
    5: "w-5/12",
    6: "w-6/12",
    7: "w-7/12",
    8: "w-8/12",
    9: "w-9/12",
    10: "w-10/12",
    11: "w-11/12",
    12: "w-full",
  }[w] || "w-full");

  const renderCustomLayout = (layout) => {
    if (!layout || !layout.columns) return null;
    return (
      <div className="flex flex-wrap" style={{ width: layout.containerWidth || "100%" }}>
        {layout.columns.map((col) => (
          <div key={col.id} className={getWidth(col.width) + " p-2"}>
            <div
              className={
                "flex " +
                (col.orientation === "vertical" ? "flex-col " : "") +
                (col.flexLayout || "") +
                " gap-" + (col.gap || 0)
              }
            >
              {col.components?.map((cmp) =>
                cmp.type === "text" ? (
                  <p key={cmp.id}>{cmp.props.text}</p>
                ) : (
                  <Image
                    key={cmp.id}
                    src={cmp.props.src || "/placeholder.svg"}
                    alt={cmp.props.alt}
                    width={100}
                    height={100}
                    className="w-full h-auto"
                  />
                )
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-full flex items-center justify-center">
      <Menu setActive={setActive}>
        {items.map((item) => (
          <MenuItem key={item.id} setActive={setActive} active={active} item={item}>
            {item.megaMenu?.type === "links" && (
              <div className="flex flex-col space-y-4 text-sm">
                {item.megaMenu.items.map((l, i) => (
                  <HoveredLink key={i} href={l.href}>{l.text}</HoveredLink>
                ))}
              </div>
            )}

            {item.megaMenu?.type === "products" && (
              <div
                className="text-sm grid gap-10 p-4"
                style={{ gridTemplateColumns: "repeat(" + (item.megaMenu.columns || 2) + ", minmax(0, 1fr))" }}
              >
                {item.megaMenu.items.map((p, i) => (
                  <ProductItem
                    key={i}
                    title={p.title}
                    href={p.href}
                    src={p.src}
                    description={p.description}
                  />
                ))}
              </div>
            )}

            {item.megaMenu?.type === "custom" && item.megaMenu.layout && (
              <div className="p-4" style={{ width: item.megaMenu.layout.containerWidth || "600px" }}>
                {renderCustomLayout(item.megaMenu.layout)}
              </div>
            )}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
`
}

function generateColumnsCode(columns: ColumnData[] = [], indentLevel = 6): string {
  if (!columns || columns.length === 0) {
    return ""
  }

  const indent = " ".repeat(indentLevel)
  let columnsCode = ""

  columns.forEach((column) => {
    if (!column) return

    const orientation = column.orientation || "horizontal"
    const columnWidthClass = getColumnWidthClass(column.width)
    const flexDirection = orientation === "horizontal" ? "flex-row" : "flex-col"

    const flexLayout = column.flexLayout || "items-start justify-start"
    const flexGap = column.gap || "0"

    const itemsMatch = flexLayout.match(/items-([a-z-]+)/)
    const justifyMatch = flexLayout.match(/justify-([a-z-]+)/)
    const itemsValue = itemsMatch ? itemsMatch[1] : "start"
    const justifyValue = justifyMatch ? justifyMatch[1] : "start"

    const flexClasses = `flex ${flexDirection} items-${itemsValue} justify-${justifyValue} gap-${flexGap}`

    columnsCode += `${indent}<div className="${columnWidthClass} p-2">\n`
    columnsCode += `${indent}  <div className="${flexClasses} p-4">\n`

    if (column.components && column.components.length > 0) {
      column.components.forEach((component) => {
        if (!component) return
        columnsCode += `${indent}    ${renderComponent(component, indentLevel + 4)}\n`
      })
    }

    if (column.childColumns && column.childColumns.length > 0) {
      columnsCode += generateColumnsCode(column.childColumns, indentLevel + 4)
    }

    columnsCode += `${indent}  </div>\n`
    columnsCode += `${indent}</div>\n`
  })

  return columnsCode
}

function generateComponentCode(layout: GridLayout): string {
  let code = `    <div style={{ width: "${layout.containerWidth || "100%"}", margin: "0 auto" }}>\n`
  code += generateColumnsCode(layout.columns, 6)
  code += `\n    </div>`
  return code
}

function getColumnWidthClass(width = 12): string {
  const widthMap: Record<number, string> = {
    1: "w-1/12",
    2: "w-2/12",
    3: "w-3/12",
    4: "w-4/12",
    5: "w-5/12",
    6: "w-6/12",
    7: "w-7/12",
    8: "w-8/12",
    9: "w-9/12",
    10: "w-10/12",
    11: "w-11/12",
    12: "w-full",
  }
  return widthMap[width] || "w-full"
}

function renderComponent(component: ComponentData, indentLevel = 0): string {
  if (!component) return ""
  const { type, props = {} } = component
  const indent = " ".repeat(indentLevel)

  switch (type) {
    case "button":
      return `<Button${renderProps(props)}>${props.text || "Button"}</Button>`
    case "input":
      return `<Input${renderProps(props)} />`
    case "text":
      const Element = props.element || "p"
      return `<${Element}${renderProps(props)}>${props.text || (Element === "p" ? "Paragraph text" : `${Element.toUpperCase()} Heading`)}</${Element}>`
    case "image":
      const imgElement = `<img${renderProps(props)} />`
      return props.link
        ? `<a href="${props.link}" target="${props.linkTarget || "_self"}"${props.linkTarget === "_blank" ? ' rel="noopener noreferrer"' : ""}>${imgElement}</a>`
        : imgElement
    case "div":
      return `<div${renderProps(props)}>${props.text || "Div Container"}</div>`
    case "nested-column":
      return `<div className="nested-column-container">Nested Column</div>`
    case "hero-title":
      return `<h1 className="${props.className || ""}" style={{color: "${props.color || "#000000"}", textAlign: "${props.textAlign || "center"}", fontSize: "${props.fontSize || "3.5rem"}", fontWeight: "${props.fontWeight || "bold"}"}}>${props.text || "Hero Title"}</h1>`

    case "hero-subtitle":
      return `<p className="${props.className || ""}" style={{color: "${props.color || "#666666"}", textAlign: "${props.textAlign || "center"}", fontSize: "${props.fontSize || "1.25rem"}", fontWeight: "${props.fontWeight || "normal"}", marginTop: "${props.marginTop || "1rem"}"}}>${props.text || "Hero subtitle description"}</p>`

    case "text-rotate":
      const texts = props.texts || ["work!", "fancy ✽", "right", "fast", "fun", "rock", "🕶️🕶️🕶️"]
      return `<div className="${props.className || ""}">
    <div className="flex items-center justify-center">
      <span className="mr-2" style={{color: "${props.prefixColor || "#000000"}", fontSize: "${props.fontSize || "2rem"}", fontWeight: "${props.fontWeight || "normal"}"}}>${props.prefix || "Make it "}</span>
      <TextRotate
        texts={${JSON.stringify(texts)}}
        mainClassName="px-3 py-2 rounded-lg overflow-hidden justify-center"
        style={{backgroundColor: "${props.backgroundColor || "#ff5941"}", color: "${props.textColor || "#ffffff"}", fontSize: "${props.fontSize || "2rem"}"}}
        staggerFrom="${props.staggerFrom || "last"}"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-120%" }}
        staggerDuration={${props.staggerDuration || 0.025}}
        splitLevelClassName="overflow-hidden pb-1"
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        rotationInterval={${props.rotationInterval || 2000}}
      />
    </div>
  </div>`

    case "hero-section":
      return `<section className="${props.className || ""}" style={{backgroundColor: "${props.backgroundColor || "#ffffff"}", minHeight: "${props.minHeight || "500px"}", display: "flex", alignItems: "${props.alignItems || "center"}", justifyContent: "${props.justifyContent || "center"}", textAlign: "${props.textAlign || "center"}"}}>
    <div className="max-w-4xl mx-auto">
      ${props.content || "Hero Section Content"}
    </div>
  </section>`
    case "gooey-text":
      const gooeyTexts = props.texts || ["Design", "Engineering", "Is", "Awesome"]
      return `<div className="h-[200px] flex items-center justify-center ${props.className || ""}">
    <GooeyText
      texts={${JSON.stringify(gooeyTexts)}}
      morphTime={${props.morphTime || 1}}
      cooldownTime={${props.cooldownTime || 0.25}}
      className="${props.gooeyClassName || "font-bold"}"
      textClassName="${props.textClassName || ""}"
    />
  </div>`

    case "reveal-image-list": {
      // If the user hasn’t customised items, use the component defaults.
      // Otherwise build the minimal props needed.
      const listProps: string[] = []

      if (props.title) listProps.push(`title="${props.title}"`)
      if (props.className) listProps.push(`className="${props.className}"`)

      // When no custom items are supplied we rely on RevealImageList’s defaults.
      if (Array.isArray(props.items) && props.items.length) {
        listProps.push(`items={${JSON.stringify(props.items)}}`)
      }

      return `<RevealImageList ${listProps.join(" ")} />`
    }
    case "navbar-menu":
      return `<${getNavbarComponentName(component.id)} />`
    case "gradient-headline":
      return `<GradientHeadline text="${props.text || "Gradient Headline"}" fromColor="${
        props.fromColor || "from-blue-500"
      }" toColor="${props.toColor || "to-cyan-500"}" element="${
        props.element || "h2"
      }" className="${props.className || "text-4xl font-bold"}" />`

    case "product-card":
      const originalPriceProp = props.originalPrice ? ` originalPrice={${props.originalPrice}}` : ""
      const productCardElement = `<ProductCard imageUrl="${props.imageUrl || ""}" productName="${
        props.productName || "Cool Product"
      }" price={${props.price || 99.99}}${originalPriceProp} rating={${props.rating || 4.5}} className="${
        props.className || ""
      }" />`

      return props.productLink
        ? `<a href="${props.productLink}" target="${props.linkTarget || "_self"}"${props.linkTarget === "_blank" ? ' rel="noopener noreferrer"' : ""}>${productCardElement}</a>`
        : productCardElement

    case "masonry-gallery":
      const imagesProp = props.images ? `images={${JSON.stringify(props.images)}}` : ""
      return `<MasonryGallery ${imagesProp} columns={${props.columns || 3}} gap={${
        props.gap || 4
      }} className="${props.className || ""}" />`
    default:
      return `<div>Unknown component: ${type}</div>`
  }
}

function renderProps(props: Record<string, any> = {}): string {
  let propsString = ""

  // Handle className
  if (props.className) {
    propsString += ` className="${props.className}"`
  }

  // Handle component-specific props
  switch (true) {
    case "variant" in props:
      propsString += ` variant="${props.variant}"`
      break
    case "size" in props:
      propsString += ` size="${props.size}"`
      break
    case "placeholder" in props:
      propsString += ` placeholder="${props.placeholder}"`
      break
    case "type" in props && props.type !== "div":
      propsString += ` type="${props.type}"`
      break
  }

  // Handle image-specific props
  if ("src" in props) {
    propsString += ` src="${props.src}"`
  }
  if ("alt" in props) {
    propsString += ` alt="${props.alt}"`
  }

  // Handle style props
  const styleProps = ["width", "height", "backgroundColor", "padding", "borderRadius", "border", "fontSize"]
  const hasStyleProps = styleProps.some((prop) => prop in props)

  if (hasStyleProps) {
    propsString += ` style={{`
    let styleString = ""

    styleProps.forEach((prop) => {
      if (prop in props) {
        // Convert kebab-case to camelCase for React style props
        const camelCaseProp = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
        styleString += `${camelCaseProp}: "${props[prop]}", `
      }
    })

    propsString += styleString.slice(0, -2) // Remove trailing comma and space
    propsString += `}}`
  }

  return propsString
}

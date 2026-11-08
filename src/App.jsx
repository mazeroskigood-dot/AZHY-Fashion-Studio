
import React, { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import "./Style.css";

const initialProducts = [
  { id: 1, name: "Essential Oversized T-Shirt", category: "T-Shirts", price: 35, color: "#d8cbb5", stock: 42 },
  { id: 2, name: "Classic Tailored Jacket", category: "Jackets", price: 120, color: "#252525", stock: 18 },
  { id: 3, name: "Premium Wide Leg Pants", category: "Pants", price: 75, color: "#77736b", stock: 27 },
  { id: 4, name: "Modern Summer Dress", category: "Dresses", price: 95, color: "#c69d9d", stock: 13 },
];

const fabrics = [
  { name: "Cotton", roughness: 0.9 },
  { name: "Silk", roughness: 0.25 },
  { name: "Denim", roughness: 0.8 },
  { name: "Linen", roughness: 1 },
  { name: "Leather", roughness: 0.35 },
  { name: "Wool", roughness: 1 },
];

const colors = [
  "#171717", "#f4f0e8", "#c6a15b", "#8b2929",
  "#243b53", "#65745b", "#b7a19b", "#77736b",
  "#d9c6a5", "#ffffff", "#6d536e", "#d28b50",
];

function GarmentModel({ garment, color, fabric, sleeve, collar, pockets }) {
  const material = useMemo(
    () => ({
      color,
      roughness: fabrics.find((item) => item.name === fabric)?.roughness ?? 0.8,
      metalness: fabric === "Leather" ? 0.12 : 0,
    }),
    [color, fabric]
  );

  const cloth = (position, scale, geometry = "box") => (
    <mesh position={position} castShadow receiveShadow>
      {geometry === "cylinder" ? (
        <cylinderGeometry args={[scale[0], scale[1], scale[2], 32]} />
      ) : (
        <boxGeometry args={scale} />
      )}
      <meshStandardMaterial {...material} />
    </mesh>
  );

  if (garment === "Pants") {
    return (
      <group position={[0, -0.15, 0]}>
        {cloth([0, 0.48, 0], [0.9, 0.55, 0.3])}
        {cloth([-0.24, -0.35, 0], [0.37, 1.15, 0.32])}
        {cloth([0.24, -0.35, 0], [0.37, 1.15, 0.32])}
        {cloth([0, 0.75, 0], [0.92, 0.12, 0.34])}
        {pockets && cloth([-0.25, 0.45, 0.17], [0.22, 0.2, 0.025])}
        {pockets && cloth([0.25, 0.45, 0.17], [0.22, 0.2, 0.025])}
      </group>
    );
  }

  if (garment === "Dress") {
    return (
      <group>
        {cloth([0, 0.65, 0], [0.65, 0.85, 0.3])}
        <mesh position={[0, -0.35, 0]} castShadow>
          <cylinderGeometry args={[0.95, 1.25, 1.4, 48, 1, false]} />
          <meshStandardMaterial {...material} side={2} />
        </mesh>
        {cloth([0, 1.15, 0], [0.38, 0.12, 0.34])}
        {collar !== "None" && cloth([0, 1.22, 0.17], [0.5, 0.08, 0.08])}
      </group>
    );
  }

  if (garment === "Jacket") {
    return (
      <group>
        {cloth([0, 0.3, 0], [1.05, 1.35, 0.42])}
        {cloth([-0.72, 0.28, 0], [sleeve === "Short" ? 0.3 : 0.34, sleeve === "Short" ? 0.55 : 0.85, 0.35])}
        {cloth([0.72, 0.28, 0], [sleeve === "Short" ? 0.3 : 0.34, sleeve === "Short" ? 0.55 : 0.85, 0.35])}
        {cloth([0, -0.43, 0], [1.06, 0.1, 0.43])}
        {collar !== "None" && cloth([0, 0.98, 0.23], [0.48, 0.2, 0.12])}
        {pockets && cloth([-0.3, 0.15, 0.23], [0.25, 0.25, 0.04])}
        {pockets && cloth([0.3, 0.15, 0.23], [0.25, 0.25, 0.04])}
      </group>
    );
  }

  return (
    <group>
      {cloth([0, 0.3, 0], [1.05, 1.35, 0.38])}
      {cloth([-0.72, 0.28, 0], [0.32, sleeve === "Short" ? 0.48 : 0.85, 0.34])}
      {cloth([0.72, 0.28, 0], [0.32, sleeve === "Short" ? 0.48 : 0.85, 0.34])}
      {cloth([0, -0.43, 0], [1.05, 0.1, 0.39])}
      {collar !== "None" && cloth([0, 0.98, 0.2], [0.48, 0.18, 0.12])}
      {pockets && cloth([0.3, 0.2, 0.2], [0.25, 0.25, 0.04])}
    </group>
  );
}

function Studio({ garment, setGarment, color, setColor, fabric, setFabric }) {
  const [sleeve, setSleeve] = useState("Long");
  const [collar, setCollar] = useState("Classic");
  const [pockets, setPockets] = useState(true);

  return (
    <div className="studio-layout">
      <section className="studio-preview">
        <div className="studio-preview-top">
          <div>
            <span className="eyebrow">3D DESIGN WORKSPACE</span>
            <h2>Fashion Studio</h2>
          </div>
          <span className="live-label">● LIVE PREVIEW</span>
        </div>

        <div className="canvas-area">
          <Canvas shadows camera={{ position: [3, 2.2, 4], fov: 38 }}>
            <ambientLight intensity={1.1} />
            <directionalLight
              position={[4, 6, 5]}
              intensity={2}
              castShadow
            />
            <Environment preset="studio" />
            <group position={[0, 0, 0]}>
              <GarmentModel
                garment={garment}
                color={color}
                fabric={fabric}
                sleeve={sleeve}
                collar={collar}
                pockets={pockets}
              />
            </group>
            <ContactShadows
              position={[0, -1.25, 0]}
              opacity={0.3}
              scale={5}
              blur={2}
            />
            <OrbitControls
              enablePan={false}
              minDistance={3}
              maxDistance={7}
            />
          </Canvas>
          <div className="canvas-hint">Drag to rotate · Scroll to zoom</div>
        </div>

        <div className="preview-footer">
          <span>AZHY 3D GARMENT ENGINE</span>
          <span>360° VIEW</span>
        </div>
      </section>

      <aside className="studio-controls">
        <div className="control-heading">
          <span className="eyebrow">CUSTOMIZE</span>
          <h3>Design details</h3>
        </div>

        <label className="field-label">Garment type</label>
        <div className="garment-options">
          {["T-Shirt", "Jacket", "Pants", "Dress"].map((item) => (
            <button
              key={item}
              className={garment === item ? "choice active" : "choice"}
              onClick={() => setGarment(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="field-label">Color palette</label>
        <div className="color-options">
          {colors.map((item) => (
            <button
              key={item}
              aria-label={`Choose ${item}`}
              className={color === item ? "color-dot selected" : "color-dot"}
              style={{ background: item }}
              onClick={() => setColor(item)}
            />
          ))}
        </div>

        <label className="field-label">Fabric material</label>
        <select
          className="studio-select"
          value={fabric}
          onChange={(event) => setFabric(event.target.value)}
        >
          {fabrics.map((item) => (
            <option key={item.name}>{item.name}</option>
          ))}
        </select>

        <label className="field-label">Sleeve length</label>
        <div className="garment-options">
          {["Short", "Long"].map((item) => (
            <button
              key={item}
              className={sleeve === item ? "choice active" : "choice"}
              onClick={() => setSleeve(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="field-label">Collar style</label>
        <select
          className="studio-select"
          value={collar}
          onChange={(event) => setCollar(event.target.value)}
        >
          <option>Classic</option>
          <option>Modern</option>
          <option>None</option>
        </select>

        <label className="toggle-row">
          <span>Pockets</span>
          <input
            type="checkbox"
            checked={pockets}
            onChange={(event) => setPockets(event.target.checked)}
          />
        </label>

        <button
          className="primary-button full-button"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("azhy-save-design", {
                detail: { garment, color, fabric, sleeve, collar, pockets },
              })
            )
          }
        >
          Save design
        </button>
      </aside>
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [garment, setGarment] = useState("T-Shirt");
  const [color, setColor] = useState("#d8cbb5");
  const [fabric, setFabric] = useState("Cotton");
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("azhy-products");
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });
  const [designs, setDesigns] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("azhy-designs") || "[]");
    } catch {
      return [];
    }
  });
  const [search, setSearch] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "T-Shirts",
    price: "",
    stock: "",
    color: "#c6a15b",
  });

  React.useEffect(() => {
    const saveDesign = (event) => {
      const next = [
        {
          id: Date.now(),
          name: `${event.detail.garment} Design`,
          date: new Date().toLocaleDateString(),
          ...event.detail,
        },
        ...designs,
      ];
      setDesigns(next);
      localStorage.setItem("azhy-designs", JSON.stringify(next));
    };

    window.addEventListener("azhy-save-design", saveDesign);
    return () => window.removeEventListener("azhy-save-design", saveDesign);
  }, [designs]);

  const saveProducts = (next) => {
    setProducts(next);
    localStorage.setItem("azhy-products", JSON.stringify(next));
  };

  const navGroups = [
    {
      title: "WORKSPACE",
      items: [
        ["Dashboard", "⌂"],
        ["3D Studio", "◇"],
        ["Collections", "▦"],
        ["Products", "◈"],
      ],
    },
    {
      title: "BUSINESS",
      items: [
        ["Orders", "▤"],
        ["Customers", "♙"],
        ["Inventory", "▥"],
        ["Analytics", "⌁"],
      ],
    },
    {
      title: "PREFERENCES",
      items: [["Settings", "⚙"]],
    },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const pageTitle = activePage === "3D Studio" ? "Fashion Studio" : activePage;

  function addProduct(event) {
    event.preventDefault();
    if (!newProduct.name.trim()) return;

    const next = [
      {
        ...newProduct,
        id: Date.now(),
        price: Number(newProduct.price) || 0,
        stock: Number(newProduct.stock) || 0,
      },
      ...products,
    ];

    saveProducts(next);
    setNewProduct({
      name: "",
      category: "T-Shirts",
      price: "",
      stock: "",
      color: "#c6a15b",
    });
    setShowProductForm(false);
  }

  function deleteProduct(id) {
    saveProducts(products.filter((product) => product.id !== id));
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-symbol">A</div>
          <div>
            <h1>AZHY</h1>
            <span>FASHION STUDIO</span>
          </div>
        </div>

        <div className="workspace-label">MAIN MENU</div>

        {navGroups.map((group) => (
          <div className="nav-group" key={group.title}>
            <div className="nav-caption">{group.title}</div>
            {group.items.map(([name, icon]) => (
              <button
                key={name}
                className={activePage === name ? "nav-item active" : "nav-item"}
                onClick={() => setActivePage(name)}
              >
                <span className="nav-icon">{icon}</span>
                <span>{name}</span>
                {name === "3D Studio" && <span className="nav-new">3D</span>}
              </button>
            ))}
          </div>
        ))}

        <div className="sidebar-bottom">
          <div className="profile-avatar">A</div>
          <div className="profile-info">
            <strong>Studio Owner</strong>
            <span>Administrator</span>
          </div>
          <span className="profile-menu">•••</span>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            <span>AZHY</span>
            <span className="breadcrumb-separator">/</span>
            <strong>{pageTitle}</strong>
          </div>
          <div className="topbar-actions">
            <span className="topbar-date">
              {new Date().toLocaleDateString()}
            </span>
            <button className="notification-button" aria-label="Notifications">
              ♧
            </button>
            <div className="topbar-avatar">A</div>
          </div>
        </header>

        <div className="page-content">
          {activePage === "Dashboard" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">YOUR CREATIVE BUSINESS</span>
                  <h2>Welcome to AZHY Studio</h2>
                  <p>Your fashion business, beautifully organized.</p>
                </div>
                <button
                  className="primary-button"
                  onClick={() => setActivePage("3D Studio")}
                >
                  + Create new design
                </button>
              </div>

              <div className="stats-grid">
                {[
                  ["Total Products", products.length, "In your catalog", "◈"],
                  ["Saved Designs", designs.length, "Your creative ideas", "◇"],
                  ["Total Stock", products.reduce((sum, p) => sum + p.stock, 0), "Units available", "▥"],
                  ["Categories", new Set(products.map((p) => p.category)).size, "Product categories", "▦"],
                ].map(([label, value, note, icon]) => (
                  <div className="stat-card" key={label}>
                    <div className="stat-top">
                      <span>{label}</span>
                      <span className="stat-icon">{icon}</span>
                    </div>
                    <strong>{value}</strong>
                    <small>{note}</small>
                  </div>
                ))}
              </div>

              <section className="welcome-banner">
                <div>
                  <span className="eyebrow">DESIGN WITHOUT LIMITS</span>
                  <h2>Turn your imagination<br />into fashion.</h2>
                  <p>Create, customize and organize your next collection.</p>
                  <button
                    className="light-button"
                    onClick={() => setActivePage("3D Studio")}
                  >
                    Open 3D Studio →
                  </button>
                </div>
                <div className="banner-decoration">
                  <div className="banner-circle">A</div>
                  <span>AZHY<br />ATELIER</span>
                </div>
              </section>

              <div className="section-heading">
                <div>
                  <span className="eyebrow">YOUR CATALOG</span>
                  <h3>Recent products</h3>
                </div>
                <button className="text-button" onClick={() => setActivePage("Products")}>
                  View all →
                </button>
              </div>

              <div className="product-grid">
                {products.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}

          {activePage === "3D Studio" && (
            <div>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">CREATE YOUR NEXT COLLECTION</span>
                  <h2>3D Fashion Designer</h2>
                  <p>Customize your garment and explore your design.</p>
                </div>
              </div>
              <Studio
                garment={garment}
                setGarment={setGarment}
                color={color}
                setColor={setColor}
                fabric={fabric}
                setFabric={setFabric}
              />
            </div>
          )}

          {activePage === "Products" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">PRODUCT MANAGEMENT</span>
                  <h2>Products</h2>
                  <p>Manage your fashion catalog.</p>
                </div>
                <button
                  className="primary-button"
                  onClick={() => setShowProductForm(!showProductForm)}
                >
                  + Add product
                </button>
              </div>

              {showProductForm && (
                <form className="product-form" onSubmit={addProduct}>
                  <h3>Add a new product</h3>
                  <input
                    required
                    placeholder="Product name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    {["T-Shirts", "Jackets", "Pants", "Dresses", "Accessories"].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Stock quantity"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  />
                  <button className="primary-button" type="submit">Save product</button>
                </form>
              )}

              <div className="table-toolbar">
                <input
                  className="search-input"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <span>{filteredProducts.length} products</span>
              </div>

              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>PRODUCT</th>
                      <th>CATEGORY</th>
                      <th>PRICE</th>
                      <th>STOCK</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="table-product">
                            <span
                              className="product-swatch"
                              style={{ background: product.color }}
                            />
                            <strong>{product.name}</strong>
                          </div>
                        </td>
                        <td>{product.category}</td>
                        <td>${product.price}</td>
                        <td>{product.stock}</td>
                        <td>
                          <button
                            className="delete-button"
                            onClick={() => deleteProduct(product.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activePage === "Collections" && (
            <PageSection
              eyebrow="CREATIVE LIBRARY"
              title="Collections"
              description="Your saved designs and creative projects."
            >
              {designs.length === 0 ? (
                <EmptyState
                  title="No saved designs yet"
                  description="Start creating in the 3D Studio and save your first design."
                  action={() => setActivePage("3D Studio")}
                />
              ) : (
                <div className="product-grid">
                  {designs.map((design) => (
                    <div className="design-card" key={design.id}>
                      <div
                        className="design-color"
                        style={{ background: design.color }}
                      />
                      <div className="design-card-info">
                        <strong>{design.name}</strong>
                        <span>{design.fabric} · {design.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </PageSection>
          )}

          {activePage === "Orders" && (
            <PageSection
              eyebrow="SALES MANAGEMENT"
              title="Orders"
              description="Track and organize customer orders."
            >
              <EmptyState
                title="No orders yet"
                description="Your orders will appear here when you add an order management workflow."
              />
            </PageSection>
          )}

          {activePage === "Customers" && (
            <PageSection
              eyebrow="CUSTOMER RELATIONSHIPS"
              title="Customers"
              description="Your customer directory."
            >
              <EmptyState
                title="Your customer list is empty"
                description="Customer records can be added when customer management is connected."
              />
            </PageSection>
          )}

          {activePage === "Inventory" && (
            <PageSection
              eyebrow="STOCK CONTROL"
              title="Inventory"
              description="Monitor product quantities and availability."
            >
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr><th>PRODUCT</th><th>CATEGORY</th><th>QUANTITY</th><th>STATUS</th></tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>{product.stock}</td>
                        <td>
                          <span className={product.stock < 15 ? "status low" : "status available"}>
                            {product.stock < 15 ? "Low stock" : "Available"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </PageSection>
          )}

          {activePage === "Analytics" && (
            <PageSection
              eyebrow="BUSINESS OVERVIEW"
              title="Analytics"
              description="A quick overview of your current catalog."
            >
              <div className="stats-grid">
                <div className="stat-card"><span>Total products</span><strong>{products.length}</strong><small>Catalog items</small></div>
                <div className="stat-card"><span>Saved designs</span><strong>{designs.length}</strong><small>Creative projects</small></div>
                <div className="stat-card"><span>Total stock</span><strong>{products.reduce((sum, p) => sum + p.stock, 0)}</strong><small>Units available</small></div>
                <div className="stat-card"><span>Catalog value</span><strong>${products.reduce((sum, p) => sum + p.price * p.stock, 0).toLocaleString()}</strong><small>Estimated retail value</small></div>
              </div>
            </PageSection>
          )}

          {activePage === "Settings" && (
            <PageSection
              eyebrow="STUDIO PREFERENCES"
              title="Settings"
              description="Basic information about your workspace."
            >
              <div className="settings-card">
                <div className="settings-mark">A</div>
                <div>
                  <h3>AZHY Fashion Studio</h3>
                  <p>Premium fashion design workspace</p>
                  <span className="status available">Workspace active</span>
                </div>
              </div>
            </PageSection>
          )}
        </div>

        <footer className="app-footer">
          <span>© {new Date().getFullYear()} AZHY Fashion Studio</span>
          <span>Designed for creativity.</span>
        </footer>
      </main>
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div
        className="product-art"
        style={{ background: `linear-gradient(145deg, ${product.color}55, #eeeae2)` }}
      >
        <div className="product-art-shape" style={{ background: product.color }} />
        <span className="product-category">{product.category}</span>
      </div>
      <div className="product-card-info">
        <strong>{product.name}</strong>
        <div>
          <span>${product.price}</span>
          <small>{product.stock} in stock</small>
        </div>
      </div>
    </article>
  );
}

function PageSection({ eyebrow, title, description, children }) {
  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">◇</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && (
        <button className="primary-button" onClick={action}>
          Open 3D Studio
        </button>
      )}
    </div>
  );
}

export default App;

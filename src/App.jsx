
import React, { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import "./App.css";

type Category = "All" | "Men" | "Women" | "Kids";
type Garment = "tshirt" | "hoodie" | "pants" | "dress" | "jacket";

type Product = {
  id: number;
  name: string;
  category: Exclude<Category, "All">;
  type: Garment;
  price: number;
  color: string;
  fabric: string;
};

const initialProducts: Product[] = [
  { id: 1, name: "Premium Oversized Tee", category: "Men", type: "tshirt", price: 45, color: "#e8e0d2", fabric: "Cotton" },
  { id: 2, name: "Luxury Street Hoodie", category: "Men", type: "hoodie", price: 89, color: "#222222", fabric: "Fleece" },
  { id: 3, name: "Elegant Summer Dress", category: "Women", type: "dress", price: 120, color: "#bd8990", fabric: "Silk" },
  { id: 4, name: "Classic Tailored Pants", category: "Men", type: "pants", price: 75, color: "#343c48", fabric: "Wool" },
  { id: 5, name: "Modern Fashion Jacket", category: "Women", type: "jacket", price: 145, color: "#b6a48b", fabric: "Leather" },
  { id: 6, name: "Kids Essential Tee", category: "Kids", type: "tshirt", price: 29, color: "#8ca8a0", fabric: "Cotton" }
];

const fabrics = [
  { name: "Cotton", roughness: 0.9 },
  { name: "Silk", roughness: 0.25 },
  { name: "Denim", roughness: 0.85 },
  { name: "Leather", roughness: 0.4 },
  { name: "Wool", roughness: 1 },
  { name: "Linen", roughness: 0.95 },
  { name: "Satin", roughness: 0.2 }
];

const colors = [
  "#111111", "#ffffff", "#d8c4a5", "#a52f36",
  "#283c5b", "#6d826d", "#c18c9c", "#888888",
  "#e0b65d", "#70513e", "#c8d4dc", "#673c70"
];

function GarmentModel({
  type,
  color,
  fabric
}: {
  type: Garment;
  color: string;
  fabric: string;
}) {
  const roughness = fabrics.find(f => f.name === fabric)?.roughness ?? 0.75;

  const material = useMemo(
    () => ({ color, roughness, metalness: 0.02 }),
    [color, roughness]
  );

  return (
    <group position={[0, -0.05, 0]}>
      {type === "tshirt" && (
        <group>
          <mesh position={[0, 0.45, 0]} castShadow material={undefined}>
            <boxGeometry args={[0.95, 1.15, 0.22]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <mesh position={[-0.62, 0.75, 0]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.42, 0.42, 0.22]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <mesh position={[0.62, 0.75, 0]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.42, 0.42, 0.22]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <mesh position={[0, 1.06, 0.02]}>
            <torusGeometry args={[0.16, 0.035, 12, 48]} />
            <meshStandardMaterial color="#777777" roughness={0.8} />
          </mesh>
        </group>
      )}

      {type === "hoodie" && (
        <group>
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[1.05, 1.15, 0.34]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <mesh position={[0, 1.05, -0.02]}>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <mesh position={[-0.66, 0.65, 0]}>
            <boxGeometry args={[0.34, 0.85, 0.3]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <mesh position={[0.66, 0.65, 0]}>
            <boxGeometry args={[0.34, 0.85, 0.3]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <mesh position={[0, 0.15, 0.19]}>
            <boxGeometry args={[0.65, 0.23, 0.04]} />
            <meshStandardMaterial color="#777777" {...material} />
          </mesh>
        </group>
      )}

      {type === "pants" && (
        <group>
          <mesh position={[0, 0.75, 0]}>
            <boxGeometry args={[0.85, 0.38, 0.2]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <mesh position={[-0.23, 0.05, 0]}>
            <boxGeometry args={[0.37, 1.15, 0.22]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <mesh position={[0.23, 0.05, 0]}>
            <boxGeometry args={[0.37, 1.15, 0.22]} />
            <meshStandardMaterial {...material} />
          </mesh>
        </group>
      )}

      {type === "dress" && (
        <group>
          <mesh position={[0, 0.65, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.65, 48]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.32, 0.85, 1.15, 64, 1, false]} />
            <meshStandardMaterial {...material} side={2} />
          </mesh>
          <mesh position={[-0.4, 0.85, 0]}>
            <boxGeometry args={[0.22, 0.65, 0.2]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <mesh position={[0.4, 0.85, 0]}>
            <boxGeometry args={[0.22, 0.65, 0.2]} />
            <meshStandardMaterial {...material} />
          </mesh>
        </group>
      )}

      {type === "jacket" && (
        <group>
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[1.05, 1.2, 0.3]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <mesh position={[-0.65, 0.55, 0]}>
            <boxGeometry args={[0.32, 0.95, 0.28]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <mesh position={[0.65, 0.55, 0]}>
            <boxGeometry args={[0.32, 0.95, 0.28]} />
            <meshStandardMaterial {...material} />
          </mesh>
          <mesh position={[0, 0.35, 0.16]}>
            <boxGeometry args={[0.035, 1.1, 0.025]} />
            <meshStandardMaterial color="#d0b06c" metalness={0.7} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function FashionViewer({
  type,
  color,
  fabric
}: {
  type: Garment;
  color: string;
  fabric: string;
}) {
  return (
    <div className="fashion-canvas">
      <Canvas shadows camera={{ position: [3, 2.5, 4], fov: 38 }}>
        <color attach="background" args={["#f0eee9"]} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 6, 5]} intensity={2} castShadow />
        <spotLight position={[-4, 4, -3]} intensity={1} />
        <GarmentModel type={type} color={color} fabric={fabric} />
        <ContactShadows position={[0, -1.1, 0]} opacity={0.3} scale={5} blur={2} />
        <Environment preset="studio" />
        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={8}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
      <div className="viewer-label">3D LIVE PREVIEW</div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [category, setCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(initialProducts);
  const [selectedType, setSelectedType] = useState<Garment>("tshirt");
  const [selectedColor, setSelectedColor] = useState("#d8c4a5");
  const [selectedFabric, setSelectedFabric] = useState("Cotton");
  const [designName, setDesignName] = useState("My New Collection");
  const [savedDesigns, setSavedDesigns] = useState<string[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("50");

  const filteredProducts = products.filter(product => {
    const matchesCategory = category === "All" || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalRevenue = products.reduce((sum, product) => sum + product.price, 0);

  const saveDesign = () => {
    if (!designName.trim()) return;
    setSavedDesigns(previous => [...previous, designName]);
  };

  const addProduct = () => {
    if (!newProductName.trim()) return;

    const product: Product = {
      id: Date.now(),
      name: newProductName,
      category: "Men",
      type: selectedType,
      price: Math.max(0, Number(newProductPrice) || 0),
      color: selectedColor,
      fabric: selectedFabric
    };

    setProducts(previous => [product, ...previous]);
    setNewProductName("");
    setNewProductPrice("50");
    setShowAddProduct(false);
  };

  const menuItems = [
    { name: "Dashboard", icon: "◫" },
    { name: "3D Studio", icon: "✧" },
    { name: "Collections", icon: "▤" },
    { name: "Products", icon: "◇" },
    { name: "Orders", icon: "▣" },
    { name: "Customers", icon: "♙" },
    { name: "Inventory", icon: "▥" },
    { name: "Analytics", icon: "▰" },
    { name: "Settings", icon: "⚙" }
  ];

  return (
    <div className="azhy-app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">A</div>
          <div>
            <h2>AZHY</h2>
            <span>FASHION STUDIO</span>
          </div>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.name}
              className={`nav-item ${activeTab === item.name ? "active" : ""}`}
              onClick={() => setActiveTab(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
              {item.name === "Orders" && <span className="nav-count">3</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">✦</div>
            <strong>AZHY PRO</strong>
            <p>Unlock your creative potential.</p>
            <button onClick={() => setActiveTab("Settings")}>Explore features ↗</button>
          </div>
          <div className="profile">
            <div className="avatar">A</div>
            <div>
              <strong>Studio Owner</strong>
              <span>Administrator</span>
            </div>
            <span className="profile-dots">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>AZHY</span>
            <span>/</span>
            <strong>{activeTab}</strong>
          </div>
          <div className="topbar-actions">
            <span className="system-status"><i /> Studio Online</span>
            <button className="icon-button" aria-label="Notifications">♧</button>
            <button className="language-button">EN / AR</button>
          </div>
        </header>

        {activeTab === "Dashboard" && (
          <section className="page">
            <div className="welcome-row">
              <div>
                <span className="eyebrow">YOUR CREATIVE WORLD</span>
                <h1>Welcome to <span>AZHY.</span></h1>
                <p>Design beautifully. Create fearlessly. Build your fashion empire.</p>
              </div>
              <button className="gold-button" onClick={() => setActiveTab("3D Studio")}>
                ✦ Create New Design
              </button>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span>Total Products</span>
                <strong>{products.length.toString().padStart(2, "0")}</strong>
                <small>Available in studio</small>
              </div>
              <div className="stat-card">
                <span>Saved Designs</span>
                <strong>{savedDesigns.length.toString().padStart(2, "0")}</strong>
                <small>Your creative library</small>
              </div>
              <div className="stat-card">
                <span>Cart Items</span>
                <strong>{cart.length.toString().padStart(2, "0")}</strong>
                <small>Current shopping cart</small>
              </div>
              <div className="stat-card">
                <span>Product Value</span>
                <strong>${totalRevenue.toLocaleString()}</strong>
                <small>Combined listed prices</small>
              </div>
            </div>

            <div className="section-heading">
              <div>
                <span className="eyebrow">CREATIVE WORKSPACE</span>
                <h2>Explore Your Studio</h2>
              </div>
              <span className="subtle-text">DESIGNED FOR CREATORS</span>
            </div>

            <div className="feature-grid">
              <button className="feature-card studio-feature" onClick={() => setActiveTab("3D Studio")}>
                <div className="feature-symbol">✧</div>
                <span>01 / DESIGN</span>
                <h3>3D Fashion Studio</h3>
                <p>Bring your clothing concepts to life in an interactive 3D workspace.</p>
                <b>Open Studio ↗</b>
              </button>
              <button className="feature-card collection-feature" onClick={() => setActiveTab("Collections")}>
                <div className="feature-symbol">◇</div>
                <span>02 / CURATE</span>
                <h3>Collections</h3>
                <p>Organize your ideas and build your next signature collection.</p>
                <b>Explore Collections ↗</b>
              </button>
              <button className="feature-card product-feature" onClick={() => setActiveTab("Products")}>
                <div className="feature-symbol">▤</div>
                <span>03 / MANAGE</span>
                <h3>Product Library</h3>
                <p>Manage your fashion products, materials and pricing.</p>
                <b>View Products ↗</b>
              </button>
            </div>

            <div className="section-heading">
              <div>
                <span className="eyebrow">LATEST ADDITIONS</span>
                <h2>Featured Products</h2>
              </div>
              <button className="text-button" onClick={() => setActiveTab("Products")}>View All →</button>
            </div>

            <div className="product-grid">
              {products.slice(0, 3).map(product => (
                <ProductCard key={product.id} product={product} onAdd={() => setCart(previous => [...previous, product])} />
              ))}
            </div>
          </section>
        )}

        {activeTab === "3D Studio" && (
          <section className="page">
            <div className="welcome-row">
              <div>
                <span className="eyebrow">DESIGN WITHOUT LIMITS</span>
                <h1>3D <span>Fashion Studio.</span></h1>
                <p>Create, customize and preview your fashion ideas.</p>
              </div>
              <button className="gold-button" onClick={saveDesign}>Save Design ♧</button>
            </div>

            <div className="studio-layout">
              <div className="studio-preview">
                <div className="panel-heading">
                  <div>
                    <strong>Interactive 3D Preview</strong>
                    <span>Rotate and explore your garment</span>
                  </div>
                  <span className="live-tag">● LIVE</span>
                </div>
                <FashionViewer type={selectedType} color={selectedColor} fabric={selectedFabric} />
                <div className="viewer-footer">
                  <span>AZHY 3D ENGINE</span>
                  <span>DRAG TO ROTATE · SCROLL TO ZOOM</span>
                </div>
              </div>

              <div className="design-controls">
                <div className="control-heading">
                  <span className="eyebrow">CUSTOMIZATION</span>
                  <h2>Design Settings</h2>
                </div>

                <label className="field-label">Design Name</label>
                <input className="studio-input" value={designName} onChange={e => setDesignName(e.target.value)} />

                <label className="field-label">Garment Type</label>
                <div className="garment-options">
                  {([
                    ["tshirt", "T-Shirt"],
                    ["hoodie", "Hoodie"],
                    ["pants", "Pants"],
                    ["dress", "Dress"],
                    ["jacket", "Jacket"]
                  ] as [Garment, string][]).map(([type, label]) => (
                    <button key={type} className={selectedType === type ? "garment-option selected" : "garment-option"} onClick={() => setSelectedType(type)}>
                      {label}
                    </button>
                  ))}
                </div>

                <label className="field-label">Color Palette</label>
                <div className="color-palette">
                  {colors.map(color => (
                    <button
                      key={color}
                      aria-label={`Select ${color}`}
                      className={selectedColor === color ? "color-swatch selected" : "color-swatch"}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>

                <label className="field-label">Fabric Material</label>
                <select className="studio-input" value={selectedFabric} onChange={e => setSelectedFabric(e.target.value)}>
                  {fabrics.map(fabric => <option key={fabric.name}>{fabric.name}</option>)}
                </select>

                <div className="material-preview">
                  <span>SELECTED MATERIAL</span>
                  <strong>{selectedFabric}</strong>
                  <p>Material appearance updates with your selection.</p>
                </div>

                <button className="gold-button full-button" onClick={saveDesign}>Save My Design ✦</button>
                {savedDesigns.includes(designName) && (
                  <p className="success-message">Design saved in this session.</p>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === "Products" && (
          <section className="page">
            <div className="welcome-row">
              <div>
                <span className="eyebrow">YOUR FASHION CATALOG</span>
                <h1>Product <span>Library.</span></h1>
                <p>Discover and manage your fashion products.</p>
              </div>
              <button className="gold-button" onClick={() => setShowAddProduct(!showAddProduct)}>+ Add Product</button>
            </div>

            {showAddProduct && (
              <div className="add-product-panel">
                <h3>Create New Product</h3>
                <input className="studio-input" placeholder="Product name" value={newProductName} onChange={e => setNewProductName(e.target.value)} />
                <input className="studio-input" type="number" placeholder="Price" value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} />
                <button className="gold-button" onClick={addProduct}>Add to Library</button>
              </div>
            )}

            <div className="product-toolbar">
              <input className="search-input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
              <div className="category-filters">
                {(["All", "Men", "Women", "Kids"] as Category[]).map(item => (
                  <button key={item} className={category === item ? "filter-button active" : "filter-button"} onClick={() => setCategory(item)}>{item}</button>
                ))}
              </div>
            </div>

            <div className="product-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAdd={() => setCart(previous => [...previous, product])} />
              ))}
            </div>
            {filteredProducts.length === 0 && <p className="empty-message">No products found.</p>}
          </section>
        )}

        {activeTab === "Collections" && (
          <section className="page">
            <span className="eyebrow">YOUR CREATIVE ARCHIVE</span>
            <h1>My <span>Collections.</span></h1>
            <p className="page-description">Your saved fashion concepts.</p>
            <div className="saved-grid">
              {savedDesigns.map((design, index) => (
                <div className="saved-card" key={`${design}-${index}`}>
                  <span>✧ DESIGN {index + 1}</span>
                  <h3>{design}</h3>
                  <p>Created in AZHY Fashion Studio</p>
                </div>
              ))}
              {savedDesigns.length === 0 && (
                <div className="empty-state">
                  <span>✧</span>
                  <h2>Your creative journey starts here.</h2>
                  <p>Save your first design in the 3D Studio.</p>
                  <button className="gold-button" onClick={() => setActiveTab("3D Studio")}>Start Designing</button>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === "Orders" && (
          <section className="page">
            <span className="eyebrow">COMMERCE MANAGEMENT</span>
            <h1>My <span>Orders.</span></h1>
            <div className="empty-state">
              <span>▣</span>
              <h2>Order Management</h2>
              <p>Your order management workspace is ready for integration.</p>
            </div>
          </section>
        )}

        {activeTab === "Customers" && (
          <section className="page">
            <span className="eyebrow">RELATIONSHIP MANAGEMENT</span>
            <h1>My <span>Customers.</span></h1>
            <div className="empty-state">
              <span>♙</span>
              <h2>Customer Workspace</h2>
              <p>Customer records and profiles will appear here.</p>
            </div>
          </section>
        )}

        {activeTab === "Inventory" && (
          <section className="page">
            <span className="eyebrow">STOCK MANAGEMENT</span>
            <h1>My <span>Inventory.</span></h1>
            <div className="empty-state">
              <span>▥</span>
              <h2>Inventory Workspace</h2>
              <p>Manage your materials and stock in one place.</p>
            </div>
          </section>
        )}

        {activeTab === "Analytics" && (
          <section className="page">
            <span className="eyebrow">BUSINESS INTELLIGENCE</span>
            <h1>Studio <span>Analytics.</span></h1>
            <div className="stats-grid">
              <div className="stat-card"><span>Products</span><strong>{products.length}</strong></div>
              <div className="stat-card"><span>Saved Designs</span><strong>{savedDesigns.length}</strong></div>
              <div className="stat-card"><span>Cart Items</span><strong>{cart.length}</strong></div>
              <div className="stat-card"><span>Catalog Value</span><strong>${totalRevenue}</strong></div>
            </div>
          </section>
        )}

        {activeTab === "Settings" && (
          <section className="page">
            <span className="eyebrow">PERSONALIZE YOUR WORKSPACE</span>
            <h1>Studio <span>Settings.</span></h1>
            <div className="settings-card">
              <h3>AZHY Fashion Studio</h3>
              <p>Version 1.0 · Creative Workspace</p>
              <p>Interface language: English</p>
              <p>Theme: Luxury Dark</p>
            </div>
          </section>
        )}

        <footer className="footer">
          <span>© 2026 AZHY FASHION STUDIO</span>
          <span>CRAFTED FOR THE FUTURE OF FASHION ✦</span>
        </footer>
      </main>
    </div>
  );
}

function ProductCard({
  product,
  onAdd
}: {
  product: Product;
  onAdd: () => void;
}) {
  return (
    <article className="product-card">
      <div className="product-visual" style={{ backgroundColor: "#f0eee9" }}>
        <div className="product-silhouette" style={{ backgroundColor: product.color }}>
          <span>{product.type.toUpperCase()}</span>
        </div>
        <span className="product-category">{product.category}</span>
      </div>
      <div className="product-info">
        <span>{product.fabric} COLLECTION</span>
        <h3>{product.name}</h3>
        <div className="product-bottom">
          <strong>${product.price}</strong>
          <button onClick={onAdd}>Add to Cart +</button>
        </div>
      </div>
    </article>
  );
}

export default App;

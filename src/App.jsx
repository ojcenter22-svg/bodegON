import React, { useState, useEffect } from "react";
import Landing from "./landing"; 
import "./style.css";

function ProductCard({ product, bcvRate, customRate, copRate, onDelete, onPrint, onEdit }) {
  const priceBcv = ((product?.price || 0) * bcvRate).toFixed(2);
  const priceCustom = ((product?.price || 0) * customRate).toFixed(2);
  const priceCop = ((product?.price || 0) * copRate).toLocaleString("es-CO", { maximumFractionDigits: 0 });

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(`*Cotización de Producto*\n\n*Producto:* ${product?.name || "N/A"}\n*Precio Base:* $${(product?.price || 0).toFixed(2)}\n*Detalles:* ${product?.specs || "N/A"}\n\n*Precios:*\n🔹 Tasa BCV: ${priceBcv} Bs.\n🔸 Tasa Pers: ${priceCustom} Bs.\n🇨🇴 Pesos COP: $${priceCop} COP`);
    window.open(`https://api.whatsapp.com/send?text=${message}`, "_blank");
  };

  return (
    <div className="product-card card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "10px" }}>
        <h3 style={{ margin: 0, flex: 1 }}>{product?.name || "Sin nombre"}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <button onClick={() => onDelete(product.id)} className="btn-delete-small">Borrar</button>
          <button onClick={() => onEdit(product)} className="btn-print" style={{ background: "#34495e", color: "#fff", padding: "4px 8px", fontSize: "0.75rem", margin: 0 }}>Editar ✏️</button>
        </div>
      </div>
      <p style={{ margin: "5px 0" }}><strong>Precio Base:</strong> ${(product?.price || 0).toFixed(2)}</p>
      <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "15px" }}>{product?.specs || ""}</p>
      <div className="price-conversion">
        <p><strong>Bs (BCV):</strong> {priceBcv} Bs.</p>
        <p><strong>Bs (Personalizada):</strong> {priceCustom} Bs.</p>
        <p style={{ borderTop: "1px solid #ddd", marginTop: "4px", paddingTop: "4px" }}><strong>Pesos COP:</strong> ${priceCop} COP</p>
      </div>
      <div style={{ display: "flex", gap: "6px", marginTop: "5px" }}>
        <button onClick={handleShareWhatsApp} className="btn-whatsapp" style={{ margin: 0, flex: 2 }}>📲 WhatsApp</button>
        <button onClick={() => onPrint(product)} className="btn-print" style={{ flex: 1 }}>🖨️ Etiqueta</button>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState("landing");
  const [activeTab, setActiveTab] = useState("consulta");
  const [showWelcome, setShowWelcome] = useState(false);
  
  const [bcvRate, setBcvRate] = useState(() => localStorage.getItem("bcvRate") ? parseFloat(localStorage.getItem("bcvRate")) : 40.00);
  const [customRate, setCustomRate] = useState(() => localStorage.getItem("customRate") ? parseFloat(localStorage.getItem("customRate")) : 45.00);
  const [copRate, setCopRate] = useState(() => localStorage.getItem("copRate") ? parseFloat(localStorage.getItem("copRate")) : 4100.00);
  
  const [products, setProducts] = useState(() => localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [{ id: 1, name: "Impresora Térmica 58mm", price: 50.00, specs: "Conexión USB/Bluetooth compatibles." }]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productSpecs, setProductSpecs] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editSpecs, setEditSpecs] = useState("");

  const [isPrintingMode, setIsPrintingMode] = useState(false);
  const [activePrintProduct, setActivePrintProduct] = useState(null);

  const [fiaos, setFiaos] = useState(() => localStorage.getItem("fiaos") ? JSON.parse(localStorage.getItem("fiaos")) : []);
  const [clientName, setClientName] = useState("");
  const [fiaoConcept, setFiaoConcept] = useState("");
  const [fiaoAmount, setFiaoAmount] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");        // Nuevo
  const [address, setAddress] = useState("");    // Nuevo
  const [businessType, setBusinessType] = useState("bodega"); // Nuevo
  const [registeredUsers, setRegisteredUsers] = useState(() => localStorage.getItem("registeredUsers") ? JSON.parse(localStorage.getItem("registeredUsers")) : []);
  const [loadingRate, setLoadingRate] = useState(false);

  // --- EFECTOS Y LÓGICA (Mantén tus useEffects actuales) ---
  useEffect(() => { localStorage.setItem("bcvRate", bcvRate); }, [bcvRate]);
  useEffect(() => { localStorage.setItem("customRate", customRate); }, [customRate]);
  useEffect(() => { localStorage.setItem("copRate", copRate); }, [copRate]);
  useEffect(() => { localStorage.setItem("products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("fiaos", JSON.stringify(fiaos)); }, [fiaos]);
  useEffect(() => { localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers)); }, [registeredUsers]);
  useEffect(() => { if (isAuthenticated) fetchBcvRate(); }, [isAuthenticated]);

  const fetchBcvRate = async () => {
    setLoadingRate(true);
    try {
      const response = await fetch("https://ve.descargas.net.ve/api/v1/bcv.json");
      if (response.ok) {
        const data = await response.json();
        if (data?.usd?.value) setBcvRate(parseFloat(data.usd.value));
      }
    } catch (e) { console.error(e); } finally { setLoadingRate(false); }
  };

  // --- MANEJADOR DE REGISTRO/LOGIN ACTUALIZADO ---
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = email.toLowerCase().trim();
    
    if (authMode === "register") {
      if (registeredUsers.find(u => u.email === cleanEmail)) return alert("Ya registrado.");
      
      const newUser = { 
        email: cleanEmail, 
        password, 
        businessName, 
        phone, 
        address, 
        businessType 
      };
      
      setRegisteredUsers([...registeredUsers, newUser]);
      setIsAuthenticated(true); 
      setAuthMode("app"); 
      setShowWelcome(true);
    } else {
      const u = registeredUsers.find(u => u.email === cleanEmail && u.password === password);
      if (u) { 
        setBusinessName(u.businessName); 
        setIsAuthenticated(true); 
        setAuthMode("app"); 
      } else alert("Datos incorrectos.");
    }
  };

  const handleAddProduct = () => {
    setProducts([...products, { id: Date.now(), name: productName, price: parseFloat(productPrice) || 0, specs: productSpecs }]);
    setProductName(""); setProductPrice(""); setProductSpecs(""); setActiveTab("consulta");
  };

  const handleSaveEdit = () => {
    setProducts(products.map(p => p.id === editingProduct.id ? { ...p, name: editName, price: parseFloat(editPrice) || 0, specs: editSpecs } : p));
    setEditingProduct(null);
  };const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = (evt) => {
      const lines = evt.target.result.split(/\r?\n/);
      const newProds = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim(); if (!line) continue;
        const cols = line.includes(";") ? line.split(";") : line.split(",");
        if (cols.length >= 2) {
          newProds.push({ id: Date.now() + i, name: cols[0].replace(/^["']|["']$/g, "").trim(), price: parseFloat(cols[1]) || 0, specs: cols[2] ? cols[2].replace(/^["']|["']$/g, "").trim() : "" });
        }
      }
      if (newProds.length) { setProducts([...products, ...newProds]); setActiveTab("consulta"); }
    };
    r.readAsText(file, "UTF-8");
  };

  const handleTriggerPrint = (product) => {
    setActivePrintProduct(product);
    setIsPrintingMode(true);
  };

  useEffect(() => {
    if (isPrintingMode && activePrintProduct) {
      window.print();
      setIsPrintingMode(false);
      setActivePrintProduct(null);
    }
  }, [isPrintingMode, activePrintProduct]);

  const handleAddFiao = () => {
    if (!clientName || !fiaoAmount) return alert("Introduce cliente y monto");
    const parsedAmount = parseFloat(fiaoAmount) || 0;
    setFiaos([...fiaos, { id: Date.now(), client: clientName, amount: parsedAmount, history: [`${fiaoConcept || "Fiao"} ($${parsedAmount.toFixed(2)})`] }]);
    setClientName(""); setFiaoConcept(""); setFiaoAmount("");
  };

  const handleSumarDeuda = (id) => {
    const m = parseFloat(prompt("¿Monto en USD ($)?:")); if (isNaN(m)) return;
    const c = prompt("¿Concepto?:") || "Nueva compra";
    setFiaos(fiaos.map(f => f.id === id ? { ...f, amount: (f.amount || 0) + m, history: [...(f.history || []), `${c} (+$${m.toFixed(2)})`] } : f));
  };

  const handleAbonarFiao = (id) => {
    const f = fiaos.find(x => x.id === id);
    if (!f) return;
    const currentAmount = f.amount || 0;
    const a = parseFloat(prompt(`Deuda: $${currentAmount.toFixed(2)}. ¿Abono USD?:`)); if (isNaN(a)) return;
    if (a >= currentAmount) {
      setFiaos(fiaos.filter(x => x.id !== id));
    } else {
      setFiaos(fiaos.map(x => x.id === id ? { ...x, amount: currentAmount - a, history: [...(x.history || []), `Abono (-$${a.toFixed(2)})`] } : x));
    }
  };

  const handleShareFiaoWhatsApp = (fiao) => {
    const currentAmount = fiao?.amount || 0;
    const totalBsBcv = (currentAmount * bcvRate).toFixed(2);
    const historialTexto = fiao?.history ? fiao.history.map(h => `• ${h}`).join("\n") : "Sin registros";
    const mensajePersonalizado = `👋 ¡Hola ${fiao?.client || "Cliente"}!\n\nTe saludamos de *${businessName || "nuestra bodega"}* para recordarte tu cuenta pendiente:\n\n📝 *Detalle de movimientos:*\n${historialTexto}\n\n💰 *Total pendiente:* $${currentAmount.toFixed(2)}\n🔹 *Al cambio (BCV):* ${totalBsBcv} Bs.\n\n¡Esperamos tu pronto pago! Gracias por tu confianza.`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(mensajePersonalizado)}`, "_blank");
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (isPrintingMode && activePrintProduct) {
    return (
      <div className="only-print-section-forced">
        <div className="ticket-etiqueta">
          <p className="sys-title">❖ {businessName || "BodegON"} ❖</p>
          <h2 className="prod-name">{activePrintProduct?.name || ""}</h2>
          <div className="price-main" style={{ fontSize: "32px", padding: "8px 0" }}>${(activePrintProduct?.price || 0).toFixed(2)}</div>
          <p style={{ fontSize: "9px", marginTop: "4px", color: "#444" }}>PRECIO NETO REF USD</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hide-on-print">
      {(!isAuthenticated && authMode === "landing") && (<Landing setAuthMode={setAuthMode} />)}
      {(!isAuthenticated && authMode !== "landing") && (
        <div className="container" style={{ paddingTop: "20px" }}>
          <div className="card auth-card">
            <button onClick={() => setAuthMode("landing")} className="btn-back-landing">← Volver</button>
            <form onSubmit={handleAuthSubmit}>
  <div className="form-group">
    <label>Correo:</label>
    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
  </div>

  {authMode === "register" && (
    <>
      <div className="form-group"><label>Nombre del Negocio:</label><input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required /></div>
      <div className="form-group"><label>Teléfono:</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required /></div>
      <div className="form-group"><label>Dirección:</label><input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required /></div>
      <div className="form-group">
        <label>Tipo de Negocio:</label>
        <select value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
          <option value="bodega">Bodega</option>
          <option value="bodegon">Bodegón</option>
          <option value="repuestos">Repuestos</option>
          <option value="licores">Licores</option>
          <option value="otro">Otro</option>
        </select>
      </div>
    </>
  )}

  <div className="form-group">
    <label>Contraseña:</label>
    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
  </div>

  <button type="submit" className="btn-success" style={{ width: "100%", marginTop: "10px" }}>
    {authMode === "login" ? "Entrar" : "Registrarse"}
  </button>
</form>

{/* Mensaje de bienvenida */}
{showWelcome && (
  <div className="welcome-modal">
    <h2>¡Bienvenido a BodegON!</h2>
    <p>Tienes 48 horas de prueba gratuita.</p>
    <button onClick={() => setShowWelcome(false)}>Entendido</button>
  </div>
)}
          </div>
        </div>
      )}
      {isAuthenticated && (
        <main className="container">
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><h1 style={{ margin: 0 }}>BodegON</h1><span style={{ fontSize: "0.8rem", color: "#666" }}>{businessName}</span></div>
            <button onClick={() => { setIsAuthenticated(false); setAuthMode("landing"); }} className="btn-delete-small">Salir 🚪</button>
          </header>
          <section className="card config-rates" style={{ marginTop: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Tasas de Cambio</h2>
              <button onClick={fetchBcvRate} className="btn-print" style={{ padding: "4px 8px", fontSize: "0.7rem" }}>{loadingRate ? "⏳..." : "🔄 BCV"}</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
  <div>
    <label style={{ fontSize: "0.8rem" }}>BCV (Bs):</label>
    <input 
      type="number" 
      value={bcvRate === 0 ? "" : bcvRate} 
      onChange={(e) => setBcvRate(e.target.value === "" ? 0 : parseFloat(e.target.value))} 
      step="0.01" 
      style={{ width: "100%" }} 
    />
  </div>
  <div>
    <label style={{ fontSize: "0.8rem" }}>Pers (Bs):</label>
    <input 
      type="number" 
      value={customRate === 0 ? "" : customRate} 
      onChange={(e) => setCustomRate(e.target.value === "" ? 0 : parseFloat(e.target.value))} 
      step="0.01" 
      style={{ width: "100%" }} 
    />
  </div>
  <div>
    <label style={{ fontSize: "0.8rem" }}>COP ($):</label>
    <input 
      type="number" 
      value={copRate === 0 ? "" : copRate} 
      onChange={(e) => setCopRate(e.target.value === "" ? 0 : parseFloat(e.target.value))} 
      style={{ width: "100%" }} 
    />
  </div>
</div></section>
          <div className="tab-navigation" style={{ margin: "15px 0" }}>
            <button className={`tab-btn ${activeTab === "consulta" ? "active" : ""}`} onClick={() => setActiveTab("consulta")}>🔍 Buscar</button>
            <button className={`tab-btn ${activeTab === "carga" ? "active" : ""}`} onClick={() => setActiveTab("carga")}>➕ Cargar</button>
            <button className={`tab-btn ${activeTab === "fiaos" ? "active" : ""}`} onClick={() => setActiveTab("fiaos")}>📋 Fiaos</button>
          </div>
          {activeTab === "consulta" && (
            <section className="card">
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar producto..." style={{ width: "100%", marginBottom: "15px" }} />
              {editingProduct && (
                <div className="card" style={{ background: "#f1f5f9", border: "1px solid var(--primary-color)", marginBottom: "15px" }}>
                  <h4>✏️ Editar: {editingProduct.name}</h4>
                  <div className="form-group"><input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nombre" /></div>
                  <div className="form-group"><input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} placeholder="Precio" /></div>
                  <div className="form-group"><input type="text" value={editSpecs} onChange={(e) => setEditSpecs(e.target.value)} placeholder="Notas" /></div>
                  <button onClick={handleSaveEdit} className="btn-success" style={{ marginRight: "10px" }}>Guardar</button>
                  <button onClick={() => setEditingProduct(null)} className="btn-delete-small">Cancelar</button>
                </div>
              )}
              <div className="lista-productos">
                {filteredProducts.map(p => (<ProductCard key={p.id} product={p} bcvRate={bcvRate} customRate={customRate} copRate={copRate} onDelete={(id) => setProducts(products.filter(x => x.id !== id))} onPrint={handleTriggerPrint} onEdit={(prod) => { setEditingProduct(prod); setEditName(prod.name); setEditPrice(prod.price); setEditSpecs(prod.specs || ""); }} />))}
              </div>
            </section>
          )}
          {activeTab === "carga" && (
            <>
              <section className="card">
                <h3>Carga Manual</h3>
                <div className="form-group"><input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Nombre del producto" /></div>
                <div className="form-group"><input type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} placeholder="Precio Base ($)" /></div>
                <div className="form-group"><input type="text" value={productSpecs} onChange={(e) => setProductSpecs(e.target.value)} placeholder="Notas/Especificaciones" /></div>
                <button onClick={handleAddProduct} className="btn-success" style={{ width: "100%" }}>Guardar Producto</button>
              </section>
              <section className="card" style={{ marginTop: "15px", borderTop: "3px solid var(--primary-color)" }}>
                <h3>📥 Importar CSV masivo</h3>
                <label style={{ cursor: "pointer", background: "#f8fafc", border: "2px dashed #cbd5e1", padding: "15px", borderRadius: "8px", display: "block", textAlign: "center" }}>
                  📁 Seleccionar archivo .CSV<input type="file" accept=".csv" onChange={handleCSVUpload} style={{ display: "none" }} />
                </label>
              </section>
            </>
          )}
          {activeTab === "fiaos" && (
            <section className="card">
              <div className="total-fiaos-box" style={{ background: "#fff5f5", padding: "10px", borderRadius: "6px" }}>
                <p style={{ margin: 0 }}><strong>Total Fiaos:</strong> ${fiaos.reduce((s, i) => s + (i?.amount || 0), 0).toFixed(2)}</p>
              </div>
              <div style={{ marginTop: "15px" }}>
                <h4>Anotar Cuenta</h4>
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Cliente" style={{ marginBottom: "5px", width: "100%" }} />
                <input type="text" value={fiaoConcept} onChange={(e) => setFiaoConcept(e.target.value)} placeholder="Concepto" style={{ marginBottom: "5px", width: "100%" }} />
                <input type="number" value={fiaoAmount} onChange={(e) => setFiaoAmount(e.target.value)} placeholder="Monto $" style={{ marginBottom: "10px", width: "100%" }} />
                <button onClick={handleAddFiao} className="btn-primary" style={{ width: "100%" }}>Registrar Deuda</button>
              </div>
              <div style={{ marginTop: "20px" }}>
                {fiaos.map(f => (
                  <div key={f.id} className="card" style={{ padding: "10px", marginBottom: "15px", border: "1px solid #ddd" }}>
                    <p style={{ margin: "0 0 5px 0" }}>👤 <strong>{f?.client}</strong></p>
                    <p style={{ color: "var(--danger-color)", margin: "0 0 5px 0" }}><strong>Debe: ${(f?.amount || 0).toFixed(2)}</strong></p>
                    <div style={{ background: "#f8f9fa", padding: "8px", borderRadius: "4px", fontSize: "0.8rem", marginBottom: "10px" }}>
                      <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>Historial:</p>
                      {f.history.map((h, idx) => <div key={idx}>{h}</div>)}
                    </div>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button onClick={() => handleSumarDeuda(f.id)} className="btn-print" style={{ fontSize: "0.75rem", background: "#34495e", color: "#fff", flex: 1 }}>＋ Compra</button>
                      <button onClick={() => handleAbonarFiao(f.id)} className="btn-success" style={{ fontSize: "0.75rem", flex: 1 }}>💸 Abono</button>
                      <button onClick={() => handleShareFiaoWhatsApp(f)} className="btn-whatsapp" style={{ fontSize: "0.75rem", flex: 1, margin: 0, padding: "4px" }}>📲 Cobrar</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      )}
      {showWelcome && (
        <div style={{ position: "fixed", top: "0", left: "0", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: "9999" }}>
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "10px", textAlign: "center", color: "black", maxWidth: "400px", margin: "20px" }}>
            <h2>¡Bienvenido a BodegON!</h2>
            <p>Tu prueba gratuita de <strong>48 horas</strong> ha comenzado.</p>
            <p>Al finalizar este periodo, por favor contáctame para poder seguir disfrutando del sistema.</p>
            <button onClick={() => setShowWelcome(false)} style={{ padding: "10px 20px", marginTop: "15px", cursor: "pointer", backgroundColor: "#34495e", color: "white", border: "none", borderRadius: "5px" }}>Entendido</button>
          </div>
        </div>
      )}
    </div>
  );
}
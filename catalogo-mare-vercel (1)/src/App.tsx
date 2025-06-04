
import React, { useEffect, useState } from 'react';

interface Producto {
  Código: string;
  Nombre: string;
  Precio: number;
  Imagen: string;
  Colores: string[];
}

interface ItemCarrito extends Producto {
  colorSeleccionado: string;
  cantidad: number;
}

function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/Ferabensrl/catalogo-mare/main/src/Datos/catalogo-mare1.json')
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error('Error cargando productos:', error));
  }, []);

  const agregarAlCarrito = (producto: Producto, color: string, cantidad: number) => {
    if (!color || cantidad <= 0) return;

    const existente = carrito.find(item => item.Código === producto.Código && item.colorSeleccionado === color);
    if (existente) {
      setCarrito(carrito.map(item =>
        item.Código === producto.Código && item.colorSeleccionado === color
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, colorSeleccionado: color, cantidad }]);
    }
  };

  const eliminarDelCarrito = (codigo: string, color: string) => {
    setCarrito(carrito.filter(item => !(item.Código === codigo && item.colorSeleccionado === color)));
  };

  return (
    <div className="p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-center">Catálogo MARÉ</h1>
      <button className="fixed top-4 right-4 bg-pink-600 text-white px-4 py-2 rounded-xl shadow-lg z-50" onClick={() => setMostrarCarrito(true)}>
        🛒 Ver pedido ({carrito.reduce((acc, item) => acc + item.cantidad, 0)})
      </button>

      {!mostrarCarrito ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div key={producto.Código} className="border rounded-xl p-4 shadow-md bg-white">
              <img src={producto.Imagen} alt={producto.Nombre} className="w-full object-cover mb-2 rounded-md h-28" />
              <h2 className="text-lg font-semibold">{producto.Nombre}</h2>
              <p className="text-pink-700 font-bold">${producto.Precio.toFixed(2)}</p>
              <div className="mt-2">
                <label className="text-sm">Color:</label>
                <select
                  className="block w-full border mt-1 rounded-md"
                  onChange={(e) => (producto as any).colorTemp = e.target.value}
                >
                  <option value="">Seleccionar color</option>
                  {producto.Colores.map((color, idx) => (
                    <option key={idx} value={color}>{color}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  defaultValue={1}
                  className="block w-full mt-2 border rounded-md px-2"
                  onChange={(e) => (producto as any).cantidadTemp = parseInt(e.target.value)}
                />
                <button
                  className="mt-2 bg-pink-600 text-white px-3 py-1 rounded-md w-full"
                  onClick={() => agregarAlCarrito(producto, (producto as any).colorTemp, (producto as any).cantidadTemp || 1)}
                >
                  Agregar al pedido
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
          <ul>
            {carrito.map((item, index) => (
              <li key={index} className="mb-2 border-b pb-2">
                <strong>{item.Nombre}</strong> - {item.colorSeleccionado} x {item.cantidad}
                <span className="float-right font-semibold">${(item.Precio * item.cantidad).toFixed(2)}</span>
                <button
                  onClick={() => eliminarDelCarrito(item.Código, item.colorSeleccionado)}
                  className="ml-2 text-red-500 hover:underline text-sm"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-right font-bold text-lg">
            Total: ${carrito.reduce((acc, item) => acc + item.Precio * item.cantidad, 0).toFixed(2)}
          </div>
          <div className="mt-4 flex justify-between">
            <button className="bg-gray-300 text-black px-4 py-2 rounded-md" onClick={() => setMostrarCarrito(false)}>
              Volver
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md">
              Finalizar pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

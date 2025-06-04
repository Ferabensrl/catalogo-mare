
import React, { useEffect, useState } from "react";

interface Producto {
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  medidas: string;
  imagenes: string[];
  colores: string[];
}

const App = () => {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    fetch("/Datos/catalogo-mare1.json")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  return (
    <div className="p-4 font-sans">
      <h1 className="text-2xl font-bold mb-6">Catálogo MARÉ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {productos.map((producto, index) => (
          <div key={index} className="border rounded-2xl p-4 shadow-md">
            <h2 className="text-lg font-semibold mb-2">{producto.nombre}</h2>
            <p className="text-sm text-gray-700 mb-2">{producto.descripcion}</p>
            <p className="text-sm mb-2"><strong>Precio:</strong> ${producto.precio.toFixed(2)}</p>
            <p className="text-sm mb-2"><strong>Medidas:</strong> {producto.medidas}</p>
            <div className="overflow-x-auto flex space-x-2 mb-2">
              {producto.imagenes.map((img, i) => (
                <img key={i} src={img} alt={producto.nombre} className="h-28 rounded-lg border" />
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {producto.colores.map((color, i) => (
                <span key={i} className="px-2 py-1 text-xs bg-gray-200 rounded-full">{color}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
